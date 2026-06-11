"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { INTEGRATIONS } from "./integrations";
import Mark from "../Mark";
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

function BeamNode({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`gs-beam-node ${className}`}>{children}</div>;
}

function BeamLogo({ id }: { id: string }) {
  const integration = INTEGRATIONS.find((item) => item.id === id);
  if (!integration) return null;

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={integration.src} alt="" draggable={false} />
      <span>{integration.name}</span>
    </>
  );
}

function OrchestraBeamMap() {
  const beamPaths = [
    { d: "M 116 68 Q 226 34 340 150", delay: "0s" },
    { d: "M 116 150 Q 232 150 340 150", delay: "0.25s" },
    { d: "M 116 232 Q 226 266 340 150", delay: "0.5s" },
    { d: "M 564 68 Q 454 34 340 150", delay: "0.75s", reverse: true },
    { d: "M 564 150 Q 448 150 340 150", delay: "1s", reverse: true },
    { d: "M 564 232 Q 454 266 340 150", delay: "1.25s", reverse: true },
  ];

  return (
    <div className="gs-beam-stage" aria-label="Connected tools flowing into Orchestra">
      <svg className="gs-beam-svg" viewBox="0 0 680 300" aria-hidden="true">
        <defs>
          <linearGradient id="gs-beam-gradient" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="36%" stopColor="var(--color-accent)" stopOpacity="0.22" />
            <stop offset="54%" stopColor="var(--color-accent)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        {beamPaths.map((path) => (
          <path key={`base-${path.d}`} className="animated-beam-base" d={path.d} />
        ))}
        {beamPaths.map((path) => (
          <path
            key={`flow-${path.d}`}
            className="animated-beam-flow"
            d={path.d}
            stroke="url(#gs-beam-gradient)"
            style={{
              animationDelay: path.delay,
              animationDirection: path.reverse ? "reverse" : "normal",
            }}
          />
        ))}
      </svg>
      <div className="gs-beam-grid">
        <BeamNode className="gs-beam-node-slack">
          <BeamLogo id="slack" />
        </BeamNode>
        <BeamNode className="gs-beam-node-gdocs">
          <BeamLogo id="gdocs" />
        </BeamNode>

        <BeamNode className="gs-beam-node-notion">
          <BeamLogo id="notion" />
        </BeamNode>
        <BeamNode className="gs-beam-brain">
          <span className="gs-beam-brain-mark">
            <Mark tone="light" />
          </span>
          <b>Orchestra</b>
          <small>Company brain</small>
        </BeamNode>
        <BeamNode className="gs-beam-node-github">
          <BeamLogo id="github" />
        </BeamNode>

        <BeamNode className="gs-beam-node-teams">
          <BeamLogo id="teams" />
        </BeamNode>
        <BeamNode className="gs-beam-node-fireflies">
          <BeamLogo id="fireflies" />
        </BeamNode>
      </div>
    </div>
  );
}

function ConnectPanel() {
  return (
    <motion.div
      className="gs-connect"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="gs-connect-grid" variants={stagger}>
        {INTEGRATIONS.map((t, index) => (
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
              transition={{ delay: 0.28 + index * 0.06, type: "spring", stiffness: 380, damping: 18 }}
            >
              <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
                <path d="M2 6.5 L5 9.5 L10 3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.span>
          </motion.figure>
        ))}
      </motion.div>
      <OrchestraBeamMap />
    </motion.div>
  );
}

const STRUCTURE_PROMPTS = [
  {
    q: "What did we promise Northwind about retries?",
    a: "A 24-hour replay window with idempotency keys — committed on the May 14 call.",
    chips: ["May 14 · call", "NW-218 · ticket", "Scoping memo"],
  },
  {
    q: "Who's blocked on the auth PR?",
    a: "PR #47 (auth.ts) has been waiting on Sarah for 7 days. Devraj nudged her on Monday.",
    chips: ["GitHub · PR #47", "Slack · #eng", "Apr 22 · Sarah"],
  },
  {
    q: "Decisions from last week's call?",
    a: "Three: ship magic-link first, defer OAuth to v1.1, and promise SAML by Q2 close.",
    chips: ["Call · May 14", "Decision log", "PRD v3"],
  },
  {
    q: "What's still open on the Driver Assignment spec?",
    a: "Scoped in sprint 4 but untouched in sprint 5 — no PRs, no Linear tickets, no commits.",
    chips: ["Spec · Drivers", "Linear · empty", "Sprint 5"],
  },
] as const;

function StructurePanel() {
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [thinking, setThinking] = useState(false);
  const current = STRUCTURE_PROMPTS[idx];

  useEffect(() => {
    if (reduce || paused) return;
    const tick = setInterval(() => {
      setThinking(true);
      const t = setTimeout(() => {
        setIdx((i) => (i + 1) % STRUCTURE_PROMPTS.length);
        setThinking(false);
      }, 520);
      return () => clearTimeout(t);
    }, 4200);
    return () => clearInterval(tick);
  }, [reduce, paused]);

  const choose = (i: number) => {
    if (i === idx) return;
    setThinking(true);
    setTimeout(() => {
      setIdx(i);
      setThinking(false);
    }, 280);
  };

  return (
    <div
      className="gs-structure"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="gs-structure-stream">
        <motion.div
          key={`q-${idx}`}
          className="gs-msg gs-msg-you"
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.36, ease: EASE }}
        >
          <span className="gs-msg-who">You</span>
          <p>{current.q}</p>
        </motion.div>

        {thinking ? (
          <motion.div
            key="thinking"
            className="gs-msg gs-msg-soc gs-msg-thinking"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: EASE }}
            aria-live="polite"
          >
            <span className="gs-msg-who">Socrates</span>
            <span className="gs-typing" aria-label="Thinking">
              <span /><span /><span />
            </span>
          </motion.div>
        ) : (
          <motion.div
            key={`a-${idx}`}
            className="gs-msg gs-msg-soc"
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <span className="gs-msg-who">Socrates</span>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.08, ease: EASE }}
            >
              {current.a}
            </motion.p>
            <motion.div
              className="gs-chips"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.06, delayChildren: 0.24 } },
              }}
            >
              {current.chips.map((c) => (
                <motion.span
                  key={c}
                  className="gs-chip"
                  variants={{
                    hidden: { opacity: 0, y: 6, scale: 0.92 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: { duration: 0.3, ease: EASE },
                    },
                  }}
                >
                  {c}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        )}
      </div>

      <div className="gs-structure-dots" role="tablist" aria-label="Sample prompts">
        {STRUCTURE_PROMPTS.map((p, i) => (
          <button
            key={p.q}
            type="button"
            role="tab"
            aria-selected={i === idx}
            aria-label={`Show prompt ${i + 1}`}
            onClick={() => choose(i)}
            className={`gs-structure-dot${i === idx ? " is-active" : ""}`}
          >
            {i === idx && !reduce && !paused && (
              <motion.span
                key={`fill-${idx}`}
                className="gs-structure-dot-fill"
                aria-hidden="true"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 4.2, ease: "linear" }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
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
        initial={false}
        animate="visible"
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
        initial={false}
        animate={{ opacity: 1, y: 0 }}
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
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.2 }}
      >
        <motion.div
          key={active}
          id={`gs-panel-${active}`}
          role="tabpanel"
          aria-labelledby={`gs-tab-${active}`}
          initial={false}
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
        className="gs-memory-head"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <h2>Socrates</h2>
        <p className="gs-memory-sub">The context layer that talks back</p>
        <p className="gs-memory-desc">
          Socrates rides along on every surface, surfacing what you forgot and pushing back when an
          assumption doesn&apos;t hold. Try it out in the live embedded preview below.
        </p>
      </motion.div>

      <motion.div
        className="gs-memory-preview"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.28 }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        <iframe
          src="http://localhost:5174"
          title="Socrates live preview"
          loading="lazy"
          allow="clipboard-read; clipboard-write"
        />
      </motion.div>

      <motion.div
        className="gs-foot"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <a href="/waitlist" className="gs-link">
          See all integrations
          <span aria-hidden="true">→</span>
        </a>
      </motion.div>
    </section>
  );
}
