import type { Metadata } from "next";
import PageShell from "../_components/PageShell";

export const metadata: Metadata = {
  title: "Docs - Orchestra",
  description: "How to set up Orchestra, connect sources, and use the company brain."
};

export default function DocsPage() {
  return (
    <PageShell kicker="Resources" title="Docs" updated="June 2026">
      <p>
        Orchestra turns the tools your team already uses into a connected company brain. These docs
        cover the core setup path: connect sources, organize account context, and ask cited
        questions across real work.
      </p>

      <h2>Start here</h2>
      <p>
        Create a workspace, invite your team, and connect the systems where customer and product
        decisions already happen. Orchestra builds context from messages, documents, tickets, calls,
        and code activity without asking your team to file everything by hand.
      </p>

      <h2>Core concepts</h2>
      <p>
        Workspaces hold your company context. Accounts represent customers, deployments, or major
        projects. Surfaces like Brain, Live Doc, Communications, and Socrates let teams query and
        act on that context with citations.
      </p>

      <h2>Operational workflow</h2>
      <p>
        Use Orchestra before customer calls, during implementation planning, and after decisions
        shift. The system keeps a trace of what changed, where it came from, and which source backs
        the answer.
      </p>

      <h2>Need help?</h2>
      <p>
        Email <a href="mailto:hello@orchestra.dev">hello@orchestra.dev</a> for setup support or to
        request access to the full implementation guide.
      </p>
    </PageShell>
  );
}
