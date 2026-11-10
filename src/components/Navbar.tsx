import React from 'react';
import {
  Layers,
  Sparkles,
  FileText,
  Users,
  CheckSquare,
  Download,
  Trash2,
  Cpu,
  Briefcase,
} from 'lucide-react';
import { ChatMode } from '../types';

interface NavbarProps {
  currentTab: 'chat' | 'studio' | 'intake' | 'agents' | 'decisions';
  setCurrentTab: (tab: 'chat' | 'studio' | 'intake' | 'agents' | 'decisions') => void;
  chatMode: ChatMode;
  setChatMode: (mode: ChatMode) => void;
  onExport: () => void;
  onClear: () => void;
  messageCount: number;
  isVisualizerOpen: boolean;
  setIsVisualizerOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  chatMode,
  setChatMode,
  onExport,
  onClear,
  messageCount,
  isVisualizerOpen,
  setIsVisualizerOpen,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
            <Layers className="w-5 h-5 text-white" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-zinc-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-white text-base">
                MOISSION <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">CREATIVE</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60">
                Studio & MoE
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              Hana Orchestration · 8 Capabilities · Design Sprint Matrix
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 p-1 bg-zinc-900/90 rounded-xl border border-zinc-800/80">
          <button
            onClick={() => setCurrentTab('chat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'chat'
                ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700/60'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Chat</span>
          </button>

          <button
            onClick={() => setCurrentTab('studio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'studio'
                ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700/60'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-pink-400" />
            <span>Studio (Sprint)</span>
          </button>

          <button
            onClick={() => setCurrentTab('intake')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'intake'
                ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700/60'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Intake</span>
          </button>

          <button
            onClick={() => setCurrentTab('agents')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'agents'
                ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700/60'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>Roster</span>
          </button>

          <button
            onClick={() => setCurrentTab('decisions')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'decisions'
                ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700/60'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
            <span>Decisions</span>
          </button>
        </nav>

        {/* Right utility buttons */}
        <div className="flex items-center gap-2">
          {currentTab === 'chat' && (
            <button
              onClick={() => setIsVisualizerOpen(!isVisualizerOpen)}
              title="Toggle Live MoE Routing Visualizer"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                isVisualizerOpen
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-sm shadow-indigo-500/20'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">Gating Visualizer</span>
            </button>
          )}

          {messageCount > 0 && (
            <>
              <button
                onClick={onExport}
                title="Export session to Markdown"
                className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 border border-zinc-800/60 transition-all text-xs"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={onClear}
                title="Clear conversation"
                className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800/80 border border-zinc-800/60 transition-all text-xs"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
