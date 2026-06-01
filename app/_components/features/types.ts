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
    body: "PRDs, SRSs, scoping memos. Orchestra ingests every page, every section, every revision — and keeps a permanent record of who wrote what when.",
    brandColor: '#4285F4', overlayPos: 'left' },
  { key: 'slack', angle: 45, label: 'Slack', title: 'SLACK CHANNELS',
    body: "Connect the channels that matter. Orchestra reads decisions out of threads so you never have to scroll back through 400 messages to remember what was agreed.",
    brandColor: '#4A154B', overlayPos: 'bottom-left' },
  { key: 'gmail', angle: 90, label: 'Gmail', title: 'EVERY EMAIL',
    body: "Every customer email, every internal thread. Promises, follow-ups, and commitments are extracted and indexed — never lost in an inbox again.",
    brandColor: '#EA4335', overlayPos: 'bottom' },
  { key: 'github', angle: 135, label: 'GitHub', title: 'GITHUB COMMITS + PRS',
    body: "Pull requests, commits, branch activity. The code's intent and history sit alongside the docs that scoped it.",
    brandColor: '#181717', overlayPos: 'bottom-right' },
  { key: 'calendar', angle: 180, label: 'Calendar', title: 'GOOGLE CALENDAR',
    body: "Standups, sprint planning, customer calls. Orchestra knows what's scheduled and what was discussed.",
    brandColor: '#1E88E5', overlayPos: 'right' },
  { key: 'transcripts', angle: 225, label: 'Transcripts', title: 'MEETING TRANSCRIPTS',
    body: "Granola, Fireflies, Otter. Every meeting transcript is searchable. Decisions made on a call no longer evaporate after the call ends.",
    brandColor: '#FF6B35', overlayPos: 'top-right' },
  { key: 'linear', angle: 270, label: 'Linear', title: 'LINEAR ISSUES',
    body: "Tickets, sprints, roadmap. Engineering execution lives next to product intent.",
    brandColor: '#5E6AD2', overlayPos: 'top' },
  { key: 'notion', angle: 315, label: 'Notion', title: 'NOTION WORKSPACES',
    body: "Existing docs in Notion don't need to move. Orchestra reads them in place and keeps them in the same context as everything else.",
    brandColor: '#000000', overlayPos: 'top-left' },
];

export const ALL_RAYS: SourceKey[] = SOURCES.map(s => s.key);
