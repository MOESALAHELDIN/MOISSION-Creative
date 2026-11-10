import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Layers,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  User,
  ExternalLink,
  BookOpen,
  SlidersHorizontal,
} from 'lucide-react';
import { DELIVERABLES, DeliverableItem } from '../data/deliverables';
import { ORG_DEPARTMENTS } from '../data/org';
import { STUDIO_AGENTS } from '../data/studioAgents';
import { copyToClipboard } from '../utils/export';

interface StudioViewProps {
  onConsultAgentInChat?: (agentName: string, deliverableName: string) => void;
}

export const StudioView: React.FC<StudioViewProps> = ({ onConsultAgentInChat }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deliverableStatuses, setDeliverableStatuses] = useState<
    Record<string, 'not_started' | 'in_progress' | 'review' | 'completed'>
  >({});
  const [activeTab, setActiveTab] = useState<'matrix' | 'org' | 'agents'>('matrix');
  const [selectedDeliverable, setSelectedDeliverable] = useState<DeliverableItem | null>(null);
  const [aiDraftPrompt, setAiDraftPrompt] = useState<string>('');
  const [aiDraftResult, setAiDraftResult] = useState<string>('');
  const [isDrafting, setIsDrafting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const categories = useMemo(() => {
    return ['All', ...new Set(DELIVERABLES.map((d) => d.category))];
  }, []);

  const departments = useMemo(() => {
    return ['All', ...new Set(DELIVERABLES.map((d) => d.department))];
  }, []);

  // Filtered deliverables
  const filteredDeliverables = useMemo(() => {
    return DELIVERABLES.filter((d) => {
      const matchCat = selectedCategory === 'All' || d.category === selectedCategory;
      const matchDept = selectedDept === 'All' || d.department === selectedDept;
      const matchSearch =
        searchQuery === '' ||
        d.deliverable.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.matrixRole.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchDept && matchSearch;
    });
  }, [selectedCategory, selectedDept, searchQuery]);

  // Progress metrics
  const completedCount = useMemo(() => {
    return Object.values(deliverableStatuses).filter((s) => s === 'completed').length;
  }, [deliverableStatuses]);

  const inProgressCount = useMemo(() => {
    return Object.values(deliverableStatuses).filter((s) => s === 'in_progress').length;
  }, [deliverableStatuses]);

  const toggleStatus = (no: string) => {
    setDeliverableStatuses((prev) => {
      const current = prev[no] || 'not_started';
      const cycle: Record<string, 'not_started' | 'in_progress' | 'review' | 'completed'> = {
        not_started: 'in_progress',
        in_progress: 'review',
        review: 'completed',
        completed: 'not_started',
      };
      return { ...prev, [no]: cycle[current] };
    });
  };

  const handleDraftWithAI = async (item: DeliverableItem) => {
    setSelectedDeliverable(item);
    setIsDrafting(true);
    setAiDraftResult('');

    try {
      const prompt = `As ${item.owner} (${item.ownerRole}, ${item.department} at SMOEDESIGN):
Generate the complete, production-grade deliverable draft specification for:
Deliverable #${item.no}: "${item.deliverable}" (Category: ${item.category}).
Matrix Role: ${item.matrixRole}. Supporting role: ${item.support || 'None'}.

Provide:
1. Deliverable Scope & Objective
2. Key Structural Components & Sections
3. Specifications, Format Standards & Tooling
4. Review & Sign-off Criteria`;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'hana_orchestrator',
          query: prompt,
        }),
      });

      const data = await res.json();
      setAiDraftResult(data.content || 'Draft generated successfully.');
    } catch (err: any) {
      setAiDraftResult(`Error drafting deliverable: ${err.message}`);
    } finally {
      setIsDrafting(false);
    }
  };

  const handleExportCSV = () => {
    let csv = 'No,Category,Deliverable,Matrix Role,Owner,Owner Role,Department,Support,Status\n';
    DELIVERABLES.forEach((d) => {
      const status = deliverableStatuses[d.no] || 'not_started';
      csv += `"${d.no}","${d.category}","${d.deliverable.replace(/"/g, '""')}","${d.matrixRole}","${d.owner}","${d.ownerRole}","${d.department}","${d.support || ''}","${status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `moission-creative-design-sprint-matrix-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-pink-400 mb-1">
            <Briefcase className="w-4 h-4" />
            <span>DESIGN SPRINT MATRIX · 62 DELIVERABLES</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Studio Design Sprint Matrix
          </h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Directly mapped from <b className="text-zinc-200">Design Sprint.pdf</b>. 62 accountable
            deliverables spanning Executive, Strategic, Creative, Operational, Legal, Digital, and
            Governance disciplines.
          </p>
        </div>

        {/* View Switcher and Export */}
        <div className="flex items-center gap-2">
          <div className="p-1 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center gap-1 text-xs font-medium">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'matrix' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Matrix ({DELIVERABLES.length})
            </button>
            <button
              onClick={() => setActiveTab('org')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'org' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Departments ({ORG_DEPARTMENTS.length})
            </button>
            <button
              onClick={() => setActiveTab('agents')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'agents' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              28 Studio Agents
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            title="Export CSV"
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {activeTab === 'matrix' && (
        <div className="space-y-6">
          {/* Metrics summary banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <span className="text-[11px] font-mono text-zinc-400 uppercase">Total Scope</span>
              <div className="text-xl font-bold text-white mt-1">62 Deliverables</div>
              <span className="text-[10px] text-zinc-500">From Design Sprint.pdf</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <span className="text-[11px] font-mono text-emerald-400 uppercase">Completed</span>
              <div className="text-xl font-bold text-emerald-400 mt-1">{completedCount}</div>
              <span className="text-[10px] text-zinc-500">Sign-off confirmed</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <span className="text-[11px] font-mono text-amber-400 uppercase">In Progress / Review</span>
              <div className="text-xl font-bold text-amber-400 mt-1">{inProgressCount}</div>
              <span className="text-[10px] text-zinc-500">Active design sprint</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <span className="text-[11px] font-mono text-indigo-400 uppercase">Sprint Completion</span>
              <div className="text-xl font-bold text-indigo-400 mt-1">
                {Math.round((completedCount / 62) * 100)}%
              </div>
              <span className="text-[10px] text-zinc-500">Progress velocity</span>
            </div>
          </div>

          {/* Search & Category Filter Controls */}
          <div className="space-y-3 bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 shadow-md">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search deliverables, owners (e.g. Elena, Marcus, Julian), or roles..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-950 border border-zinc-700/80 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Department Dropdown */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Filter className="w-4 h-4 text-zinc-500" />
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="bg-zinc-950 border border-zinc-700/80 text-xs text-zinc-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept === 'All' ? 'All Departments' : dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm'
                      : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Deliverables List Table / Cards */}
          <div className="space-y-2.5">
            {filteredDeliverables.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 bg-zinc-900/40 rounded-xl border border-zinc-800">
                No deliverables match your search criteria.
              </div>
            ) : (
              filteredDeliverables.map((item) => {
                const status = deliverableStatuses[item.no] || 'not_started';
                const statusLabel =
                  status === 'completed'
                    ? 'Completed'
                    : status === 'in_progress'
                    ? 'In Progress'
                    : status === 'review'
                    ? 'In Review'
                    : 'Not Started';

                const statusColor =
                  status === 'completed'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : status === 'in_progress'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : status === 'review'
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700';

                return (
                  <div
                    key={item.no}
                    className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                          #{item.no}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {item.category}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {item.department}
                        </span>
                      </div>

                      <h3 className="text-sm font-semibold text-zinc-100 leading-snug">
                        {item.deliverable}
                      </h3>

                      <div className="flex items-center gap-3 text-xs text-zinc-400 flex-wrap">
                        <span className="flex items-center gap-1 text-zinc-300">
                          <User className="w-3.5 h-3.5 text-zinc-500" />
                          <b>{item.owner}</b> ({item.ownerRole})
                        </span>
                        <span>·</span>
                        <span>Matrix: {item.matrixRole}</span>
                        {item.support && (
                          <>
                            <span>·</span>
                            <span className="text-zinc-500">Support: {item.support}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions and Status */}
                    <div className="flex items-center gap-2.5 flex-shrink-0 self-end md:self-center">
                      <button
                        onClick={() => toggleStatus(item.no)}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${statusColor}`}
                        title="Click to cycle status: Not Started -> In Progress -> Review -> Completed"
                      >
                        {statusLabel}
                      </button>

                      <button
                        onClick={() => handleDraftWithAI(item)}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700 text-xs font-medium transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                        <span>Draft Spec</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Org Departments Tab */}
      {activeTab === 'org' && (
        <div className="space-y-4">
          <div className="text-xs text-zinc-400 mb-2">
            The 6 functional studio departments defined in <b className="text-zinc-200">Design Sprint.pdf</b>,
            governing leadership, team disciplines, and delivery responsibilities.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ORG_DEPARTMENTS.map((dept, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-md space-y-3"
              >
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    {dept.name}
                  </h3>
                  <span className="text-xs font-mono text-zinc-500">
                    {dept.teams.length} Disciplines
                  </span>
                </div>

                <div className="space-y-3">
                  {dept.teams.map((t, tIdx) => (
                    <div key={tIdx} className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-850 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-zinc-200">{t.team}</span>
                        <span className="text-[11px] text-indigo-400 font-mono">{t.roles}</span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">{t.responsibilities}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 28 Studio Agents Tab */}
      {activeTab === 'agents' && (
        <div className="space-y-4">
          <div className="text-xs text-zinc-400 mb-2">
            The full team roster of 28 specialist studio agents working under Moe Salaheldin (Founder & Head)
            and Maya Clark (Vice Director).
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {STUDIO_AGENTS.map((agent) => (
              <div
                key={agent.id}
                className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded">
                      #{agent.id}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                      {agent.department.split('&')[0]}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white mt-2">{agent.name}</h4>
                  <p className="text-[11px] text-zinc-400 leading-tight">{agent.role}</p>
                  <p className="text-[11px] text-zinc-500 mt-2 line-clamp-2">
                    {agent.responsibility}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
                  <span>Owns: {agent.deliverablesOwned}</span>
                  <span className="text-indigo-400">{agent.matrixRoles.split(',')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deliverable AI Spec Generator Modal */}
      {selectedDeliverable && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedDeliverable(null)}
        >
          <div
            className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="text-xs font-mono text-indigo-400">
                  DELIVERABLE #{selectedDeliverable.no} · {selectedDeliverable.category}
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  {selectedDeliverable.deliverable}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Owner: <b className="text-zinc-200">{selectedDeliverable.owner}</b> ({selectedDeliverable.ownerRole})
                </p>
              </div>

              <button
                onClick={() => setSelectedDeliverable(null)}
                className="text-xs text-zinc-400 hover:text-white px-2.5 py-1 rounded-lg hover:bg-zinc-800"
              >
                Close
              </button>
            </div>

            {isDrafting ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-zinc-400">
                  {selectedDeliverable.owner} is generating the delivery specification...
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed bg-zinc-950 p-4 rounded-xl border border-zinc-800 font-mono">
                  {aiDraftResult}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => {
                      copyToClipboard(aiDraftResult);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-semibold"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Spec'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
