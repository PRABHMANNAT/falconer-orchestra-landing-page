import type { Metadata } from "next";
import PageShell from "../_components/PageShell";

export const metadata: Metadata = {
  title: "Privacy Policy · Orchestra",
  description: "How Orchestra collects, uses, and protects your data."
};

export default function PrivacyPage() {
  return (
    <PageShell kicker="Legal" title="Privacy Policy" updated="May 2026">
      <p>
        Orchestra is a context layer for forward deployed engineers. To do that job, we ingest data
        from the tools you connect — email, chat, ticketing, documents. This page explains what we
        collect, how we use it, and the controls you have over it.
      </p>

      <h2>What we collect</h2>
      <p>
        We collect the content and metadata of messages, threads, documents, and tickets from the
        integrations you connect to your workspace. We collect account information such as your name,
        email address, and the workspace and accounts you belong to. We collect product usage and
        diagnostic data needed to operate the service.
      </p>

      <h2>How we use it</h2>
      <p>
        Ingested content is structured into a workspace-scoped knowledge graph. We use it to surface
        context inside the surfaces you use — Brain, Live Doc, Communications, and Socrates. We use
        aggregated, de-identified data to improve the product.
      </p>

      <h2>Model training</h2>
      <p>
        We do not train foundation models on your data. Where we use third-party model providers
        (such as Anthropic) for inference, we contractually require that prompts and outputs are not
        used to train their models.
      </p>

      <h2>Retention &amp; deletion</h2>
      <p>
        You can disconnect an integration or delete an account at any time. Disconnecting stops new
        ingestion and removes derived context within 30 days. Deleting your workspace removes all
        associated data within 30 days, subject to legally-required retention.
      </p>

      <h2>Contact</h2>
      <p>
        For privacy questions, reach the founders at <a href="mailto:hello@orchestra.dev">hello@orchestra.dev</a>.
      </p>
    </PageShell>
  );
}
