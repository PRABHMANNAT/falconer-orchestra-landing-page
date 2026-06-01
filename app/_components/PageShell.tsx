import type { ReactNode } from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";

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
      <SiteHeader />

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
