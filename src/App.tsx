import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { RoutingVisualizer } from './components/RoutingVisualizer';
import { ChatMessageItem } from './components/ChatMessageItem';
import { ChatInput } from './components/ChatInput';
import { IntakeCharterView } from './components/IntakeCharterView';
import { StudioView } from './components/StudioView';
import { AgentsDirectoryView } from './components/AgentsDirectoryView';
import { DecisionsVaultView } from './components/DecisionsVaultView';
import { ChatMessage, ChatMode, MoEResult } from './types';
import { AGENTS, HANA_ORCHESTRATOR } from './data/agents';
import { exportChatToMarkdown } from './utils/export';
import { Sparkles, Layers, Cpu, ArrowDown } from 'lucide-react';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome',
    role: 'assistant',
    content:
      'Welcome to MOISSION Creative. I am HANA, your Chief Mixture-of-Experts (SMoE) Orchestration & Triage Layer.\n\nI dynamically triage your briefs and deploy our eight specialized capability agents:\n• 01 Strategy (Ares)\n• 02 Design (Kael)\n• 03 Development (Nexus)\n• 04 Business Development (Vanguard)\n• 05 Intelligence (Athena)\n• 06 Marketing (Pulse)\n• 07 Sales (Closer)\n• 08 PR / CRM (Aura)\n\nAsk a complex challenge below or select a preset scenario. I will evaluate the gating topology, activate the ideal specialists, and synthesize an executive action blueprint.',
    timestamp: new Date().toISOString(),
    speaker: {
      id: HANA_ORCHESTRATOR.id,
      name: HANA_ORCHESTRATOR.name,
      role: HANA_ORCHESTRATOR.role,
    },
  },
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<'chat' | 'studio' | 'intake' | 'agents' | 'decisions'>('chat');
  const [chatMode, setChatMode] = useState<ChatMode>('smoe_swarm');
  const [selectedAgentId, setSelectedAgentId] = useState<string>('agent_strategy');
  const [activeAgentIds, setActiveAgentIds] = useState<string[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [latestRouting, setLatestRouting] = useState<MoEResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisualizerOpen, setIsVisualizerOpen] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (currentTab === 'chat') {
      scrollToBottom();
    }
  }, [messages, currentTab]);

  const handleToggleAgent = (agentId: string) => {
    setActiveAgentIds((prev) =>
      prev.includes(agentId) ? prev.filter((id) => id !== agentId) : [...prev, agentId]
    );
  };

  const handleSend = async (
    query: string,
    mode: ChatMode,
    agentId?: string,
    attachments: { name: string; type: string; dataUrl: string }[] = []
  ) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toISOString(),
      attachments,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          query,
          selectedAgentId: agentId,
          activeAgentIds,
          attachments,
        }),
      });

      if (!res.ok) {
        throw new Error(`Chat request failed: ${res.statusText}`);
      }

      const data = await res.json();

      if (data.routingResult) {
        setLatestRouting(data.routingResult);
      }

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toISOString(),
        routingResult: data.routingResult,
        agentResponses: data.agentResponses,
        synthesis: data.synthesis,
        speaker: data.speaker,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error: any) {
      console.error('Chat error:', error);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `Error: ${error.message || 'Failed to communicate with agent network. Please verify Gemini API settings.'}`,
        timestamp: new Date().toISOString(),
        speaker: {
          id: 'system',
          name: 'System Alert',
          role: 'Triage Monitor',
        },
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScenarioSelect = (prompt: string, targetAgents?: string[]) => {
    if (targetAgents && targetAgents.length > 0) {
      setActiveAgentIds(targetAgents);
    }
    setChatMode('smoe_swarm');
    handleSend(prompt, 'smoe_swarm');
  };

  const handleSelectAgentForChat = (agentId: string, initialPrompt?: string) => {
    setSelectedAgentId(agentId);
    setChatMode('single_agent');
    setCurrentTab('chat');
    if (initialPrompt) {
      handleSend(initialPrompt, 'single_agent', agentId);
    }
  };

  const handleExport = () => {
    exportChatToMarkdown(messages);
  };

  const handleClear = () => {
    setMessages(INITIAL_MESSAGES);
    setLatestRouting(null);
    setActiveAgentIds([]);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white">
      {/* Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        chatMode={chatMode}
        setChatMode={setChatMode}
        onExport={handleExport}
        onClear={handleClear}
        messageCount={messages.length}
        isVisualizerOpen={isVisualizerOpen}
        setIsVisualizerOpen={setIsVisualizerOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0">
        {currentTab === 'studio' && (
          <StudioView
            onConsultAgentInChat={(agentName, deliverableName) => {
              setCurrentTab('chat');
              handleSend(
                `Consulting ${agentName} regarding Design Sprint Deliverable: "${deliverableName}". Please provide specialist guidance on execution and standards.`,
                'smoe_swarm'
              );
            }}
          />
        )}

        {currentTab === 'intake' && <IntakeCharterView />}

        {currentTab === 'agents' && (
          <AgentsDirectoryView onSelectAgentForChat={handleSelectAgentForChat} />
        )}

        {currentTab === 'decisions' && <DecisionsVaultView messages={messages} />}

        {currentTab === 'chat' && (
          <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col space-y-6">
            {/* Live Gating Visualizer Panel */}
            {isVisualizerOpen && (
              <RoutingVisualizer
                latestRouting={latestRouting}
                activeAgentIds={activeAgentIds}
                onToggleAgent={handleToggleAgent}
                onClose={() => setIsVisualizerOpen(false)}
              />
            )}

            {/* Messages Thread */}
            <div className="flex-1 space-y-4">
              {messages.map((message) => (
                <ChatMessageItem key={message.id} message={message} />
              ))}

              {isLoading && (
                <div className="flex items-start gap-3 max-w-3xl mr-auto mb-8 animate-pulse">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-600 flex items-center justify-center text-white font-extrabold text-xs">
                    H
                  </div>
                  <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                      <span className="font-semibold text-indigo-300">
                        {chatMode === 'smoe_swarm'
                          ? 'Hana evaluating MoE routing and activating specialist nodes...'
                          : 'Agent formulating specialist response...'}
                      </span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded w-48" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Dock */}
            <div className="sticky bottom-4 z-20 pt-2">
              <ChatInput
                onSend={handleSend}
                isLoading={isLoading}
                chatMode={chatMode}
                setChatMode={setChatMode}
                selectedAgentId={selectedAgentId}
                setSelectedAgentId={setSelectedAgentId}
                onScenarioSelect={handleScenarioSelect}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
