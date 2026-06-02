"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { INTEGRATIONS } from "./integrations";
import "./styles.css";

const EASE = [0.22, 1, 0.36, 1] as const;

type StepId = "connect" | "structure" | "ask";

const STEPS: {
  id: StepId;
  n: string;
  label: string;
  title: string;
  desc: string;
}[] = [
  {
    id: "connect",
    n: "01",
    label: "Connect",
    title: "Plug in the tools you already use",
    desc: "One click — Slack, GitHub, Notion, Linear and more. No setup, no config.",
  },
  {
    id: "structure",
    n: "02",
    label: "Structure",
    title: "Every signal becomes one brain",
    desc: "Threads, docs, tickets, and decisions link themselves into a single map.",
  },
  {
    id: "ask",
    n: "03",
    label: "Ask",
    title: "Socrates answers — with sources",
    desc: "Cited answers, surfaced risk, and context on tap. No more tab juggling.",
  },
];

// ─── Panels ────────────────────────────────────────────────────────────────

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

function ConnectPanel() {
  return (
    <motion.div
      className="gs-connect"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="gs-connect-grid" variants={stagger}>
        {INTEGRATIONS.map((t) => (
          <motion.figure
            key={t.id}
            className="gs-tile"
            variants={fadeUp}
            whileHover={{ y: -3 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
          >
            <span className="gs-tile-logo" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.src} alt="" loading="lazy" draggable={false} />
            </span>
            <figcaption className="gs-tile-meta">
              <b>{t.name}</b>
              <small>{t.category}</small>
            </figcaption>
            <motion.span
              className="gs-tile-check"
              aria-hidden="true"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 + Math.random() * 0.6, type: "spring", stiffness: 380, damping: 18 }}
            >
              <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
                <path d="M2 6.5 L5 9.5 L10 3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.span>
          </motion.figure>
        ))}
      </motion.div>
    </motion.div>
  );
}

function StructurePanel() {
  const messages = [
    { from: "you", text: "What did we promise Northwind about retries?" },
    {
      from: "soc",
      text: "A 24-hour replay window with idempotency keys — committed on the May 14 call.",
      chips: ["May 14 · call", "NW-218 · ticket", "Scoping memo"],
    },
  ] as const;

  return (
    <motion.div
      className="gs-structure"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      {messages.map((m, i) => (
        <motion.div
          key={i}
          className={`gs-msg ${m.from === "you" ? "gs-msg-you" : "gs-msg-soc"}`}
          variants={fadeUp}
        >
          <span className="gs-msg-who">{m.from === "you" ? "You" : "Socrates"}</span>
          <p>{m.text}</p>
          {"chips" in m && m.chips && (
            <motion.div className="gs-chips" variants={stagger}>
              {m.chips.map((c) => (
                <motion.span key={c} className="gs-chip" variants={fadeUp}>
                  {c}
                </motion.span>
              ))}
            </motion.div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}

function AskPanel() {
  const items = [
    {
      sev: "high",
      cat: "Merge conflict",
      title: "Two PRs editing auth.ts",
      desc: "Maya and Devraj both touched the same file — whoever merges last has to rebase.",
    },
    {
      sev: "med",
      cat: "Spec drift",
      title: "OAuth in code, magic-link in PRD",
      desc: "Your spec and your code stopped agreeing. Reconcile before launch.",
    },
    {
      sev: "med",
      cat: "Stalled work",
      title: "PR #43 — no activity in 7 days",
      desc: "Blocked on review from Sarah. Devraj nudged once on Monday.",
    },
    {
      sev: "low",
      cat: "Coverage gap",
      title: "Driver Assignment has no engineering activity",
      desc: "Scoped for sprint 4, we're in sprint 5, and nothing has been touched.",
    },
  ] as const;

  return (
    <motion.div
      className="gs-ask"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      {items.map((it) => (
        <motion.article
          key={it.title}
          className="gs-sugg"
          variants={fadeUp}
          whileHover={{ y: -3 }}
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
        >
          <header className="gs-sugg-head">
            <span className={`gs-sugg-sev gs-sev-${it.sev}`}>{it.cat}</span>
          </header>
          <h4>{it.title}</h4>
          <p>{it.desc}</p>
        </motion.article>
      ))}
    </motion.div>
  );
}

// ─── Section ───────────────────────────────────────────────────────────────

export default function GettingStartedSection() {
  const [active, setActive] = useState<StepId>("connect");
  const step = STEPS.find((s) => s.id === active)!;

  return (
    <section id="getstarted" className="gs-section" aria-labelledby="gs-title">
      <motion.header
        className="gs-head"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
        }}
      >
        <motion.p className="gs-kicker" variants={fadeUp}>
          Getting started
        </motion.p>
        <motion.h2 id="gs-title" variants={fadeUp}>
          Three steps. <span>One company brain.</span>
        </motion.h2>
        <motion.p className="gs-sub" variants={fadeUp}>
          Plug Orchestra into the tools you live in. Every signal becomes
          one source of truth — and Socrates rides along to answer, cite,
          and surface risk.
        </motion.p>
      </motion.header>

      <motion.div
        role="tablist"
        aria-label="Getting started steps"
        className="gs-tabs"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
      >
        {STEPS.map((s) => {
          const isActive = s.id === active;
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`gs-panel-${s.id}`}
              id={`gs-tab-${s.id}`}
              onClick={() => setActive(s.id)}
              className={`gs-tab${isActive ? " is-active" : ""}`}
            >
              {isActive && (
                <motion.span
                  layoutId="gs-tab-pill"
                  className="gs-tab-pill"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  aria-hidden="true"
                />
              )}
              <span className="gs-tab-content">
                <span className="gs-tab-n">{s.n}</span>
                <span className="gs-tab-label">{s.label}</span>
              </span>
            </button>
          );
        })}
      </motion.div>

      <motion.div
        className="gs-stage"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.2 }}
      >
        <motion.div
          key={active}
          id={`gs-panel-${active}`}
          role="tabpanel"
          aria-labelledby={`gs-tab-${active}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: EASE }}
          className="gs-stage-inner"
        >
          <div className="gs-stage-head">
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
          </div>
          <div className="gs-stage-body">
            {active === "connect" && <ConnectPanel />}
            {active === "structure" && <StructurePanel />}
            {active === "ask" && <AskPanel />}
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="gs-foot"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <a href="#integrations" className="gs-link">
          See all integrations
          <span aria-hidden="true">→</span>
        </a>
      </motion.div>
    </section>
  );
}
