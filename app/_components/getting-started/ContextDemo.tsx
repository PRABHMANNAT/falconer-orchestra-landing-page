"use client";

import { memo, useState } from "react";
import { motion } from "framer-motion";
import CompanyBrainChart from "./CompanyBrainChart";

const EASE = [0.22, 1, 0.36, 1] as const;

type Reply = { body: string; citations: { label: string; href: string }[] };

const PROMPTS: { q: string; reply: Reply }[] = [
  {
    q: "What did we promise on the SSO rollout?",
    reply: {
      body:
        "Northwind expects SAML by end of Q2 (Maya, May 14). OIDC fallback was descoped in the PRD update on May 22. Engineering owner: Devraj.",
      citations: [
        { label: "Slack · #northwind",      href: "#ref/slack" },
        { label: "Doc · PRD v3",            href: "#ref/doc" },
        { label: "Call · Northwind May 14", href: "#ref/call" },
      ],
    },
  },
  {
    q: "Who's blocked on the auth PR?",
    reply: {
      body:
        "PR #47 (auth.ts refactor) is waiting on Sarah for review — no activity in 7 days. Devraj posted a nudge in #eng on Monday.",
      citations: [
        { label: "GitHub · PR #47", href: "#ref/pr47" },
        { label: "Slack · #eng",    href: "#ref/eng" },
      ],
    },
  },
  {
    q: "Decisions from last week's call?",
    reply: {
      body:
        "Three: ship magic-link first; defer OAuth to v1.1; promise SAML by Q2 close. All three logged to the account brain.",
      citations: [
        { label: "Call · May 14",       href: "#ref/may14" },
        { label: "Doc · Decision log",  href: "#ref/log"   },
      ],
    },
  },
];

function ContextDemoImpl() {
  const [active, setActive] = useState(0);
  const current = PROMPTS[active];

  return (
    <div
      role="tabpanel"
      id="gs-panel-structure"
      aria-labelledby="gs-tab-structure"
    >
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <span className="gs-stage-pill">
          <span className="gs-stage-pill-dot" aria-hidden="true" />
          Live · Socrates
        </span>
        <span className="gs-convo-status">Try a prompt</span>
      </header>

      <div className="gs-context">
        <section className="gs-convo" aria-label="Socrates conversation">
          <header className="gs-convo-head">
            <span className="gs-convo-avatar" aria-hidden="true">SO</span>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span className="gs-convo-name">Socrates</span>
              <span className="gs-convo-status">Reads your whole brain · cites every answer</span>
            </div>
          </header>

          <ul className="gs-prompts" aria-label="Sample queries">
            {PROMPTS.map((p, i) => (
              <li key={p.q}>
                <button
                  type="button"
                  className="gs-prompt-btn"
                  onClick={() => setActive(i)}
                  aria-pressed={i === active}
                >
                  {p.q}
                </button>
              </li>
            ))}
          </ul>

          <motion.div
            key={active}
            className="gs-reply"
            initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.32, ease: EASE }}
            aria-live="polite"
          >
            {current.reply.body}
            <div className="gs-reply-citations" aria-label="Sources">
              {current.reply.citations.map((c) => (
                <a key={c.label} href={c.href} className="gs-citation">
                  {c.label}
                </a>
              ))}
            </div>
          </motion.div>
        </section>

        <CompanyBrainChart />
      </div>
    </div>
  );
}

export default memo(ContextDemoImpl);
