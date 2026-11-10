import React, { useState } from 'react';
import {
  CheckSquare,
  Sparkles,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { ChatMessage } from '../types';
import { AGENTS } from '../data/agents';
import { copyToClipboard } from '../utils/export';

interface DecisionsVaultViewProps {
  messages: ChatMessage[];
}

export const DecisionsVaultView: React.FC<DecisionsVaultViewProps> = ({ messages }) => {
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  // Extract all action items and consensus points across all messages
  const actionItems: {
    id: string;
    task: string;
    ownerAgent: string;
    priority: 'High' | 'Medium' | 'Low';
    timestamp: string;
    sessionQuery: string;
  }[] = [];

  const consensusDecisions: {
    point: string;
    timestamp: string;
    sessionQuery: string;
  }[] = [];

  messages.forEach((msg, mIdx) => {
    if (msg.synthesis) {
      if (msg.synthesis.actionItems) {
        msg.synthesis.actionItems.forEach((item, aIdx) => {
          actionItems.push({
            id: `act-${mIdx}-${aIdx}`,
            task: item.task,
            ownerAgent: item.ownerAgent,
            priority: item.priority as any,
            timestamp: msg.timestamp,
            sessionQuery: msg.routingResult?.query || 'Strategic Synthesis',
          });
        });
      }

      if (msg.synthesis.consensusPoints) {
        msg.synthesis.consensusPoints.forEach((point) => {
          consensusDecisions.push({
            point,
            timestamp: msg.timestamp,
            sessionQuery: msg.routingResult?.query || 'Strategic Decision',
          });
        });
      }
    }
  });

  const toggleComplete = (id: string) => {
    setCompletedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredActions = actionItems.filter((item) => {
    if (filterPriority === 'all') return true;
    return item.priority.toLowerCase() === filterPriority.toLowerCase();
  });

  const handleExport = () => {
    let md = `# SMOE DECISION LOG & ACTION MATRIX\n`;
    md += `Generated: ${new Date().toLocaleString()}\n\n`;
    md += `## Key Consensus Decisions\n`;
    consensusDecisions.forEach((d) => {
      md += `- ${d.point} (${new Date(d.timestamp).toLocaleTimeString()})\n`;
    });
    md += `\n## Action Items Matrix\n`;
    actionItems.forEach((a) => {
      const status = completedItems[a.id] ? '[x]' : '[ ]';
      md += `- ${status} [${a.priority}] ${a.task} (Owner: ${a.ownerAgent})\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `decisions-matrix-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
            <CheckSquare className="w-4 h-4" />
            <span>SHARED RECORD · DECISIONS & ACTION ITEMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Key Decisions & Execution Vault
          </h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            A timestamped trail of collective consensus, specialist approvals, and squad action
            items formulated across all MoE chats.
          </p>
        </div>

        {actionItems.length > 0 && (
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700 text-xs font-semibold transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Matrix</span>
          </button>
        )}
      </div>

      {actionItems.length === 0 && consensusDecisions.length === 0 ? (
        <div className="bg-zinc-900/40 border border-dashed border-zinc-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[350px]">
          <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 flex items-center justify-center text-zinc-500 mb-3">
            <CheckSquare className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-300">No Recorded Decisions Yet</h3>
          <p className="text-xs text-zinc-500 max-w-sm mt-1">
            Run an MoE Swarm chat in the Chat Console. Hana's executive synthesis and squad action
            items will automatically populate here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Action Matrix */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                Action Items Matrix ({actionItems.length})
              </h2>

              {/* Priority filter */}
              <div className="flex items-center gap-1 text-xs">
                {['all', 'high', 'medium', 'low'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setFilterPriority(p)}
                    className={`px-2.5 py-1 rounded-lg uppercase text-[10px] font-mono transition-all ${
                      filterPriority === p
                        ? 'bg-zinc-800 text-white font-bold border border-zinc-700'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              {filteredActions.map((item) => {
                const isDone = completedItems[item.id];
                const priorityColor =
                  item.priority === 'High'
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    : item.priority === 'Medium'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-blue-500/10 text-blue-400 border-blue-500/30';

                return (
                  <div
                    key={item.id}
                    onClick={() => toggleComplete(item.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isDone
                        ? 'bg-zinc-950/40 border-zinc-850 opacity-60'
                        : 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700 shadow-sm'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={!!isDone}
                      onChange={() => toggleComplete(item.id)}
                      className="mt-0.5 rounded border-zinc-700 bg-zinc-950 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-zinc-900 w-4 h-4"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span
                          className={`text-xs font-semibold ${
                            isDone ? 'line-through text-zinc-500' : 'text-zinc-100'
                          }`}
                        >
                          {item.task}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${priorityColor}`}
                        >
                          {item.priority}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-zinc-500 font-mono">
                        <span className="text-indigo-400">Owner: {item.ownerAgent}</span>
                        <span>·</span>
                        <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Key Consensus Decisions */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Strategic Consensus Trail ({consensusDecisions.length})
            </h2>

            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-3.5">
              {consensusDecisions.map((decision, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-bold text-zinc-200">
                      Consensus Call #{idx + 1}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500 ml-auto">
                      {new Date(decision.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed pl-4">
                    {decision.point}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
