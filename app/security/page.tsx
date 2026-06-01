import type { Metadata } from "next";
import PageShell from "../_components/PageShell";

export const metadata: Metadata = {
  title: "Security · Orchestra",
  description: "How Orchestra protects customer data."
};

export default function SecurityPage() {
  return (
    <PageShell kicker="Trust" title="Security" updated="May 2026">
      <p>
        Orchestra sits in the middle of sensitive customer context — emails, call notes, internal
        decisions. Security is non-optional. This page summarises how we protect that data today,
        and what&apos;s on the roadmap.
      </p>

      <h2>Infrastructure</h2>
      <p>
        Orchestra is built on Supabase (Postgres, auth, storage) hosted in AWS. Data is encrypted in
        transit (TLS 1.2+) and at rest (AES-256). Tenant data is logically isolated by workspace.
      </p>

      <h2>Access &amp; auth</h2>
      <p>
        Sign-in is handled through Google OAuth today, with SSO (SAML, OIDC) available on request
        for pilot customers. Team roles are scoped at workspace and account level.
      </p>

      <h2>Integrations</h2>
      <p>
        Gmail, Slack, Linear, and similar integrations use OAuth scopes limited to what the surfaces
        require. You can disconnect any integration from the workspace settings; ingestion stops
        immediately and derived context is removed within 30 days.
      </p>

      <h2>Model providers</h2>
      <p>
        We use Anthropic Claude as our primary inference provider. Prompts and outputs are not used
        to train Anthropic models, per our contract with them.
      </p>

      <h2>Compliance</h2>
      <p>
        SOC 2 Type I is on the 2026 roadmap. We can sign DPAs and respond to security questionnaires
        for pilot customers in the meantime.
      </p>

      <h2>Reporting an issue</h2>
      <p>
        Found a vulnerability? Email <a href="mailto:security@orchestra.dev">security@orchestra.dev</a>.
        We&apos;ll respond within two business days.
      </p>
    </PageShell>
  );
}
