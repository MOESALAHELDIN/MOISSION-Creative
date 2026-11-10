import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Download,
  Copy,
  Check,
  Send,
  Users,
  Compass,
} from 'lucide-react';
import { AGENTS } from '../data/agents';
import { copyToClipboard } from '../utils/export';

interface CharterResponse {
  projectName: string;
  executiveSummary: string;
  recommendedLead: string;
  staffedSquad: {
    agentId: string;
    name: string;
    capabilityId: string;
    assignedRole: string;
    weeklyAllocation: string;
  }[];
  capabilityScope: {
    code: string;
    title: string;
    deliverables: string[];
    priority: string;
  }[];
  roadmap: {
    phase: string;
    duration: string;
    milestones: string[];
  }[];
  risks: {
    risk: string;
    impact: string;
    mitigation: string;
  }[];
  kickoffSchedule: {
    proposedDate: string;
    agenda: string;
    prepChecklist: string[];
  };
}

export const IntakeCharterView: React.FC = () => {
  const [formData, setFormData] = useState({
    clientName: 'Moe Salaheldin',
    company: 'SMOEDESIGN',
    email: 'cco.moesalaheldin@gmail.com',
    website: 'smoedesign.com',
    primaryCategory: '02 Design',
    budgetOrTimeline: '6-week sprint · $45,000 budget',
    projectBrief:
      'Launch the next-generation SMOE Agents Chat platform: an interactive multi-agent workspace with Hana orchestration, dynamic Mixture-of-Experts routing across 8 business capabilities, real-time audio playback, and client project scope charter generation.',
    targetAudience: 'Founders, product leaders, enterprise strategy & design teams',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [charter, setCharter] = useState<CharterResponse | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/intake/charter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(`Failed to generate charter: ${res.statusText}`);
      }

      const data = await res.json();
      setCharter(data);
      setFormError(null);
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || 'Failed to generate charter. Please verify API parameters.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMarkdown = () => {
    if (!charter) return;
    let md = `# PROJECT CHARTER: ${charter.projectName}\n\n`;
    md += `**Client:** ${formData.clientName} (${formData.company})\n`;
    md += `**Date:** ${new Date().toLocaleDateString()}\n\n`;
    md += `## Executive Assessment\n${charter.executiveSummary}\n\n`;
    md += `## Staffed Specialist Squad\n`;
    charter.staffedSquad.forEach((s) => {
      md += `- **${s.name}** (${s.capabilityId}): ${s.assignedRole} (${s.weeklyAllocation})\n`;
    });
    md += `\n## 8-Capability Scope Breakdown\n`;
    charter.capabilityScope.forEach((c) => {
      md += `### [${c.code}] ${c.title} (${c.priority} Priority)\n`;
      c.deliverables.forEach((d) => (md += `- ${d}\n`));
      md += `\n`;
    });
    md += `## 4-Phase Roadmap\n`;
    charter.roadmap.forEach((r) => {
      md += `### ${r.phase} (${r.duration})\n`;
      r.milestones.forEach((m) => (md += `- ${m}\n`));
      md += `\n`;
    });
    md += `## Kickoff Schedule\n**Proposed Date:** ${charter.kickoffSchedule.proposedDate}\n**Agenda:** ${charter.kickoffSchedule.agenda}\n`;

    copyToClipboard(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!charter) return;
    const blob = new Blob([JSON.stringify(charter, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `charter-${charter.projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-pink-400 mb-1">
          <Sparkles className="w-4 h-4" />
          <span>MOISSION CREATIVE INTAKE & CHARTER LAYER</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Client Intake & Project Charter Generator
        </h1>
        <p className="text-sm text-zinc-400 mt-1 max-w-3xl">
          Move from client qualification to a deployment-ready 8-capability scope, staffed team
          charter, and delivery roadmap orchestrated by Hana.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form (Intake) */}
        <div className="lg:col-span-5 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              Project Intake Spec
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
              01 / Qualify
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Contact info grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 font-medium mb-1">Client Name</label>
                <input
                  type="text"
                  required
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700/80 text-zinc-100 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1">Company / Entity</label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700/80 text-zinc-100 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 font-medium mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700/80 text-zinc-100 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1">Website</label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700/80 text-zinc-100 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-zinc-400 font-medium mb-1.5">
                Primary Requirements Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                {AGENTS.map((agent) => (
                  <button
                    key={agent.id}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        primaryCategory: `${agent.capabilityId} ${agent.name}`,
                      })
                    }
                    className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all text-[11px] ${
                      formData.primaryCategory.includes(agent.capabilityId)
                        ? 'bg-zinc-800 border-zinc-500 text-white font-semibold'
                        : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: agent.avatarColor }}
                    />
                    <span className="font-mono text-zinc-500">{agent.capabilityId}</span>
                    <span className="truncate">{agent.domain.split(',')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline / Budget */}
            <div>
              <label className="block text-zinc-400 font-medium mb-1">
                Timeline & Budget Frame
              </label>
              <input
                type="text"
                value={formData.budgetOrTimeline}
                onChange={(e) => setFormData({ ...formData, budgetOrTimeline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700/80 text-zinc-100 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Target Audience</label>
              <input
                type="text"
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700/80 text-zinc-100 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Brief */}
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Project Brief & Goals</label>
              <textarea
                required
                rows={4}
                value={formData.projectBrief}
                onChange={(e) => setFormData({ ...formData, projectBrief: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700/80 text-zinc-100 focus:border-indigo-500 focus:outline-none leading-relaxed resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Hana Triage & Scope Synthesis in progress...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Full Project Charter</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output (Charter Document) */}
        <div className="lg:col-span-7">
          {isLoading && !charter && (
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-12 text-center space-y-4 flex flex-col items-center justify-center min-h-[450px]">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 animate-pulse">
                <Compass className="w-6 h-6 animate-spin" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Synthesizing Charter</h3>
                <p className="text-xs text-zinc-400 max-w-sm mt-1">
                  Hana is evaluating the intake brief against the 8-capability matrix, staffing
                  specialist agents, and charting the delivery roadmap.
                </p>
              </div>
            </div>
          )}

          {!isLoading && !charter && (
            <div className="bg-zinc-900/40 border border-dashed border-zinc-800 rounded-2xl p-12 text-center space-y-3 flex flex-col items-center justify-center min-h-[450px]">
              <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 flex items-center justify-center text-zinc-500">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-300">No Charter Generated Yet</h3>
                <p className="text-xs text-zinc-500 max-w-sm mt-1">
                  Fill in the client intake parameters on the left and click "Generate Full Project
                  Charter" to produce an execution-ready scope document.
                </p>
              </div>
            </div>
          )}

          {charter && (
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 border-b border-zinc-800 pb-5">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    APPROVED CHARTER
                  </span>
                  <h2 className="text-xl font-black text-white mt-2">{charter.projectName}</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Recommended Lead: <b className="text-indigo-300">{charter.recommendedLead}</b>
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopyMarkdown}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 text-xs transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy MD'}</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 text-xs transition-colors"
                    title="Download JSON"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Executive Assessment */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Executive Assessment
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950/60 p-4 rounded-xl border border-zinc-800">
                  {charter.executiveSummary}
                </p>
              </div>

              {/* Staffed Specialist Squad */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                    Staffed Specialist Squad
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {charter.staffedSquad.map((member, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] text-zinc-500">
                            {member.capabilityId}
                          </span>
                          <span className="font-bold text-zinc-100">{member.name}</span>
                        </div>
                        <p className="text-[11px] text-zinc-400">{member.assignedRole}</p>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {member.weeklyAllocation}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 8-Capability Scope */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Capability Scope Breakdown
                </h3>
                <div className="space-y-2">
                  {charter.capabilityScope.map((scope, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-indigo-300">
                          {scope.code} / {scope.title}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {scope.priority} Priority
                        </span>
                      </div>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1">
                        {scope.deliverables.map((del, dIdx) => (
                          <li
                            key={dIdx}
                            className="flex items-start gap-1.5 text-[11px] text-zinc-400"
                          >
                            <span className="text-indigo-400">✓</span>
                            <span>{del}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4-Phase Delivery Roadmap */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  4-Phase Execution Roadmap
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {charter.roadmap.map((road, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-zinc-100">{road.phase}</span>
                        <span className="font-mono text-[10px] text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20">
                          {road.duration}
                        </span>
                      </div>
                      <ul className="space-y-1 text-[11px] text-zinc-400">
                        {road.milestones.map((m, mIdx) => (
                          <li key={mIdx} className="flex items-start gap-1.5">
                            <ArrowRight className="w-3 h-3 text-zinc-500 flex-shrink-0 mt-0.5" />
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kickoff & Agenda */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/30 to-indigo-950/30 border border-emerald-500/30 flex items-center justify-between flex-wrap gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                    <Calendar className="w-4 h-4" />
                    <span>Recommended Kickoff Date</span>
                  </div>
                  <p className="text-zinc-200 font-semibold">
                    {charter.kickoffSchedule.proposedDate}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {charter.kickoffSchedule.agenda}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-zinc-400">
                    Prep Checklist
                  </span>
                  {charter.kickoffSchedule.prepChecklist.map((item, i) => (
                    <div key={i} className="flex items-center gap-1 text-[11px] text-zinc-300">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
