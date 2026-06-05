"use client";

import { useEffect, useState, type CSSProperties, type ComponentType, type SVGProps } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { cn } from "@/lib/utils";
import { InteractiveGridPattern } from "@/registry/magicui/interactive-grid-pattern";
import { StripedPattern } from "@/registry/magicui/striped-pattern";
import Footer from "./_components/Footer";
import GettingStarted from "./_components/GettingStarted";
import Mark from "./_components/Mark";
import { GmailLogo, SlackLogo, LinearLogo, NotionLogo } from "./_components/IntegrationLogos";

// Lazy-loaded new sections (all "use client" components)
import dynamic from "next/dynamic";
const AIPmSection = dynamic(() => import("./_components/AIPmSection"), { ssr: false });
const TimelineSection = dynamic(() => import("./_components/TimelineSection"), { ssr: false });
const PricingSection = dynamic(() => import("./_components/PricingSection"), { ssr: false });
const FaqSection = dynamic(() => import("./_components/FaqSection"), { ssr: false });
const DarkModeToggle = dynamic(() => import("./_components/DarkModeToggle"), { ssr: false });
const MobileStickyCta = dynamic(() => import("./_components/MobileStickyCta"), { ssr: false });

const navItems: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
];

const heroContainer = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } }
};
const heroItem = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } }
};

const featureCards = [
  {
    number: "01",
    eyebrow: "Socrates",
    title: "Answers grounded in your company",
    body: "Ask anything and get context pulled from real threads, docs, and decisions — never generic AI slop, always cited.",
    kind: "answer"
  },
  {
    number: "02",
    eyebrow: "The Brain",
    title: "Context that connects itself",
    body: "People, threads, tickets, and decisions link automatically into one living map of your company. No tagging, no folders.",
    kind: "truth"
  },
  {
    number: "03",
    eyebrow: "Integrations",
    title: "Everything you touch, in one place",
    body: "Slack, GitHub, Gmail, Linear, Notion, and your code flow into a single brain you can trust.",
    kind: "context"
  }
];

const reviews = [
  {
    quote:
      "Monday mornings used to mean re-reading three weeks of customer Slack just to remember where the deployment stood. That ritual is gone.",
    name: "Maya R.",
    role: "Forward-Deployed Engineer · Logistics",
    tint: "a"
  },
  {
    quote:
      "The first time Socrates pushed back on a scoping assumption — citing the actual call transcript — I knew this was built for FDEs.",
    name: "Devin K.",
    role: "Senior FDE · Fintech",
    tint: "b"
  },
  {
    quote:
      "Orchestra knows what we promised on-site, what shipped, and what's still open. I stopped tab-switching to hold the account in my head.",
    name: "Sana A.",
    role: "FDE Lead · DevTools",
    tint: "c"
  }
];

const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0 }
};

function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <span className={`logo ${tone}`} style={{ gap: 9 }}>
      <Mark tone={tone} />
      Orchestra
    </span>
  );
}

function Header() {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Home");
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setSolid(latest > 24);
  });

  return (
    <header className={`site-header ${solid ? "solid" : ""}`}>
      <div className="nav-left">
        <Link className="brand" href="/" aria-label="Orchestra home">
          <Logo />
        </Link>
      </div>

      <nav className="nav-center nav-pill-group" aria-label="Main navigation">
        {navItems.map((item) => (
          <Link
            href={item.href}
            key={item.label}
            className={`nav-pill-item${activeNav === item.label ? " active" : ""}`}
            aria-current={activeNav === item.label ? "page" : undefined}
            onClick={() => setActiveNav(item.label)}
          >
            {activeNav === item.label && (
              <motion.span
                className="nav-pill-bg"
                layoutId="nav-pill"
                transition={{ type: "spring", stiffness: 500, damping: 45 }}
              />
            )}
            <span className="nav-pill-text">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="nav-right">
        <a className="nav-signin" href="#" style={{ display: "none" as const }} aria-label="Sign in">
          {/* shown via CSS at wider breakpoints */}
        </a>
        <DarkModeToggle />
        <a className="btn btn-accent" href="/waitlist">
          Join Waitlist
        </a>
        <a
          className="btn btn-dark"
          href="https://calendly.com/adidogra07/orchestra-demo"
          target="_blank"
          rel="noopener noreferrer"
        >
          Book Demo
        </a>
        <button
          type="button"
          className={`hamburger ${menuOpen ? "open" : ""}`}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen ? "true" : "false"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-nav"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
          >
            <nav aria-label="Mobile navigation">
              {navItems.map((item) => (
                <Link
                  href={item.href}
                  key={item.label}
                  className={`mobile-nav-link${activeNav === item.label ? " active" : ""}`}
                  aria-current={activeNav === item.label ? "page" : undefined}
                  onClick={() => { setActiveNav(item.label); setMenuOpen(false); }}
                >
                  {item.label}
                </Link>
              ))}
              <a href="#" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
                Sign In
              </a>
            </nav>
            <a className="btn btn-accent" href="/waitlist" onClick={() => setMenuOpen(false)}>
              Join Waitlist
            </a>
            <a
              className="btn btn-dark"
              href="https://calendly.com/adidogra07/orchestra-demo"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
            >
              Book Demo
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

const softEase = [0.22, 1, 0.36, 1] as const;

const LIVE_DOC_EVENTS = [
  { time: "Apr 30", tag: "Email", tone: "thread", title: "Northwind asks for at-least-once delivery", note: "Ingested from inbox" },
  { time: "May 14", tag: "Call note", tone: "call", title: "Committed to a 24-hour replay window", note: "Promise captured" },
  { time: "May 16", tag: "NW-218", tone: "ticket", title: "Dead-letter queue tracked in Linear", note: "Decision linked" }
];

const LIVE_DOC_LINES = [
  "Northwind wants at-least-once delivery with idempotent replays.",
  "We committed to a 24-hour replay window on the May 14 call.",
  "Dead-letter queue is tracked in NW-218 before we ship."
];

function LiveDocPanel() {
  const reveal = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } }
  };
  const item = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: softEase } }
  };

  return (
    <motion.div
      className="livedoc"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={reveal}
    >
      <motion.div className="livedoc-doc" variants={item}>
        <div className="livedoc-chrome">
          <span className="livedoc-dot" aria-hidden="true" />
          <span className="livedoc-dot" aria-hidden="true" />
          <span className="livedoc-dot" aria-hidden="true" />
          <span className="livedoc-path">Northwind / Live Doc · Webhook Retry Design</span>
        </div>
        <div className="livedoc-page">
          <h4 className="livedoc-doc-title">Scoping the webhook retry flow</h4>
          <motion.div className="livedoc-lines" variants={reveal}>
            {LIVE_DOC_LINES.map((line, i) => (
              <motion.p key={line} className="livedoc-line" variants={item}>
                {line}
                {i === LIVE_DOC_LINES.length - 1 && (
                  <span className="livedoc-caret" aria-hidden="true" />
                )}
              </motion.p>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <motion.div className="livedoc-rail" variants={item}>
        <span className="livedoc-rail-head">In context</span>
        <ol className="livedoc-timeline">
          {LIVE_DOC_EVENTS.map((e) => (
            <motion.li key={e.title} className={`livedoc-event ${e.tone}`} variants={item}>
              <span className="livedoc-node" aria-hidden="true" />
              <div className="livedoc-event-body">
                <span className="livedoc-event-meta">
                  <span className="livedoc-tag">{e.tag}</span>
                  <span className="livedoc-time">{e.time}</span>
                </span>
                <p className="livedoc-event-title">{e.title}</p>
                <span className="livedoc-event-note">{e.note}</span>
              </div>
            </motion.li>
          ))}
        </ol>
      </motion.div>
    </motion.div>
  );
}

function AnswerMock() {
  const chips = [
    { label: "May 14 · call", tone: "thread" },
    { label: "NW-218 · ticket", tone: "ticket" },
    { label: "Scoping memo", tone: "doc" }
  ];

  return (
    <div className="mock answer-mock">
      <motion.div
        className="msg msg-user"
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, ease: softEase }}
      >
        <span className="msg-tag">You</span>
        <p>What did we promise Northwind about retries?</p>
      </motion.div>

      <motion.div
        className="msg msg-answer"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: softEase, delay: 0.2 }}
      >
        <div className="msg-head">
          <span className="msg-avatar"><Mark tone="light" /></span>
          <span className="msg-tag accent">Socrates</span>
          <span className="msg-dots" aria-hidden="true">
            <span /><span /><span />
          </span>
        </div>
        <p>A 24-hour replay window with idempotency keys — committed on the May 14 call.</p>
        <motion.div
          className="msg-chips"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.6 }}
        >
          {chips.map((c) => (
            <motion.span
              key={c.label}
              className={`chip ${c.tone}`}
              variants={{
                hidden: { opacity: 0, y: 4 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: softEase } }
              }}
            >
              {c.label}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

function TruthMock() {
  const nodes = [
    { id: "email", label: "Email", sub: "Can you support replays?", x: 60, y: 50 },
    { id: "call", label: "Call note", sub: "24-hr replay window", x: 260, y: 120 },
    { id: "ticket", label: "NW-218", sub: "Dead-letter queue", x: 80, y: 200 }
  ];
  const edges = [
    { d: "M60,50 C140,70 200,90 260,120", delay: 0.3 },
    { d: "M260,120 C200,160 140,180 80,200", delay: 0.6 },
    { d: "M60,50 C40,120 50,170 80,200", delay: 0.9 }
  ];

  return (
    <div className="mock truth-mock">
      <svg className="truth-svg" viewBox="0 0 340 260" aria-hidden="true">
        <defs>
          <radialGradient id="halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </radialGradient>
        </defs>
        {edges.map((e, i) => (
          <g key={i}>
            <motion.path
              d={e.d}
              fill="none"
              stroke="var(--color-accent-darker)"
              strokeOpacity="0.35"
              strokeWidth="1.4"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, ease: "easeOut", delay: e.delay }}
            />
            <motion.path
              d={e.d}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="6 200"
              initial={{ strokeDashoffset: 0, opacity: 0 }}
              whileInView={{ opacity: 1, strokeDashoffset: -206 }}
              viewport={{ once: true }}
              transition={{
                opacity: { duration: 0.3, delay: e.delay + 0.8 },
                strokeDashoffset: { duration: 3.2, repeat: Infinity, ease: "linear", delay: e.delay + 0.8 }
              }}
            />
          </g>
        ))}
        {nodes.map((n, i) => (
          <motion.g
            key={n.id}
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: softEase, delay: 0.15 + i * 0.12 }}
          >
            <circle cx={n.x} cy={n.y} r="22" fill="url(#halo)" />
            <circle cx={n.x} cy={n.y} r="6" fill="var(--color-accent)" />
          </motion.g>
        ))}
      </svg>
      <div className="truth-labels">
        {nodes.map((n, i) => (
          <motion.div
            key={n.id}
            className={`truth-label l-${i}`}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: softEase, delay: 0.5 + i * 0.15 }}
          >
            <b>{n.label}</b>
            <span>{n.sub}</span>
          </motion.div>
        ))}
      </div>
      <motion.span
        className="truth-pill"
        initial={{ opacity: 0, y: 4 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: softEase, delay: 1.4 }}
      >
        Auto-linked · 3 sources
      </motion.span>
    </div>
  );
}

function ContextMock() {
  const sources: { label: string; Logo: ComponentType<SVGProps<SVGSVGElement>> }[] = [
    { label: "Gmail",  Logo: GmailLogo },
    { label: "Slack",  Logo: SlackLogo },
    { label: "Linear", Logo: LinearLogo },
    { label: "Notion", Logo: NotionLogo },
  ];
  return (
    <div className="mock context-mock">
      <span className="ctx-ring r1" />
      <span className="ctx-ring r2" />
      <span className="ctx-ring r3" />
      <div className="orbit">
        {sources.map(({ label, Logo }, i) => (
          <span
            key={label}
            className="orbit-slot"
            style={{ "--i": i, "--n": sources.length } as CSSProperties}
          >
            <span className="orbit-node">
              <Logo className="orbit-node-logo" />
              <span className="orbit-node-label">{label}</span>
            </span>
          </span>
        ))}
      </div>
      <motion.div
        className="core-node"
        initial={{ scale: 0.85, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: softEase, delay: 0.2 }}
      >
        <Mark tone="light" />
      </motion.div>
    </div>
  );
}

function FeatureMock({ kind }: { kind: string }) {
  if (kind === "answer") return <AnswerMock />;
  if (kind === "truth") return <TruthMock />;
  return <ContextMock />;
}

type CopilotSource = { label: string; tone: "doc" | "thread" | "ticket" | "call" };
type CopilotEntry = { q: string; a: string; sources: CopilotSource[] };

const COPILOT_ENTRIES: CopilotEntry[] = [
  {
    q: "What did we promise on the SSO rollout?",
    a: "SAML-first, OIDC as fallback, provisioned via SCIM — committed on the April scoping call.",
    sources: [
      { label: "Scoping memo · Auth", tone: "doc" },
      { label: "Slack · Maya · Apr 22", tone: "thread" },
      { label: "Linear NW-141 · SCIM", tone: "ticket" }
    ]
  },
  {
    q: "What's still open before we ship retries?",
    a: "The dead-letter queue and the 24-hour replay window aren't in the plan doc yet.",
    sources: [
      { label: "Call note · May 14", tone: "call" },
      { label: "Linear NW-218", tone: "ticket" },
      { label: "Plan · Retries", tone: "doc" }
    ]
  },
  {
    q: "Who owns the Northwind renewal?",
    a: "Maya leads commercial, Devin owns the technical rollout. Renewal review is set for June 3.",
    sources: [
      { label: "CRM · Northwind", tone: "doc" },
      { label: "Slack · #deployment", tone: "thread" },
      { label: "Calendar · Jun 3", tone: "call" }
    ]
  }
];

type BrainNode = { id: string; label: string; count: string; tone: CopilotSource["tone"] | null };
const BRAIN_NODES: BrainNode[] = [
  { id: "people",   label: "People",    count: "24",  tone: null },
  { id: "thread",   label: "Threads",   count: "318", tone: "thread" },
  { id: "doc",      label: "Docs",      count: "47",  tone: "doc" },
  { id: "ticket",   label: "Tickets",   count: "31",  tone: "ticket" },
  { id: "call",     label: "Calls",     count: "16",  tone: "call" },
  { id: "decision", label: "Decisions", count: "12",  tone: null }
];
const BRAIN_POINTS = BRAIN_NODES.map((_, i) => {
  const a = (i / BRAIN_NODES.length) * Math.PI * 2 - Math.PI / 2;
  return { x: 50 + 34 * Math.cos(a), y: 50 + 34 * Math.sin(a) };
});

const SOCRATES_TRACE_STEPS = [
  { label: "Ask", detail: "Reads account intent" },
  { label: "Trace", detail: "Pulls docs, calls, tickets" },
  { label: "Cite", detail: "Returns proof-backed answer" }
];

function SocratesPanel() {
  const [idx, setIdx] = useState(0);
  const [thinking, setThinking] = useState(false);
  const reduceMotion = useReducedMotion();
  const entry = COPILOT_ENTRIES[idx];
  const activeTones = new Set(entry.sources.map((s) => s.tone));

  useEffect(() => {
    if (reduceMotion) return;
    const tick = setInterval(() => {
      setThinking(true);
      setIdx((i) => (i + 1) % COPILOT_ENTRIES.length);
      const t = setTimeout(() => setThinking(false), 650);
      return () => clearTimeout(t);
    }, 4600);
    return () => clearInterval(tick);
  }, [reduceMotion]);

  const choose = (i: number) => {
    if (i === idx) return;
    setThinking(true);
    setIdx(i);
    setTimeout(() => setThinking(false), 650);
  };

  return (
    <motion.div
      className="copilot"
      initial={{ opacity: 1, y: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: softEase }}
    >
      <div className="copilot-bar">
        <span className="copilot-dot" aria-hidden="true" />
        <span className="copilot-dot" aria-hidden="true" />
        <span className="copilot-dot" aria-hidden="true" />
        <span className="copilot-path">Northwind · Account brain</span>
        <span className="copilot-badge">
          <span className="copilot-badge-mark"><Mark tone="light" /></span>
          Socrates
        </span>
      </div>

      <div className="copilot-cmd">
        <kbd className="copilot-kbd">⌘K</kbd>
        <motion.span
          key={entry.q}
          className="copilot-cmd-text"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: softEase }}
        >
          {entry.q}
        </motion.span>
        <span className={`copilot-status${thinking ? " is-thinking" : ""}`}>
          {thinking ? "Tracing" : "Live"}
        </span>
        <span className="copilot-cmd-caret" aria-hidden="true" />
      </div>

      <div className="copilot-body">
        <div className="copilot-thread">
          <div className="copilot-answer">
            <span className="copilot-answer-avatar"><Mark tone="light" /></span>
            <div className="copilot-answer-body">
              <div className="copilot-answer-top">
                <span className="copilot-answer-name">Socrates</span>
                <span className={`copilot-answer-state${thinking ? " is-thinking" : ""}`}>
                  {thinking ? "checking sources" : "grounded answer"}
                </span>
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={entry.a}
                  className="copilot-answer-text"
                  initial={false}
                  animate={{ opacity: thinking ? 0.72 : 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.28, ease: softEase }}
                >
                  {entry.a}
                </motion.p>
              </AnimatePresence>

              <motion.div
                className="copilot-sources"
                key={entry.q + "-src"}
                initial={false}
                animate="visible"
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
              >
                <span className="copilot-sources-label">Grounded in</span>
                {entry.sources.map((s) => (
                  <motion.span
                    key={s.label}
                    className={`copilot-chip ${s.tone}`}
                    variants={{
                      hidden: { opacity: 0, y: 4 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: softEase } }
                    }}
                  >
                    {s.label}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          </div>

          <div className="copilot-trace" aria-label="How Socrates uses the company brain">
            {SOCRATES_TRACE_STEPS.map((step, stepIndex) => (
              <motion.div
                key={step.label}
                className={`copilot-trace-step${thinking || stepIndex <= idx % SOCRATES_TRACE_STEPS.length ? " is-active" : ""}`}
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24, ease: softEase, delay: stepIndex * 0.04 }}
              >
                <span className="copilot-trace-index">{stepIndex + 1}</span>
                <span className="copilot-trace-copy">
                  <b>{step.label}</b>
                  <small>{step.detail}</small>
                </span>
              </motion.div>
            ))}
          </div>

          <div className="copilot-suggest">
            {COPILOT_ENTRIES.map((e, i) => (
              <button
                key={e.q}
                type="button"
                className={`copilot-suggest-chip${i === idx ? " is-active" : ""}`}
                aria-pressed={i === idx}
                onClick={() => choose(i)}
              >
                {e.q}
              </button>
            ))}
          </div>
        </div>

        <aside className="copilot-brain">
          <span className="copilot-brain-head">Company brain</span>
          <div className="brain-graph">
            <svg className="brain-wires" viewBox="0 0 100 100" aria-hidden="true">
              {BRAIN_NODES.map((node, i) => {
                const on = !thinking && node.tone !== null && activeTones.has(node.tone);
                const p = BRAIN_POINTS[i];
                return (
                  <line
                    key={node.id}
                    x1={p.x}
                    y1={p.y}
                    x2={50}
                    y2={50}
                    className={`brain-wire${on ? " is-active" : ""}`}
                    vectorEffect="non-scaling-stroke"
                  />
                );
              })}
              {!thinking && !reduceMotion &&
                BRAIN_NODES.map((node, i) => {
                  if (node.tone === null || !activeTones.has(node.tone)) return null;
                  const p = BRAIN_POINTS[i];
                  return (
                    <motion.circle
                      key={`packet-${idx}-${node.id}`}
                      className="brain-packet"
                      r={1.6}
                      initial={{ cx: p.x, cy: p.y, opacity: 0 }}
                      animate={{ cx: [p.x, 50], cy: [p.y, 50], opacity: [0, 1, 1, 0] }}
                      transition={{
                        duration: 1.5,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatDelay: 0.25,
                        delay: 0.3 + i * 0.12
                      }}
                    />
                  );
                })}
            </svg>

            {BRAIN_NODES.map((node, i) => {
              const on = !thinking && node.tone !== null && activeTones.has(node.tone);
              return (
                <span
                  key={node.id}
                  className={`brain-node${on ? " is-active" : ""}`}
                  style={{ left: `${BRAIN_POINTS[i].x}%`, top: `${BRAIN_POINTS[i].y}%` }}
                  aria-hidden="true"
                >
                  <span className="brain-node-dot" />
                </span>
              );
            })}
            <span className="brain-core" aria-hidden="true">
              <Mark tone="light" />
            </span>
          </div>

          <ul className="brain-legend">
            {BRAIN_NODES.map((node) => {
              const on = !thinking && node.tone !== null && activeTones.has(node.tone);
              return (
                <li key={node.id} className={`brain-legend-item${on ? " is-active" : ""}`}>
                  <span className="brain-legend-dot" aria-hidden="true" />
                  <span className="brain-legend-label">{node.label}</span>
                  <span className="brain-legend-count">{node.count}</span>
                </li>
              );
            })}
          </ul>

          <span className="copilot-brain-foot">
            <span className="copilot-brain-live" aria-hidden="true" />
            Synced just now
          </span>
        </aside>
      </div>
    </motion.div>
  );
}

function FdeAvatar({ name, tint }: { name: string; tint: string }) {
  // DiceBear HTTP API — deterministic SVG portrait seeded by the person's name.
  const src = `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(
    name
  )}&radius=50&backgroundType=gradientLinear`;
  return (
    <motion.span
      className={`fde-avatar fde-avatar--${tint}`}
      aria-hidden="true"
      initial={{ scale: 0.5, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.15 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" width={40} height={40} loading="lazy" />
    </motion.span>
  );
}

export default function Home() {
  return (
    <>
      <Header />

      <main>
        {/* ── SECTION 1: HERO ── */}
        <section className="hero" style={{ minHeight: "90vh", display: "flex", alignItems: "center" }}>
          <div className="hero-grid-bg">
            <InteractiveGridPattern
              className={cn(
                "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
                "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
              )}
            />
          </div>
          <div className="hero-two-col">
            {/* Left column */}
            <motion.div className="hero-left hero-copy" initial="hidden" animate="visible" variants={heroContainer}>
              <motion.span className="hero-eyebrow" variants={heroItem}>
                One source of truth — Powered by AI
              </motion.span>

              <motion.h1 variants={heroContainer} style={{ margin: 0 }}>
                <motion.span className="hero-line" variants={heroItem}>Your company&apos;s brain.</motion.span>
                <motion.span className="hero-line" variants={heroItem}>Always up to date.</motion.span>
                <motion.span className="hero-line" variants={heroItem}>Always honest.</motion.span>
              </motion.h1>

              <motion.p className="hero-sub" variants={heroItem}>
                Orchestra ingests every doc, thread, commit, and decision your team touches — then turns it into a living source of truth that Socrates, our AI, queries on demand.
              </motion.p>

              <motion.div className="hero-actions" variants={heroItem}>
                <motion.a className="primary" href="/waitlist" whileHover={{ scale: 0.97 }} whileTap={{ scale: 0.95 }}>
                  Join Waitlist
                </motion.a>
                <a
                  className="secondary"
                  href="https://calendly.com/adidogra07/orchestra-demo"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book Demo
                </a>
                <a className="hero-ghost" href="#">
                  Sign up free →
                </a>
              </motion.div>

              <motion.p className="hero-note" variants={heroItem}>
                Free during beta · No credit card · 5 min setup
              </motion.p>
            </motion.div>

            {/* Right column — product video */}
            <div className="hero-right">
              <div className="hero-video">
                <video
                  src="/getting-started.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label="Orchestra in motion"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: LIVE DOC (terracotta) ── */}
        <motion.section
          className="memory"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          transition={{ duration: 0.6, ease: softEase }}
        >
          <LiveDocPanel />
          <div>
            <p className="kicker" style={{ color: "rgba(255,255,255,0.65)" }}>Live Doc</p>
            <h2>Your working doc, always in context</h2>
            <p>Draft PRDs, scoping memos, and status updates in a document that already knows your team — every decision, thread, and promise in scope as you write.</p>
            <a href="#" className="memory-explore">Explore Live Doc →</a>
          </div>
        </motion.section>

        {/* ── SECTION 4: WHY ORCHESTRA ── */}
        <section className="flow">
          <motion.div
            className="section-heading why-heading"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            transition={{ duration: 0.6, ease: softEase }}
          >
            <motion.span
              className="heading-rule"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: softEase }}
            />
            <h2 className="why-h2">
              Why Orchestra<span className="why-period">.</span>
            </h2>
            <p className="why-lead">
              Built for teams that move fast — Orchestra holds your company&apos;s reality so you don&apos;t have to, across every input, every doc, every surface.
            </p>
          </motion.div>

          <div className="feature-grid">
            {featureCards.map((card, index) => (
              <motion.article
                key={card.title}
                className={`feature-card ${card.kind}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.6, ease: softEase, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
              >
                <span className="feature-corner" aria-hidden="true" />
                <header className="feature-card-head">
                  <span className="number">{card.number}</span>
                  <span className="feature-eyebrow">{card.eyebrow}</span>
                </header>
                <FeatureMock kind={card.kind} />
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* ── SECTION 5: GETTING STARTED (integrations) ── */}
        <GettingStarted />

        {/* ── SECTION 6: SOCRATES ── */}
        <section className="record" id="record">
          <div className="record-pattern-bg">
            <StripedPattern className="[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]" />
          </div>
          <SocratesPanel />
          <motion.div
            className="record-copy"
            initial={false}
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.6, ease: softEase }}
          >
            <p className="kicker blue">Socrates</p>
            <h2>The context layer that talks back</h2>
            <p>Socrates rides along on every surface. It sees what you&apos;re looking at, surfaces what you forgot, and pushes back when an assumption doesn&apos;t hold.</p>
          </motion.div>
        </section>

        {/* ── SECTION 7: AI PM (Suggestions) — NEW ── */}
        <AIPmSection />

        {/* ── SECTION 8: TIMELINE — NEW ── */}
        <TimelineSection />

        {/* ── SECTION 9: TESTIMONIALS ── */}
        <section className="builders fde-section">
          <motion.div
            className="fde-heading"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } }
            }}
          >
            <motion.span
              className="fde-eyebrow"
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5, ease: softEase }}
            >
              Forward-Deployed Engineers
            </motion.span>
            <h2 className="fde-h2">
              <motion.span
                variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.6, ease: softEase }}
              >
                Made for{" "}
              </motion.span>
              <motion.span
                className="accent-word"
                variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.6, ease: softEase }}
              >
                FDEs.
              </motion.span>
            </h2>
            <motion.p
              className="fde-sub"
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5, ease: softEase }}
            >
              Forward-deployed engineers live in the customer&apos;s reality. Orchestra keeps every thread,
              decision, and commit in one brain they can trust on-site.
            </motion.p>
          </motion.div>

          <motion.div
            className="fde-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
            }}
          >
            {reviews.map((item) => (
              <motion.figure
                key={item.name}
                className="fde-card"
                variants={{
                  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { duration: 0.6, ease: softEase }
                  }
                }}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
              >
                <span className="fde-card-bar" aria-hidden="true" />
                <blockquote className="fde-quote">{item.quote}</blockquote>
                <figcaption className="fde-person">
                  <FdeAvatar name={item.name} tint={item.tint} />
                  <span className="fde-person-meta">
                    <b>{item.name}</b>
                    <small>{item.role}</small>
                  </span>
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>
        </section>

        {/* ── SECTION 10: PRICING — NEW ── */}
        <PricingSection />

        {/* ── SECTION 11: FAQ — NEW ── */}
        <FaqSection />
      </main>

      <Footer />
      <MobileStickyCta />
    </>
  );
}
