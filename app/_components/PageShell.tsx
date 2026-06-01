import Link from "next/link";
import type { ReactNode } from "react";
import Mark from "./Mark";
import Footer from "./Footer";

// Minimal header + content + shared footer for sub-pages (Privacy, Terms,
// Security, About, Contact). The main landing page uses its own large
// Header inside page.tsx.
export default function PageShell({
  title,
  kicker,
  updated,
  children
}: {
  title: string;
  kicker?: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <>
      <header className="mini-header">
        <Link href="/" className="mini-brand" aria-label="Orchestra home">
          <Mark />
          <span>Orchestra</span>
        </Link>
        <Link href="/" className="mini-back">
          ← Back home
        </Link>
      </header>

      <main className="legal-page">
        <div className="legal-header">
          {kicker ? <span className="legal-kicker">{kicker}</span> : null}
          <h1 className="legal-title">{title}</h1>
          {updated ? <p className="legal-updated">Last updated · {updated}</p> : null}
        </div>
        <article className="legal-body">{children}</article>
      </main>

      <Footer />
    </>
  );
}
