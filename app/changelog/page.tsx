import type { Metadata } from "next";
import PageShell from "../_components/PageShell";

export const metadata: Metadata = {
  title: "Changelog - Orchestra",
  description: "Recent product updates from Orchestra."
};

export default function ChangelogPage() {
  return (
    <PageShell kicker="Resources" title="Changelog" updated="June 2026">
      <p>
        Product updates for Orchestra as the company brain, connected sources, and cited answer
        flows continue to evolve.
      </p>

      <h2>June 2026</h2>
      <p>
        Refined the company brain experience with clearer source paths, stronger account context,
        and tighter surfaced citations for answers that cross calls, tickets, and docs.
      </p>

      <h2>May 2026</h2>
      <p>
        Improved pricing, feature messaging, and the first-run path for teams connecting multiple
        customer-facing systems.
      </p>

      <h2>April 2026</h2>
      <p>
        Added deeper support for account timelines, decision history, and the Socrates answer layer
        across customer context.
      </p>

      <h2>Earlier</h2>
      <p>
        Built the initial Orchestra landing experience, legal pages, core navigation, and foundation
        copy for early pilot teams.
      </p>
    </PageShell>
  );
}
