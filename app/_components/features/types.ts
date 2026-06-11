export type SourceKey =
  | 'docs' | 'slack' | 'gmail' | 'github'
  | 'calendar' | 'transcripts' | 'linear' | 'notion';

export interface Source {
  key: SourceKey;
  angle: number;        // visual angle in degrees (0=right, 90=up)
  label: string;        // display name
  title: string;        // section headline
  body: string;         // section description
  brandColor: string;   // brand hex color
  overlayPos: 'left' | 'right' | 'top' | 'bottom'
             | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const SOURCES: Source[] = [
  { key: 'docs', angle: 0, label: 'Docs', title: 'DOCS / SPECS / PDFS',
    body: "Bring specs, notes, PDFs, and decisions into one searchable record with clear ownership and revision history.",
    brandColor: '#4285F4', overlayPos: 'left' },
  { key: 'slack', angle: 45, label: 'Slack', title: 'SLACK CHANNELS',
    body: "Turn important threads into captured decisions, owners, and next steps without digging through old messages.",
    brandColor: '#4A154B', overlayPos: 'bottom-left' },
  { key: 'gmail', angle: 90, label: 'Gmail', title: 'EVERY EMAIL',
    body: "Index customer promises, follow-ups, and internal context so commitments stay visible after the inbox moves on.",
    brandColor: '#EA4335', overlayPos: 'bottom' },
  { key: 'github', angle: 135, label: 'GitHub', title: 'GITHUB COMMITS + PRS',
    body: "Connect pull requests, commits, and branch activity to the plans and discussions that shaped the work.",
    brandColor: '#181717', overlayPos: 'bottom-right' },
  { key: 'calendar', angle: 180, label: 'Calendar', title: 'GOOGLE CALENDAR',
    body: "Link meetings to the work around them so calls, planning sessions, and customer reviews become useful context.",
    brandColor: '#1E88E5', overlayPos: 'right' },
  { key: 'transcripts', angle: 225, label: 'Transcripts', title: 'MEETING TRANSCRIPTS',
    body: "Make transcripts searchable, citeable, and connected to the projects, customers, and decisions they affect.",
    brandColor: '#FF6B35', overlayPos: 'top-right' },
  { key: 'linear', angle: 270, label: 'Linear', title: 'LINEAR ISSUES',
    body: "Tie tickets, sprints, and roadmap work back to the decisions and requirements behind them.",
    brandColor: '#5E6AD2', overlayPos: 'top' },
  { key: 'notion', angle: 315, label: 'Notion', title: 'NOTION WORKSPACES',
    body: "Keep Notion as your workspace while Orchestra connects those pages to the rest of your company context.",
    brandColor: '#000000', overlayPos: 'top-left' },
];

export const ALL_RAYS: SourceKey[] = SOURCES.map(s => s.key);
