"use client";

import { useEffect, useRef, useState, type CSSProperties, type ComponentType, type SVGProps } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { cn } from "@/lib/utils";
import { InteractiveGridPattern } from "@/registry/magicui/interactive-grid-pattern";
import { StripedPattern } from "@/registry/magicui/striped-pattern";
import Footer from "./_components/Footer";
import GettingStarted from "./_components/GettingStarted";
import Mark from "./_components/Mark";
import {
  GmailLogo,
  SlackLogo,
  LinearLogo,
  NotionLogo,
  GitHubLogo,
  VercelLogo,
  SupabaseLogo,
  StripeLogo,
  AwsLogo,
  PlanetScaleLogo,
  OrchestraMarkLogo,
  MilestoneFlagLogo
} from "./_components/IntegrationLogos";

// Lazy-loaded new sections (all "use client" components)
import dynamic from "next/dynamic";
const AIPmSection = dynamic(() => import("./_components/AIPmSection"), { ssr: false });
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
    eyebrow: "Source of Truth",
    title: "One source of truth dashboard",
    body: "See decisions, docs, commits, threads, and risk flags in one live operating view of your company.",
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

type LogoComponent = ComponentType<SVGProps<SVGSVGElement>>;
type DiffSide = { label: string; logo?: LogoComponent };

type TimelineEvt = {
  id: string;
  source: "github" | "slack" | "manual" | "socrates" | "milestone";
  tag: string;
  Logo: LogoComponent;
  title: string;
  ref?: string;
  who: string;
  diff?: { old: DiffSide; new: DiffSide };
  milestone?: boolean;
};

const TIMELINE_POOL: TimelineEvt[] = [
  { id: "auth", source: "github", tag: "GitHub", Logo: GitHubLogo, title: "Auth merged to main", ref: "PR #47 · main", who: "Devraj P", milestone: true },
  { id: "pro", source: "slack", tag: "#product", Logo: SlackLogo, title: "Pro tier deferred to v2", who: "Maya C", diff: { old: { label: "v1" }, new: { label: "v2" } } },
  { id: "db", source: "manual", tag: "Decision", Logo: LinearLogo, title: "Database provider switched", who: "Sarah C", diff: { old: { label: "PlanetScale", logo: PlanetScaleLogo }, new: { label: "Supabase", logo: SupabaseLogo } } },
  { id: "api", source: "socrates", tag: "Socrates", Logo: OrchestraMarkLogo, title: "API map synthesised", ref: "34 endpoints", who: "Orchestra" },
  { id: "launch", source: "milestone", tag: "Milestone", Logo: MilestoneFlagLogo, title: "Launch date revised", who: "Sarah C", milestone: true, diff: { old: { label: "Jun 1" }, new: { label: "Jun 15" } } },
  { id: "rate", source: "github", tag: "GitHub", Logo: GitHubLogo, title: "Rate limiter shipped", ref: "PR #54 · main", who: "Liam O" },
  { id: "standup", source: "slack", tag: "#general", Logo: SlackLogo, title: "Standup moved earlier", who: "Maya C", diff: { old: { label: "9:30" }, new: { label: "9:00" } } },
  { id: "promo", source: "socrates", tag: "Socrates", Logo: OrchestraMarkLogo, title: "Promo code scope drafted", ref: "from #product", who: "Orchestra" },
  { id: "host", source: "manual", tag: "Decision", Logo: LinearLogo, title: "Hosting platform selected", who: "Priya S", diff: { old: { label: "AWS EC2", logo: AwsLogo }, new: { label: "Vercel Pro", logo: VercelLogo } } },
  { id: "stripe", source: "milestone", tag: "Milestone", Logo: MilestoneFlagLogo, title: "Stripe Connect chosen", ref: "70/30 split", who: "Sarah C", milestone: true }
];

const SEED_FROM_NAME: Record<string, string> = {
  "Devraj P": "Devraj",
  "Maya C": "Maya",
  "Sarah C": "Sarah",
  "Liam O": "Liam",
  "Priya S": "Priya",
  "Orchestra": "orchestra-ai"
};

function TimelinePanel() {
  const reduced = useReducedMotion();
  const [events, setEvents] = useState<TimelineEvt[]>(() => TIMELINE_POOL.slice(0, 5));
  const [count, setCount] = useState(5);
  const [flashId, setFlashId] = useState<string | null>(null);
  const cursorRef = useRef(5);

  useEffect(() => {
    if (reduced) return;
    const tick = () => {
      const next = TIMELINE_POOL[cursorRef.current % TIMELINE_POOL.length];
      cursorRef.current += 1;
      const incoming: TimelineEvt = { ...next, id: `${next.id}-${cursorRef.current}` };
      setEvents((prev) => [incoming, ...prev.slice(0, 4)]);
      setFlashId(incoming.id);
      setCount((n) => n + 1);
      window.setTimeout(() => setFlashId(null), 1100);
    };
    const t = window.setInterval(tick, 3800);
    return () => window.clearInterval(t);
  }, [reduced]);

  return (
    <motion.div
      className="tlx"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: softEase }}
    >
      <div className="tlx-chrome">
        <span className="livedoc-dot" aria-hidden="true" />
        <span className="livedoc-dot" aria-hidden="true" />
        <span className="livedoc-dot" aria-hidden="true" />
        <span className="livedoc-path">BloomFast / Timeline · Project memory</span>
        <span className="tlx-live" aria-label="Live">
          <motion.span
            className="tlx-live-dot"
            animate={reduced ? {} : { scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="tlx-live-text">LIVE</span>
          <motion.span
            key={count}
            className="tlx-live-count"
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 360, damping: 22 }}
          >
            {count}
          </motion.span>
        </span>
      </div>
      <div className="tlx-body">
        {/* Animated rail: draws in on first view */}
        <motion.span
          className="tlx-rail"
          aria-hidden="true"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.1, ease: softEase, delay: 0.15 }}
        />
        {/* Continuous gentle shimmer */}
        {!reduced && (
          <motion.span
            className="tlx-rail-shimmer"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ y: ["-12%", "112%"], opacity: [0, 0.85, 0.85, 0] }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.15, 0.85, 1],
              repeatDelay: 0.4
            }}
          />
        )}
        {/* Fast pulse that fires every time a new event lands */}
        {!reduced && flashId && (
          <motion.span
            key={`pulse-${flashId}`}
            className="tlx-rail-pulse"
            aria-hidden="true"
            initial={{ y: "0%", opacity: 0 }}
            animate={{ y: "110%", opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.1, ease: [0.2, 0.7, 0.4, 1], times: [0, 0.1, 0.8, 1] }}
          />
        )}

        <motion.ol className="tlx-list" layout>
          <AnimatePresence initial={false} mode="popLayout">
            {events.map((e, i) => {
              const Logo = e.Logo;
              const OldLogo = e.diff?.old.logo;
              const NewLogo = e.diff?.new.logo;
              const seed = SEED_FROM_NAME[e.who] ?? e.who;
              return (
                <motion.li
                  key={e.id}
                  layout
                  className={`tlx-event ${e.source}${e.milestone ? " milestone" : ""}${flashId === e.id ? " is-fresh" : ""}`}
                  initial={{ opacity: 0, y: -18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 14, transition: { duration: 0.3 } }}
                  transition={{ type: "spring", stiffness: 360, damping: 30 }}
                  whileHover={reduced ? undefined : { x: 3, transition: { duration: 0.2 } }}
                >
                  <motion.span
                    className={`tlx-node${i === 0 ? " pulse" : ""}`}
                    aria-hidden="true"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 380, damping: 16, delay: 0.05 }}
                  >
                    {e.milestone && !reduced && (
                      <motion.span
                        className="tlx-node-ring"
                        aria-hidden="true"
                        animate={{ scale: [1, 1.9], opacity: [0.6, 0] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                      />
                    )}
                  </motion.span>
                  <div className="tlx-main">
                    <span className="tlx-meta">
                      <span className="tlx-tag">
                        <Logo className="tlx-tag-logo" />
                        <span>{e.tag}</span>
                      </span>
                      {e.ref && <span className="tlx-ref">{e.ref}</span>}
                      {flashId === e.id && <span className="tlx-new-pill">NEW</span>}
                    </span>
                    <p className="tlx-title">{e.title}</p>
                    {e.diff && (
                      <span className="tlx-diff">
                        <span className="tlx-chip is-old">
                          {OldLogo && <OldLogo className="tlx-chip-logo" />}
                          <s>{e.diff.old.label}</s>
                        </span>
                        <motion.span
                          className="tlx-arrow"
                          aria-hidden="true"
                          animate={reduced ? {} : { x: [0, 3, 0] }}
                          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                        >
                          →
                        </motion.span>
                        <span className="tlx-chip is-new">
                          {NewLogo && <NewLogo className="tlx-chip-logo" />}
                          <b>{e.diff.new.label}</b>
                        </span>
                      </span>
                    )}
                  </div>
                  <motion.img
                    className="tlx-avatar"
                    aria-hidden="true"
                    alt=""
                    draggable={false}
                    src={`https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}&radius=50&backgroundColor=f7f3ef,fbeee8,eef7f5,eeeafc,fef3e2&backgroundType=solid`}
                    whileHover={reduced ? undefined : { scale: 1.12, rotate: -6 }}
                    transition={{ type: "spring", stiffness: 360, damping: 14 }}
                  />
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ol>
      </div>
    </motion.div>
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

function SourceTruthDashboardMock() {
  const metrics = [
    { label: "Sources", value: "12", tone: "accent" },
    { label: "Open risks", value: "03", tone: "dark" }
  ];
  const rows = [
    { label: "OAuth scope reconciled", source: "PRD + GitHub", width: "76%" },
    { label: "Driver review pending", source: "Slack + Calendar", width: "52%" }
  ];

  return (
    <motion.div
      className="mock answer-mock truth-dashboard-mock"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, ease: softEase }}
    >
      <div className="truth-dash-topbar">
        <span className="truth-dash-mark"><Mark tone="light" /></span>
        <span>
          Company dashboard
          <b>Live source of truth</b>
        </span>
        <i aria-hidden="true" />
      </div>

      <div className="truth-dash-metrics">
        {metrics.map((metric) => (
          <div key={metric.label} className={`truth-dash-metric ${metric.tone}`}>
            <span>{metric.label}</span>
            <b>{metric.value}</b>
          </div>
        ))}
      </div>

      <div className="truth-dash-panel">
        <div className="truth-dash-panel-head">
          <span>Unified activity</span>
          <b>Now</b>
        </div>
        {rows.map((row) => (
          <div key={row.label} className="truth-dash-row">
            <span className="truth-dash-row-dot" />
            <div>
              <b>{row.label}</b>
              <span>{row.source}</span>
              <i style={{ width: row.width }} />
            </div>
          </div>
        ))}
      </div>

      <div className="truth-dash-sync">
        <span>Slack</span>
        <span>GitHub</span>
        <span>Docs</span>
      </div>
    </motion.div>
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
  if (kind === "answer") return <SourceTruthDashboardMock />;
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
              <motion.h1 variants={heroContainer} style={{ margin: 0 }}>
                <motion.span className="hero-line" variants={heroItem}>One source of truth for your company</motion.span>
              </motion.h1>

              <motion.p className="hero-sub" variants={heroItem}>
                Orchestra turns your docs, chats, code, and decisions into a self-updating company brain.
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
              </motion.div>

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

        {/* ── SECTION 3: TIMELINE (terracotta) ── */}
        <motion.section
          className="memory"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          transition={{ duration: 0.6, ease: softEase }}
        >
          <TimelinePanel />
          <div>
            <p className="kicker" style={{ color: "rgba(255,255,255,0.65)" }}>Timeline</p>
            <h2>Every change, on one timeline</h2>
            <p>Commits, Slack decisions, and Socrates syntheses land on a single project timeline — watch scope shift in real time instead of reading about it later.</p>
            <a href="#" className="memory-explore">Explore Timeline →</a>
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

        {/* ── SECTION 7: Signal layer (Suggestions) — NEW ── */}
        <AIPmSection />

        {/* ── SECTION 8: TIMELINE — NEW ── */}
        {/* ── SECTION 11: FAQ — NEW ── */}
        <FaqSection />
      </main>

      <Footer />
      <MobileStickyCta />
    </>
  );
}
