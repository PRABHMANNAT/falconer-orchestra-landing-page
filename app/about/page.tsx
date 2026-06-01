import type { Metadata } from "next";
import PageShell from "../_components/PageShell";

export const metadata: Metadata = {
  title: "About · Orchestra",
  description: "Orchestra is the context layer for forward deployed engineers."
};

export default function AboutPage() {
  return (
    <PageShell kicker="About" title="Built for FDEs" updated="May 2026">
      <p>
        Orchestra is a context layer for the Forward Deployed Engineer — the role that holds the
        customer&apos;s reality in its head. We sit between the FDE and the mess of inputs they live
        inside — customer email, Slack, Notion, code, Linear, calls — and turn that chaos into a
        queryable, persistent operating context.
      </p>

      <h2>What we believe</h2>
      <p>
        Engineers don&apos;t want their work automated away. They want their context unified. The
        painful job nobody owns is holding the customer&apos;s reality across weeks of fragmented
        input. That&apos;s the job Orchestra exists to do.
      </p>

      <h2>How it&apos;s built</h2>
      <p>
        Three-tier architecture: Workspace → Account → Surfaces. A workspace per company. An account
        per customer or deployment. Surfaces (Brain, Live Doc, Communications) sit over each
        account&apos;s context, with Socrates riding along as a persistent layer that talks back.
      </p>

      <h2>Where we are</h2>
      <p>
        Early pilots with B2B SaaS teams running multiple deployments per FDE. Working with founders
        and FDE leads who&apos;ve felt the cross-account context problem viscerally.
      </p>

      <h2>Talk to us</h2>
      <p>
        Book a demo at{" "}
        <a href="https://calendly.com/adidogra07/orchestra-demo" target="_blank" rel="noreferrer">
          calendly.com/adidogra07/orchestra-demo
        </a>{" "}
        or email <a href="mailto:hello@orchestra.dev">hello@orchestra.dev</a>.
      </p>
    </PageShell>
  );
}
