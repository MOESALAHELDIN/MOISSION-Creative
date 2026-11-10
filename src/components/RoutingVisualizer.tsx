import React from 'react';
import { Cpu, Zap, Activity, Info, CheckCircle2 } from 'lucide-react';
import { MoEResult } from '../types';
import { AGENTS, HANA_ORCHESTRATOR } from '../data/agents';

interface RoutingVisualizerProps {
  latestRouting: MoEResult | null;
  activeAgentIds: string[];
  onToggleAgent: (agentId: string) => void;
  onClose?: () => void;
}

export const RoutingVisualizer: React.FC<RoutingVisualizerProps> = ({
  latestRouting,
  activeAgentIds,
  onToggleAgent,
  onClose,
}) => {
  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-xl backdrop-blur-xl relative overflow-hidden">
      {/* Background visual accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              Sparse MoE Gating Network
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Telemetry
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Hana dynamic triage & routing weights across the 8 specialist capabilities
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-xs text-zinc-400 hover:text-white px-2.5 py-1 rounded-lg hover:bg-zinc-800 border border-transparent hover:border-zinc-700"
          >
            Dismiss
          </button>
        )}
      </div>

      {/* Triage Context if available */}
      {latestRouting && (
        <div className="mb-5 p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs">
          <div className="flex items-center gap-2 text-indigo-300 font-medium mb-1">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>Latest Triage Assessment · Dominant Domain: {latestRouting.dominantDomain}</span>
          </div>
          <p className="text-zinc-300 leading-relaxed">{latestRouting.triageAnalysis}</p>
        </div>
      )}

      {/* MoE Gating Node Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {AGENTS.map((agent) => {
          const scoreObj = latestRouting?.routerScores.find((s) => s.agentId === agent.id);
          const score = scoreObj ? Math.round(scoreObj.score) : 0;
          const isActivated = activeAgentIds.includes(agent.id) || (scoreObj ? scoreObj.activated : false);

          return (
            <div
              key={agent.id}
              onClick={() => onToggleAgent(agent.id)}
              className={`group cursor-pointer relative p-3.5 rounded-xl border transition-all duration-200 ${
                isActivated
                  ? 'bg-zinc-850 border-zinc-650 shadow-md ring-1'
                  : 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700 opacity-75 hover:opacity-100'
              }`}
              style={{
                borderColor: isActivated ? `${agent.avatarColor}60` : undefined,
                boxShadow: isActivated ? `0 4px 20px ${agent.avatarColor}15` : undefined,
              }}
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs font-bold text-white shadow-sm"
                    style={{ backgroundColor: agent.avatarColor }}
                  >
                    {agent.capabilityId}
                  </span>
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-100 group-hover:text-white flex items-center gap-1.5">
                      {agent.name}
                      {isActivated && (
                        <CheckCircle2
                          className="w-3.5 h-3.5"
                          style={{ color: agent.avatarColor }}
                        />
                      )}
                    </h4>
                    <p className="text-[10px] text-zinc-400 truncate max-w-[120px]">
                      {agent.role}
                    </p>
                  </div>
                </div>

                {/* Score percentage pill */}
                <div
                  className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold"
                  style={{
                    backgroundColor: `${agent.avatarColor}15`,
                    color: agent.avatarColor,
                  }}
                >
                  {score > 0 ? `${score}%` : isActivated ? 'ON' : '0%'}
                </div>
              </div>

              {/* Progress Weight Bar */}
              <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden mb-2">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${Math.max(score, isActivated ? 35 : 5)}%`,
                    backgroundColor: agent.avatarColor,
                  }}
                />
              </div>

              {/* Agent Domain / Rationale */}
              <p className="text-[11px] text-zinc-400 line-clamp-1">
                {scoreObj?.reason || agent.domain}
              </p>
            </div>
          );
        })}
      </div>

      {/* Footer instruction */}
      <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500">
        <span className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-zinc-400" />
          Click any capability card to manually toggle expert activation in the next swarm run.
        </span>
        <span className="font-mono text-zinc-400">
          Active Experts: {activeAgentIds.length || (latestRouting?.activatedAgents.length ?? 0)}
        </span>
      </div>
    </div>
  );
};
