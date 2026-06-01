import type { Metadata } from "next";
import PageShell from "../_components/PageShell";

export const metadata: Metadata = {
  title: "Contact · Orchestra",
  description: "Talk to the Orchestra founders."
};

export default function ContactPage() {
  return (
    <PageShell kicker="Contact" title="Talk to founders" updated="May 2026">
      <p>
        Three ways to reach us — pick whichever is easiest.
      </p>

      <h2>Book a demo</h2>
      <p>
        30 minutes, with one of the founders. We&apos;ll walk through Orchestra against a real
        account profile.{" "}
        <a href="https://calendly.com/adidogra07/orchestra-demo" target="_blank" rel="noreferrer">
          calendly.com/adidogra07/orchestra-demo
        </a>
      </p>

      <h2>Email</h2>
      <p>
        General: <a href="mailto:hello@orchestra.dev">hello@orchestra.dev</a>
        <br />
        Security: <a href="mailto:security@orchestra.dev">security@orchestra.dev</a>
      </p>

      <h2>Pilots</h2>
      <p>
        We&apos;re running pilots with small teams (5–50) where each engineer owns multiple
        deployments. If that sounds like you, say so in your email — we&apos;ll fast-track a call.
      </p>
    </PageShell>
  );
}
