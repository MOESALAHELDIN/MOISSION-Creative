import { ChatMessage } from '../types';

export function exportChatToMarkdown(messages: ChatMessage[], sessionTitle = 'MOISSION-Session'): void {
  let md = `# MOISSION CREATIVE - SESSION TRANSCRIPT\n`;
  md += `Exported on: ${new Date().toLocaleString()}\n`;
  md += `Orchestration: Hana Triage & 8-Capability SMoE Network\n\n---\n\n`;

  messages.forEach((msg, idx) => {
    const time = new Date(msg.timestamp).toLocaleTimeString();
    if (msg.role === 'user') {
      md += `### 👤 User (${time})\n\n${msg.content}\n\n`;
      if (msg.attachments && msg.attachments.length > 0) {
        md += `*Attached Files:* ${msg.attachments.map((a) => a.name).join(', ')}\n\n`;
      }
    } else {
      const speakerName = msg.speaker?.name || 'Hana Orchestrator';
      const speakerRole = msg.speaker?.role || 'MoE Orchestrator';
      md += `### 🤖 ${speakerName} [${speakerRole}] (${time})\n\n`;

      if (msg.routingResult) {
        md += `#### 🧭 Hana MoE Triage Analysis\n`;
        md += `> ${msg.routingResult.triageAnalysis}\n\n`;
        md += `**Activated Experts:** ${msg.routingResult.activatedAgents.join(', ')}\n\n`;
      }

      if (msg.agentResponses && msg.agentResponses.length > 0) {
        md += `#### 👥 Specialist Contributions\n\n`;
        msg.agentResponses.forEach((resp) => {
          md += `**${resp.agentName} (Capability ${resp.capabilityId} - ${resp.role}):**\n\n`;
          md += `${resp.content}\n\n`;
        });
      }

      if (msg.synthesis) {
        md += `#### 📋 Executive Synthesis & Consensus\n\n`;
        md += `${msg.synthesis.executiveSummary}\n\n`;

        if (msg.synthesis.consensusPoints?.length > 0) {
          md += `**Consensus Points:**\n`;
          msg.synthesis.consensusPoints.forEach((p) => {
            md += `- ${p}\n`;
          });
          md += `\n`;
        }

        if (msg.synthesis.actionItems?.length > 0) {
          md += `**Action Matrix:**\n`;
          msg.synthesis.actionItems.forEach((item) => {
            md += `- [ ] [${item.priority}] **${item.ownerAgent}**: ${item.task}\n`;
          });
          md += `\n`;
        }
      } else {
        md += `${msg.content}\n\n`;
      }
    }
    md += `---\n\n`;
  });

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${sessionTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

export function copyToClipboard(text: string): Promise<boolean> {
  return navigator.clipboard
    .writeText(text)
    .then(() => true)
    .catch(() => false);
}
