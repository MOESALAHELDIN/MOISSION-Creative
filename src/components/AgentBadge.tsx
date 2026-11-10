import React from 'react';
import { AGENTS, HANA_ORCHESTRATOR } from '../data/agents';

interface AgentBadgeProps {
  agentId?: string;
  size?: 'sm' | 'md' | 'lg';
  showRole?: boolean;
}

export const AgentBadge: React.FC<AgentBadgeProps> = ({
  agentId,
  size = 'md',
  showRole = false,
}) => {
  if (agentId === 'hana' || !agentId) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 ${
          size === 'sm'
            ? 'px-2 py-0.5 text-xs'
            : size === 'lg'
            ? 'px-3.5 py-1 text-sm'
            : 'px-2.5 py-0.5 text-xs'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
        <span className="font-semibold tracking-wider">HANA</span>
        {showRole && <span className="text-zinc-400">· MoE Triage</span>}
      </span>
    );
  }

  const agent = AGENTS.find((a) => a.id === agentId);
  if (!agent) {
    return (
      <span className="px-2 py-0.5 rounded-full text-xs bg-zinc-800 text-zinc-300 border border-zinc-700">
        {agentId}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${
        size === 'sm'
          ? 'px-2 py-0.5 text-xs'
          : size === 'lg'
          ? 'px-3 py-1 text-sm'
          : 'px-2.5 py-0.5 text-xs'
      } border`}
      style={{
        backgroundColor: `${agent.avatarColor}15`,
        borderColor: `${agent.avatarColor}40`,
        color: agent.avatarColor,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: agent.avatarColor }}
      />
      <span className="font-mono text-[10px] opacity-80">{agent.capabilityId}</span>
      <span className="font-semibold">{agent.name}</span>
      {showRole && <span className="opacity-80 text-[11px]">· {agent.role}</span>}
    </span>
  );
};
