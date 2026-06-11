import type { Metadata } from "next";
import PageShell from "../_components/PageShell";

export const metadata: Metadata = {
  title: "Notes - Orchestra",
  description: "Product thinking and operating notes from the Orchestra team."
};

export default function NotesPage() {
  return (
    <PageShell kicker="Resources" title="Notes" updated="June 2026">
      <p>
        Notes from the Orchestra team on company memory, forward deployed engineering, and the
        operational cost of fragmented context.
      </p>

      <h2>The context problem is operational</h2>
      <p>
        Teams do not lose time because information is missing. They lose time because the answer is
        spread across calls, docs, tickets, messages, and code with no shared memory connecting it.
      </p>

      <h2>Why citations matter</h2>
      <p>
        A company brain is only useful when teams can trust the path behind an answer. Orchestra is
        designed to show where context came from, which decision it supports, and what changed.
      </p>

      <h2>FDEs need continuity</h2>
      <p>
        Forward deployed engineers carry a customer&apos;s reality across weeks of implementation
        drift. Orchestra gives that memory a durable place to live so the team can keep moving
        without re-reading the entire account.
      </p>

      <h2>More soon</h2>
      <p>
        We will use this page for product essays, implementation notes, and lessons from early
        deployments.
      </p>
    </PageShell>
  );
}
