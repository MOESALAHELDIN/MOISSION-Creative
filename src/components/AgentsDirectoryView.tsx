import React, { useState } from 'react';
import {
  Users,
  Sparkles,
  Bot,
  Zap,
  Volume2,
  ArrowRight,
  Code2,
  Terminal,
  ShieldCheck,
} from 'lucide-react';
import { AGENTS, HANA_ORCHESTRATOR } from '../data/agents';
import { AgentInfo } from '../types';
import { speakText } from '../utils/tts';

interface AgentsDirectoryViewProps {
  onSelectAgentForChat: (agentId: string, initialPrompt?: string) => void;
}

export const AgentsDirectoryView: React.FC<AgentsDirectoryViewProps> = ({
  onSelectAgentForChat,
}) => {
  const [selectedAgent, setSelectedAgent] = useState<AgentInfo | null>(AGENTS[0]);
  const [testQuery, setTestQuery] = useState('');
  const [testResult, setTestResult] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleTestTriage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testQuery.trim()) return;

    setIsTesting(true);
    try {
      const res = await fetch('/api/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: testQuery }),
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <Users className="w-4 h-4" />
            <span>SMOE CAPABILITY ROSTER & SPECIALIST MATRIX</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            8-Capability Agent Collective
          </h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Meet the domain experts governed by Hana's Mixture-of-Experts routing network. Each
            specialist commands distinct system instructions, heuristics, and reasoning lenses.
          </p>
        </div>

        {/* Hana Orchestrator badge */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white text-sm shadow-md">
            H
          </div>
          <div className="text-xs">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>Hana</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                MoE Triage
              </span>
            </div>
            <p className="text-zinc-400 text-[11px]">Orchestrator & Synthesis Layer</p>
          </div>
        </div>
      </div>

      {/* Interactive Gating Simulator */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 mb-2">
          <Zap className="w-4 h-4" />
          <span>Interactive MoE Gating Simulator</span>
        </div>
        <p className="text-xs text-zinc-400 mb-4">
          Type any business, design, or engineering problem below to observe how Hana calculates
          expert gating weights in real time.
        </p>

        <form onSubmit={handleTestTriage} className="flex gap-2">
          <input
            type="text"
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            placeholder="e.g. How do we reduce churn for our B2B SaaS while improving UI aesthetics?"
            className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700/80 text-zinc-100 text-xs focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={isTesting || !testQuery.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium text-xs shadow-md hover:from-indigo-500 hover:to-violet-500 disabled:opacity-40 transition-all flex items-center gap-2"
          >
            {isTesting ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>Simulate Gating</span>
          </button>
        </form>

        {testResult && (
          <div className="mt-4 pt-4 border-t border-zinc-800 space-y-3">
            <div className="text-xs text-zinc-300 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
              <span className="font-semibold text-indigo-300">Triage: </span>
              {testResult.triageAnalysis}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {testResult.routerScores?.map((score: any) => {
                const agent = AGENTS.find((a) => a.id === score.agentId);
                return (
                  <div
                    key={score.agentId}
                    className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                      score.activated
                        ? 'bg-zinc-850 border-indigo-500/50 shadow-sm'
                        : 'bg-zinc-950/40 border-zinc-800/80 opacity-70'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: agent?.avatarColor }}
                      />
                      <span className="font-semibold text-zinc-200 truncate">{score.name}</span>
                    </div>
                    <span className="font-mono font-bold text-[11px] text-indigo-400">
                      {Math.round(score.score)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {AGENTS.map((agent) => (
          <div
            key={agent.id}
            className="group relative bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 shadow-lg transition-all flex flex-col justify-between"
            style={{
              borderColor:
                selectedAgent?.id === agent.id ? `${agent.avatarColor}60` : undefined,
            }}
          >
            <div>
              {/* Top row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-8 h-8 rounded-xl flex items-center justify-center font-mono text-xs font-black text-white shadow-md"
                    style={{ backgroundColor: agent.avatarColor }}
                  >
                    {agent.capabilityId}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-zinc-100 flex items-center gap-1.5">
                      {agent.name}
                    </h3>
                    <p className="text-[11px] text-zinc-400">{agent.role}</p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    speakText(
                      `Hello, I am ${agent.name}, ${agent.role}. ${agent.tagline}`,
                      agent.voicePitch,
                      agent.voiceRate
                    )
                  }
                  title="Preview agent voice"
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Tagline */}
              <p className="text-xs text-zinc-300 italic mb-3 leading-relaxed">
                "{agent.tagline}"
              </p>

              {/* Domain */}
              <div className="text-[11px] text-zinc-400 mb-3">
                <span className="font-medium text-zinc-300">Domain: </span>
                {agent.domain}
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1 mb-4">
                {agent.skills.slice(0, 3).map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-950 text-zinc-400 border border-zinc-800/80"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Launch button */}
            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
              <button
                onClick={() => setSelectedAgent(agent)}
                className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Prompt Spec</span>
              </button>

              <button
                onClick={() => onSelectAgentForChat(agent.id, agent.suggestedPrompts[0])}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 text-white shadow-xs transition-opacity hover:opacity-90"
                style={{ backgroundColor: agent.avatarColor }}
              >
                <span>Direct Chat</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Agent Prompt Spec Inspector Drawer / Modal */}
      {selectedAgent && (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2.5">
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold text-white shadow-xs"
                style={{ backgroundColor: selectedAgent.avatarColor }}
              >
                {selectedAgent.capabilityId}
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">
                  {selectedAgent.name} · System Instruction Spec
                </h3>
                <p className="text-[11px] text-zinc-400">{selectedAgent.role}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedAgent(null)}
              className="text-xs text-zinc-400 hover:text-white px-2.5 py-1 rounded-lg hover:bg-zinc-800"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                System Prompt (Injected to Gemini 3.8 Flash)
              </span>
              <pre className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                {selectedAgent.systemPrompt}
              </pre>
            </div>

            <div className="space-y-3">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                Suggested Prompts
              </span>
              <div className="space-y-2">
                {selectedAgent.suggestedPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => onSelectAgentForChat(selectedAgent.id, prompt)}
                    className="w-full text-left p-2.5 rounded-xl bg-zinc-950/80 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 hover:text-white transition-all flex items-center justify-between group"
                  >
                    <span>{prompt}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white flex-shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
