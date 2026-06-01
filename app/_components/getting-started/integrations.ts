// Shared list of tool/integration data used by the orbit and the card.
// Real brand logos: Icons8 PNGs for most, logo.dev for tools that aren't
// in the Icons8 bundle (Granola, Notion).

export type Integration = {
  id: string;
  name: string;
  category: string;
  src: string;
  detail: string;
  docs?: string;
};

const LOGO_TOKEN = "pk_bAr4xp1ZTdSLLLK4n3m09A";
const logoDev = (domain: string) =>
  `https://img.logo.dev/${domain}?token=${LOGO_TOKEN}&size=128&retina=true&format=png`;

export const INTEGRATIONS: Integration[] = [
  { id: "slack",     name: "Slack",       category: "Comms",       src: "/integrations/slack.png",       detail: "Channels & threads, summarised", docs: "#docs/slack" },
  { id: "granola",   name: "Granola",     category: "Transcripts", src: logoDev("granola.ai"),           detail: "Calls recapped in seconds",       docs: "#docs/granola" },
  { id: "gdocs",     name: "Google Docs", category: "Docs",        src: "/integrations/google-docs.png", detail: "Docs linked to the brain",        docs: "#docs/gdocs" },
  { id: "github",    name: "GitHub",      category: "Code",        src: "/integrations/github.png",      detail: "PRs become changelog context",    docs: "#docs/github" },
  { id: "teams",     name: "Teams",       category: "Comms",       src: "/integrations/teams.png",       detail: "Every channel ingested",          docs: "#docs/teams" },
  { id: "fireflies", name: "Fireflies",   category: "Transcripts", src: "/integrations/fireflies.png",   detail: "Decisions logged from transcripts", docs: "#docs/fireflies" },
  { id: "notion",    name: "Notion",      category: "Docs",        src: logoDev("notion.so"),            detail: "Runbooks cited in replies",       docs: "#docs/notion" },
  { id: "vscode",    name: "VS Code",     category: "Code",        src: "/integrations/vscode.png",      detail: "Workspace edits kept in sync",    docs: "#docs/vscode" },
];
