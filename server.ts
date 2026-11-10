import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { AGENTS, HANA_ORCHESTRATOR } from './src/data/agents.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '20mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const PRIMARY_MODEL = 'gemini-3.8-flash';
const MODEL_NAME = PRIMARY_MODEL;
const FALLBACK_MODELS = ['gemini-flash-latest', 'gemini-3.1-flash-lite'];

// Robust retry wrapper with exponential backoff & model fallback for API resilience
async function generateContentWithRetry(params: any, retries = 3, delay = 600): Promise<any> {
  const modelsToTry = [params.model || PRIMARY_MODEL, ...FALLBACK_MODELS];

  for (const modelCandidate of modelsToTry) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await ai.models.generateContent({
          ...params,
          model: modelCandidate,
        });
      } catch (err: any) {
        const errMsg = err?.message || '';
        const isTemporarySpike =
          errMsg.includes('503') ||
          errMsg.includes('UNAVAILABLE') ||
          errMsg.includes('high demand') ||
          errMsg.includes('429');

        if (isTemporarySpike) {
          if (attempt < retries) {
            console.warn(`Model ${modelCandidate} attempt ${attempt} returned 503/429. Retrying in ${delay}ms...`);
            await new Promise((r) => setTimeout(r, delay));
            delay *= 1.5;
            continue;
          } else {
            console.warn(`Model ${modelCandidate} exhausted retries. Trying fallback model...`);
            break; // Try next fallback model
          }
        } else {
          throw err;
        }
      }
    }
  }

  throw new Error('All models temporarily unavailable. Please retry in a few moments.');
}

// Agent metadata endpoint
app.get('/api/agents', (req: Request, res: Response) => {
  res.json({
    orchestrator: HANA_ORCHESTRATOR,
    agents: AGENTS,
  });
});

// MoE Orchestration Triage Endpoint
app.post('/api/orchestrate', async (req: Request, res: Response) => {
  try {
    const { query, attachments } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required for orchestration' });
    }

    const agentsList = AGENTS.map(
      (a) => `ID: ${a.id} | Capability: ${a.capabilityId} (${a.name} - ${a.role}) | Focus: ${a.domain}`
    ).join('\n');

    const promptText = `User Problem / Request:
"${query}"

Available Capability Agents in the SMOE Network:
${agentsList}

Evaluate this request as Hana, Chief MoE Orchestration and Triage Layer.
Score every agent's relevance from 0 to 100 based on how directly their capability solves this problem.
Select the top 2 or 3 agents to activate (mark activated: true, others false).
Provide a concise triage analysis summarizing what the problem requires and which domains must collaborate.`;

    const contents: any[] = [{ text: promptText }];

    // If attachments present, add them
    if (attachments && Array.isArray(attachments)) {
      for (const att of attachments) {
        if (att.dataUrl && att.type?.startsWith('image/')) {
          const base64Data = att.dataUrl.split(',')[1] || att.dataUrl;
          contents.push({
            inlineData: {
              mimeType: att.type,
              data: base64Data,
            },
          });
        }
      }
    }

    const response = await generateContentWithRetry({
      model: MODEL_NAME,
      contents: { parts: contents },
      config: {
        systemInstruction: HANA_ORCHESTRATOR.systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            triageAnalysis: {
              type: Type.STRING,
              description: 'Hana’s high-level strategic triage of the problem.',
            },
            dominantDomain: {
              type: Type.STRING,
              description: 'The primary capability domain leading the solution.',
            },
            routerScores: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  agentId: { type: Type.STRING },
                  name: { type: Type.STRING },
                  score: { type: Type.NUMBER },
                  reason: { type: Type.STRING },
                  activated: { type: Type.BOOLEAN },
                },
                required: ['agentId', 'name', 'score', 'reason', 'activated'],
              },
            },
            activatedAgents: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of agent IDs activated for this query.',
            },
          },
          required: ['triageAnalysis', 'dominantDomain', 'routerScores', 'activatedAgents'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({
      query,
      ...parsed,
    });
  } catch (error: any) {
    console.error('Error during orchestration:', error);
    res.status(500).json({ error: error.message || 'Failed to triage request' });
  }
});

// Full Multi-Agent Chat Execution Endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { mode, query, history = [], selectedAgentId, activeAgentIds = [], attachments = [] } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Prepare attachment parts if any
    const attachmentParts: any[] = [];
    if (attachments && Array.isArray(attachments)) {
      for (const att of attachments) {
        if (att.dataUrl && att.type?.startsWith('image/')) {
          const base64Data = att.dataUrl.split(',')[1] || att.dataUrl;
          attachmentParts.push({
            inlineData: {
              mimeType: att.type,
              data: base64Data,
            },
          });
        }
      }
    }

    // MODE 1: Direct Single Agent Chat
    if (mode === 'single_agent' && selectedAgentId) {
      const agent = AGENTS.find((a) => a.id === selectedAgentId);
      if (!agent) {
        return res.status(404).json({ error: 'Agent not found' });
      }

      const formattedHistory = history.map((h: any) => `${h.role === 'user' ? 'User' : agent.name}: ${h.content}`).join('\n');
      const fullPrompt = formattedHistory
        ? `Conversation History:\n${formattedHistory}\n\nUser: ${query}`
        : query;

      const contents: any[] = [...attachmentParts, { text: fullPrompt }];

      const response = await generateContentWithRetry({
        model: MODEL_NAME,
        contents: { parts: contents },
        config: {
          systemInstruction: agent.systemPrompt,
        },
      });

      return res.json({
        content: response.text,
        speaker: {
          id: agent.id,
          name: agent.name,
          role: agent.role,
        },
      });
    }

    // MODE 2: Direct Hana Orchestrator Chat
    if (mode === 'hana_orchestrator') {
      const formattedHistory = history.map((h: any) => `${h.role === 'user' ? 'User' : 'Hana'}: ${h.content}`).join('\n');
      const fullPrompt = formattedHistory
        ? `Conversation History:\n${formattedHistory}\n\nUser: ${query}`
        : query;

      const contents: any[] = [...attachmentParts, { text: fullPrompt }];

      const response = await generateContentWithRetry({
        model: MODEL_NAME,
        contents: { parts: contents },
        config: {
          systemInstruction: HANA_ORCHESTRATOR.systemPrompt,
        },
      });

      return res.json({
        content: response.text,
        speaker: {
          id: HANA_ORCHESTRATOR.id,
          name: HANA_ORCHESTRATOR.name,
          role: HANA_ORCHESTRATOR.role,
        },
      });
    }

    // MODE 3: SMoE Swarm / Multi-Agent Collaborative Panel
    // Step A: Triage & Determine Expert Activation if not manually set
    let routingData: any = null;
    let targetAgentIds: string[] = activeAgentIds;

    if (!targetAgentIds || targetAgentIds.length === 0) {
      const agentsList = AGENTS.map(
        (a) => `ID: ${a.id} | ${a.name} (${a.capabilityId}) | Domain: ${a.domain}`
      ).join('\n');

      const triagePrompt = `User Prompt: "${query}"\n\nAgents:\n${agentsList}\n\nScore all agents 0-100 and pick the top 2-3 most critical experts to activate.`;
      
      const triageRes = await generateContentWithRetry({
        model: MODEL_NAME,
        contents: triagePrompt,
        config: {
          systemInstruction: HANA_ORCHESTRATOR.systemPrompt,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              triageAnalysis: { type: Type.STRING },
              dominantDomain: { type: Type.STRING },
              routerScores: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    agentId: { type: Type.STRING },
                    name: { type: Type.STRING },
                    score: { type: Type.NUMBER },
                    reason: { type: Type.STRING },
                    activated: { type: Type.BOOLEAN },
                  },
                  required: ['agentId', 'name', 'score', 'reason', 'activated'],
                },
              },
              activatedAgents: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['triageAnalysis', 'dominantDomain', 'routerScores', 'activatedAgents'],
          },
        },
      });

      routingData = JSON.parse(triageRes.text || '{}');
      targetAgentIds = routingData.activatedAgents || ['agent_strategy', 'agent_design'];
    }

    // Step B: Collect Expert Perspectives from each activated agent
    const chosenAgents = AGENTS.filter((a) => targetAgentIds.includes(a.id));
    const agentResponses: any[] = [];

    // Parallel calls to each activated agent for maximum speed
    const expertPromises = chosenAgents.map(async (agent) => {
      const prompt = `User Request: "${query}"
You are ${agent.name}, ${agent.role} (${agent.domain}).
Provide your specialist analysis, identifying:
1. Core challenge & strategic opportunity from your capability domain.
2. Concrete solutions, architecture, or deliverables you propose.
3. Specific trade-offs, metrics, or execution traps to avoid.
Be high-impact, actionable, and stay firmly within your expertise domain.`;

      const contents: any[] = [...attachmentParts, { text: prompt }];

      const res = await generateContentWithRetry({
        model: MODEL_NAME,
        contents: { parts: contents },
        config: {
          systemInstruction: agent.systemPrompt,
        },
      });

      return {
        agentId: agent.id,
        agentName: agent.name,
        role: agent.role,
        capabilityId: agent.capabilityId,
        content: res.text || '',
        roundType: 'initial_perspective',
      };
    });

    const expertResults = await Promise.all(expertPromises);
    agentResponses.push(...expertResults);

    // Step C: Hana MoE Executive Synthesis
    const expertsDigest = agentResponses
      .map((r) => `### ${r.agentName} (${r.role}):\n${r.content}`)
      .join('\n\n');

    const synthesisPrompt = `User Prompt: "${query}"

Specialist Contributions from Activated Agents:
${expertsDigest}

As HANA, Chief MoE Orchestrator:
Synthesize these specialist viewpoints into:
1. An Executive Summary aligning the strategic, aesthetic, and technical decisions.
2. 3-4 Key Consensus Points where the agents reinforce one another.
3. 3-5 Concrete Action Items, each assigned to an owner agent with a priority (High, Medium, Low).
4. A direct executive response tying everything together for the client.`;

    const synthesisRes = await generateContentWithRetry({
      model: MODEL_NAME,
      contents: synthesisPrompt,
      config: {
        systemInstruction: HANA_ORCHESTRATOR.systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            executiveSummary: { type: Type.STRING },
            executiveResponse: { type: Type.STRING },
            consensusPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            actionItems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  task: { type: Type.STRING },
                  ownerAgent: { type: Type.STRING },
                  priority: { type: Type.STRING },
                },
                required: ['task', 'ownerAgent', 'priority'],
              },
            },
          },
          required: ['executiveSummary', 'executiveResponse', 'consensusPoints', 'actionItems'],
        },
      },
    });

    const synthesisData = JSON.parse(synthesisRes.text || '{}');

    return res.json({
      content: synthesisData.executiveResponse || synthesisData.executiveSummary,
      routingResult: routingData,
      agentResponses,
      synthesis: {
        executiveSummary: synthesisData.executiveSummary,
        consensusPoints: synthesisData.consensusPoints,
        actionItems: synthesisData.actionItems,
      },
      speaker: {
        id: HANA_ORCHESTRATOR.id,
        name: HANA_ORCHESTRATOR.name,
        role: HANA_ORCHESTRATOR.role,
      },
    });
  } catch (error: any) {
    console.error('Error during chat processing:', error);
    res.status(500).json({ error: error.message || 'Failed to process chat message' });
  }
});

// Client Intake & Scope Charter Generation Endpoint
app.post('/api/intake/charter', async (req: Request, res: Response) => {
  try {
    const intake = req.body;
    if (!intake.clientName || !intake.projectBrief) {
      return res.status(400).json({ error: 'Client name and project brief are required.' });
    }

    const prompt = `Client Intake Details:
- Client / Lead Name: ${intake.clientName}
- Company: ${intake.company || 'Confidential'}
- Email: ${intake.email || 'N/A'}
- Website: ${intake.website || 'N/A'}
- Primary Requirements Category: ${intake.primaryCategory || 'General'}
- Timeline / Budget Constraints: ${intake.budgetOrTimeline || 'Flexible'}
- Target Audience: ${intake.targetAudience || 'General market'}
- Project Brief / Objectives: "${intake.projectBrief}"

As HANA and the SMOEDESIGN Collective, generate a comprehensive, deployment-ready Project Charter & Scope Document:
1. Executive Assessment (Vision, Value Proposition, Strategic Moat)
2. Recommended Specialist Squad (Select 3-4 agents from the 8 capabilities with their roles)
3. 8-Capability Scope Matrix (concrete deliverables mapped to 01 Strategy, 02 Design, 03 Dev, 04 BD, 05 Intel, 06 Marketing, 07 Sales, 08 PR/CRM)
4. 4-Phase Delivery Roadmap (Kickoff & Discovery, Systems & Architecture, Build & Polish, Launch & Handover)
5. Critical Risks & Mitigation Matrix
6. Next Concrete Step & Recommended Kickoff Date (e.g. within 3 business days).`;

    const response = await generateContentWithRetry({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: HANA_ORCHESTRATOR.systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            projectName: { type: Type.STRING },
            executiveSummary: { type: Type.STRING },
            recommendedLead: { type: Type.STRING },
            staffedSquad: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  agentId: { type: Type.STRING },
                  name: { type: Type.STRING },
                  capabilityId: { type: Type.STRING },
                  assignedRole: { type: Type.STRING },
                  weeklyAllocation: { type: Type.STRING },
                },
                required: ['agentId', 'name', 'capabilityId', 'assignedRole', 'weeklyAllocation'],
              },
            },
            capabilityScope: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  code: { type: Type.STRING },
                  title: { type: Type.STRING },
                  deliverables: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  priority: { type: Type.STRING },
                },
                required: ['code', 'title', 'deliverables', 'priority'],
              },
            },
            roadmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phase: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  milestones: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['phase', 'duration', 'milestones'],
              },
            },
            risks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  risk: { type: Type.STRING },
                  impact: { type: Type.STRING },
                  mitigation: { type: Type.STRING },
                },
                required: ['risk', 'impact', 'mitigation'],
              },
            },
            kickoffSchedule: {
              type: Type.OBJECT,
              properties: {
                proposedDate: { type: Type.STRING },
                agenda: { type: Type.STRING },
                prepChecklist: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['proposedDate', 'agenda', 'prepChecklist'],
            },
          },
          required: [
            'projectName',
            'executiveSummary',
            'recommendedLead',
            'staffedSquad',
            'capabilityScope',
            'roadmap',
            'risks',
            'kickoffSchedule',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error generating project charter:', error);
    res.status(500).json({ error: error.message || 'Failed to generate project charter' });
  }
});

// Setup Vite Dev Server Middleware or Static Serve
async function setupServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SMOE Agents Server running at http://0.0.0.0:${PORT}`);
  });
}

setupServer();
