import type { Metadata } from "next";
import PageShell from "../_components/PageShell";

export const metadata: Metadata = {
  title: "Integrations - Orchestra",
  description: "Tools Orchestra connects to for building a cited company brain."
};

export default function IntegrationsPage() {
  return (
    <PageShell kicker="Resources" title="Integrations" updated="June 2026">
      <p>
        Orchestra connects to the systems where teams make and record decisions, then links that
        work into one account-aware context layer.
      </p>

      <h2>Communication</h2>
      <p>
        Slack, Microsoft Teams, Gmail, and meeting transcripts give Orchestra the real threads
        behind customer commitments, blockers, and follow-ups.
      </p>

      <h2>Planning and delivery</h2>
      <p>
        Linear, GitHub, Notion, and Google Docs connect tickets, pull requests, specs, and notes so
        every answer can point back to the source that proves it.
      </p>

      <h2>Calls and transcripts</h2>
      <p>
        Fireflies and call-note imports help capture customer conversations, implementation
        decisions, and renewal risks that would otherwise stay trapped in meeting history.
      </p>

      <h2>Custom sources</h2>
      <p>
        Teams with internal systems can bring context through controlled imports or custom
        connectors during onboarding.
      </p>
    </PageShell>
  );
}
