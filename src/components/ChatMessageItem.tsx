import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Copy,
  Check,
  Zap,
  ChevronDown,
  ChevronUp,
  FileCheck,
  User,
  Sparkles,
  ArrowRight,
  ListTodo,
} from 'lucide-react';
import { ChatMessage } from '../types';
import { AGENTS, HANA_ORCHESTRATOR } from '../data/agents';
import { AgentBadge } from './AgentBadge';
import { speakText, stopSpeaking } from '../utils/tts';
import { copyToClipboard } from '../utils/export';

interface ChatMessageItemProps {
  message: ChatMessage;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [collapsedExperts, setCollapsedExperts] = useState(false);

  const isUser = message.role === 'user';

  const handleCopy = () => {
    let fullText = message.content;
    if (message.synthesis) {
      fullText += `\n\nExecutive Summary:\n${message.synthesis.executiveSummary}`;
    }
    copyToClipboard(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = (text: string, id: string, pitch = 1.0, rate = 1.0) => {
    if (isSpeaking === id) {
      stopSpeaking();
      setIsSpeaking(null);
    } else {
      stopSpeaking();
      setIsSpeaking(id);
      speakText(text, pitch, rate, () => setIsSpeaking(null));
    }
  };

  if (isUser) {
    return (
      <div className="flex justify-end gap-3 max-w-4xl ml-auto mb-6">
        <div className="flex flex-col items-end max-w-2xl">
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2 justify-end">
              {message.attachments.map((att, i) => (
                <div
                  key={i}
                  className="rounded-xl overflow-hidden border border-zinc-700 max-w-[200px] bg-zinc-900 shadow-md"
                >
                  {att.type.startsWith('image/') ? (
                    <img
                      src={att.dataUrl}
                      alt={att.name}
                      className="w-full h-32 object-cover"
                    />
                  ) : (
                    <div className="p-3 text-xs text-zinc-300 flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-indigo-400" />
                      <span className="truncate">{att.name}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="px-5 py-3.5 rounded-2xl rounded-tr-sm bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg text-sm leading-relaxed">
            {message.content}
          </div>
          <span className="text-[10px] text-zinc-500 mt-1 font-mono">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0 text-zinc-300">
          <User className="w-4 h-4" />
        </div>
      </div>
    );
  }

  // Assistant Response (Hana + Specialists)
  return (
    <div className="flex items-start gap-3 max-w-4xl mr-auto mb-8 w-full">
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-600 flex items-center justify-center text-white shadow-md font-extrabold text-xs">
          H
        </div>
        <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-indigo-500 ring-2 ring-zinc-950 flex items-center justify-center">
          <Sparkles className="w-2 h-2 text-white" />
        </span>
      </div>

      <div className="flex-1 min-w-0 space-y-4">
        {/* Header bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm text-white">
              {message.speaker?.name || 'Hana Orchestrator'}
            </span>
            <span className="text-xs text-zinc-400">· {message.speaker?.role || 'MoE Triage'}</span>
            <span className="text-[10px] text-zinc-500 font-mono">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleSpeak(message.content, `main-${message.id}`, 1.0, 1.0)}
              title={isSpeaking === `main-${message.id}` ? 'Stop audio' : 'Listen with voice'}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                isSpeaking === `main-${message.id}`
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 animate-pulse'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {isSpeaking === `main-${message.id}` ? (
                <VolumeX className="w-3.5 h-3.5" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={handleCopy}
              title="Copy response"
              className="p-1.5 rounded-lg border bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-800 text-xs transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Hana Triage Banner (if present) */}
        {message.routingResult && (
          <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-indigo-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-400 animate-pulse" />
                <span className="text-xs font-semibold text-indigo-300">
                  Sparse MoE Routing · Dominant Domain: {message.routingResult.dominantDomain}
                </span>
              </div>
              <span className="text-[11px] text-zinc-500 font-mono">
                Top Experts Activated ({message.routingResult.activatedAgents.length})
              </span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {message.routingResult.triageAnalysis}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {message.routingResult.activatedAgents.map((agentId) => (
                <AgentBadge key={agentId} agentId={agentId} size="sm" showRole />
              ))}
            </div>
          </div>
        )}

        {/* Specialist Agent Contributions (collapsible) */}
        {message.agentResponses && message.agentResponses.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Specialist Perspectives ({message.agentResponses.length})
                </span>
              </div>
              <button
                onClick={() => setCollapsedExperts(!collapsedExperts)}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 hover:underline"
              >
                {collapsedExperts ? (
                  <>
                    <span>Expand specialist briefs</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    <span>Collapse</span>
                    <ChevronUp className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            {!collapsedExperts && (
              <div className="space-y-3">
                {message.agentResponses.map((expert, idx) => {
                  const agentDef = AGENTS.find((a) => a.id === expert.agentId);
                  const color = agentDef?.avatarColor || '#6366F1';

                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border bg-zinc-900/60 shadow-sm transition-all"
                      style={{ borderColor: `${color}35` }}
                    >
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-5 h-5 rounded-md flex items-center justify-center font-mono text-[10px] font-bold text-white shadow-xs"
                            style={{ backgroundColor: color }}
                          >
                            {expert.capabilityId}
                          </span>
                          <div>
                            <span className="text-xs font-bold text-zinc-100 mr-2">
                              {expert.agentName}
                            </span>
                            <span className="text-[11px] text-zinc-400">
                              {expert.role}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            handleSpeak(
                              expert.content,
                              `expert-${idx}-${message.id}`,
                              agentDef?.voicePitch || 1.0,
                              agentDef?.voiceRate || 1.0
                            )
                          }
                          title="Listen to this specialist"
                          className="p-1 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap pl-1 border-l-2 border-zinc-800 py-0.5">
                        {expert.content}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Executive Synthesis & Consensus Card */}
        {message.synthesis && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-zinc-900 to-violet-950/30 border border-indigo-500/30 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Executive MoE Synthesis
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    Consensus blueprint formulated by Hana across specialist outputs
                  </p>
                </div>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap font-sans">
              {message.synthesis.executiveSummary}
            </div>

            {/* Key Consensus Points */}
            {message.synthesis.consensusPoints?.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider block">
                  Key Strategic Consensus
                </span>
                <ul className="space-y-1">
                  {message.synthesis.consensusPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                      <ArrowRight className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Items Matrix */}
            {message.synthesis.actionItems?.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">
                  <ListTodo className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Immediate Action Plan & Squad Ownership</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {message.synthesis.actionItems.map((item, i) => {
                    const priorityColor =
                      item.priority === 'High'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : item.priority === 'Medium'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/30';

                    return (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <input
                            type="checkbox"
                            className="rounded border-zinc-700 bg-zinc-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-zinc-900 w-3.5 h-3.5"
                          />
                          <span className="text-zinc-200 truncate">{item.task}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                            {item.ownerAgent}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${priorityColor}`}
                          >
                            {item.priority}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Regular Message Text (fallback or direct agent response) */}
        {!message.synthesis && message.content && (
          <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 text-xs sm:text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>
        )}
      </div>
    </div>
  );
};
