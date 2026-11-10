import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Paperclip,
  Mic,
  MicOff,
  X,
  Sparkles,
  Bot,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { ChatMode } from '../types';
import { AGENTS, PRESET_SCENARIOS } from '../data/agents';

interface ChatInputProps {
  onSend: (
    query: string,
    mode: ChatMode,
    selectedAgentId?: string,
    attachments?: { name: string; type: string; dataUrl: string }[]
  ) => void;
  isLoading: boolean;
  chatMode: ChatMode;
  setChatMode: (mode: ChatMode) => void;
  selectedAgentId: string;
  setSelectedAgentId: (id: string) => void;
  onScenarioSelect: (prompt: string, targetAgents?: string[]) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  isLoading,
  chatMode,
  setChatMode,
  selectedAgentId,
  setSelectedAgentId,
  onScenarioSelect,
}) => {
  const [query, setQuery] = useState('');
  const [attachments, setAttachments] = useState<
    { name: string; type: string; dataUrl: string }[]
  >([]);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setQuery((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsRecording(false);
        };

        recognition.onerror = () => {
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      console.warn('Speech recognition is not supported in this browser.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAttachments((prev) => [
            ...prev,
            {
              name: file.name,
              type: file.type,
              dataUrl: event.target!.result as string,
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() && attachments.length === 0) return;
    if (isLoading) return;

    onSend(query.trim(), chatMode, selectedAgentId, attachments);
    setQuery('');
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3">
      {/* Preset Scenario Pills (Quick launch) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-[11px] text-zinc-500 font-mono uppercase tracking-wider flex-shrink-0 mr-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-400" /> Presets:
        </span>
        {PRESET_SCENARIOS.map((sc, i) => (
          <button
            key={i}
            onClick={() => onScenarioSelect(sc.prompt, sc.targetAgents)}
            className="flex-shrink-0 px-3 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 border border-zinc-800/80 hover:border-zinc-700 transition-all text-xs"
          >
            {sc.title}
          </button>
        ))}
      </div>

      {/* Main Container */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 shadow-2xl backdrop-blur-xl p-3 sm:p-4 space-y-3 transition-all focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/10">
        {/* Top Controls: Mode & Agent selection */}
        <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-zinc-800/60">
          <div className="flex items-center gap-1.5 p-1 bg-zinc-950/70 rounded-xl border border-zinc-800/80">
            <button
              type="button"
              onClick={() => setChatMode('smoe_swarm')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                chatMode === 'smoe_swarm'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>MoE Swarm (Top Experts)</span>
            </button>

            <button
              type="button"
              onClick={() => setChatMode('hana_orchestrator')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                chatMode === 'hana_orchestrator'
                  ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Hana Direct</span>
            </button>

            <button
              type="button"
              onClick={() => setChatMode('single_agent')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                chatMode === 'single_agent'
                  ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-pink-400" />
              <span>Specialist 1-on-1</span>
            </button>
          </div>

          {chatMode === 'single_agent' && (
            <div className="relative">
              <select
                value={selectedAgentId}
                onChange={(e) => setSelectedAgentId(e.target.value)}
                className="appearance-none bg-zinc-950 border border-zinc-700/80 text-zinc-200 text-xs rounded-xl px-3 py-1.5 pr-8 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
              >
                {AGENTS.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.capabilityId} {agent.name} ({agent.role})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}
        </div>

        {/* Attachment Previews */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {attachments.map((att, i) => (
              <div
                key={i}
                className="relative group rounded-xl overflow-hidden border border-zinc-700 bg-zinc-950 p-1 flex items-center gap-2 max-w-[220px]"
              >
                {att.type.startsWith('image/') ? (
                  <img
                    src={att.dataUrl}
                    alt={att.name}
                    className="w-10 h-10 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-xs text-indigo-400">
                    DOC
                  </div>
                )}
                <span className="text-xs text-zinc-300 truncate flex-1">{att.name}</span>
                <button
                  type="button"
                  onClick={() => removeAttachment(i)}
                  className="p-1 rounded-md text-zinc-400 hover:text-red-400 hover:bg-zinc-800"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Text Input Row */}
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={query}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={
              chatMode === 'smoe_swarm'
                ? 'Ask the collective: Hana will triage and route to optimal specialists...'
                : chatMode === 'hana_orchestrator'
                ? 'Consult Hana for strategic triage and orchestration...'
                : `Consult specialist directly on capability challenges...`
            }
            className="flex-1 bg-transparent border-0 text-zinc-100 placeholder-zinc-500 text-sm focus:ring-0 focus:outline-none resize-none py-2 max-h-44"
          />

          <div className="flex items-center gap-1.5 flex-shrink-0 pb-1">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept="image/*,application/pdf,text/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Attach wireframe, screenshot, or brief"
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={toggleRecording}
              title={isRecording ? 'Stop recording' : 'Dictate with voice'}
              className={`p-2 rounded-xl transition-colors ${
                isRecording
                  ? 'bg-rose-500/20 text-rose-400 animate-pulse'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              type="button"
              disabled={isLoading || (!query.trim() && attachments.length === 0)}
              onClick={() => handleSubmit()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium shadow-md shadow-indigo-500/20 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
