import type { Metadata } from "next";
import PageShell from "../_components/PageShell";

export const metadata: Metadata = {
  title: "Terms of Service · Orchestra",
  description: "Terms governing the use of Orchestra."
};

export default function TermsPage() {
  return (
    <PageShell kicker="Legal" title="Terms of Service" updated="May 2026">
      <p>
        These Terms govern your use of Orchestra. By accessing the service you agree to them. If
        you&apos;re using Orchestra on behalf of a company, you represent that you have the
        authority to bind that company.
      </p>

      <h2>Your account</h2>
      <p>
        You&apos;re responsible for the activity that happens under your workspace and for keeping
        credentials secure. Don&apos;t share access with people outside your organisation.
      </p>

      <h2>Acceptable use</h2>
      <p>
        Don&apos;t use Orchestra to violate laws, infringe rights, or process content you don&apos;t
        have the right to process. Don&apos;t attempt to disrupt the service or reverse-engineer it
        beyond what&apos;s permitted by law.
      </p>

      <h2>Pilot &amp; beta features</h2>
      <p>
        Some features are explicitly marked as pilot or beta. They&apos;re provided as-is, may
        change, and may be removed. We&apos;ll do our best to give notice when that happens.
      </p>

      <h2>Termination</h2>
      <p>
        You can terminate your account at any time. We may suspend or terminate access for material
        breach of these Terms, with notice where reasonable.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the extent permitted by law, Orchestra is not liable for indirect or consequential damages
        arising out of your use of the service. Our aggregate liability for any claim is limited to
        the fees you paid in the 12 months preceding the claim.
      </p>

      <h2>Contact</h2>
      <p>
        Questions on these Terms: <a href="mailto:hello@orchestra.dev">hello@orchestra.dev</a>.
      </p>
    </PageShell>
  );
}
