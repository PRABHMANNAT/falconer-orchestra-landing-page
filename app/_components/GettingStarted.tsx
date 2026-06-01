"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Mark from "./Mark";
import {
  SlackLogo,
  TeamsLogo,
  GranolaLogo,
  FirefliesLogo,
  GoogleDocsLogo,
  NotionLogo,
  GitHubLogo,
  VSCodeLogo
} from "./IntegrationLogos";

const softEase = [0.22, 1, 0.36, 1] as const;

const fadeVar = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
};

type Tool = {
  id: string;
  name: string;
  category: string;
  Logo: (p: React.SVGProps<SVGSVGElement>) => React.ReactElement;
  detail: string;
};

// Ordered so adjacent orbit slots alternate categories — the ring reads as a
// mix of every surface, not clustered blocks.
const TOOLS: Tool[] = [
  { id: "slack",     name: "Slack",       category: "Comms",       Logo: SlackLogo,      detail: "Channels & threads, summarised" },
  { id: "granola",   name: "Granola",     category: "Transcripts", Logo: GranolaLogo,    detail: "Calls recapped in seconds" },
  { id: "gdocs",     name: "Google Docs", category: "Docs",        Logo: GoogleDocsLogo, detail: "Docs linked to the brain" },
  { id: "github",    name: "GitHub",      category: "Code",        Logo: GitHubLogo,     detail: "PRs become changelog context" },
  { id: "teams",     name: "Teams",       category: "Comms",       Logo: TeamsLogo,      detail: "Every channel ingested" },
  { id: "fireflies", name: "Fireflies",   category: "Transcripts", Logo: FirefliesLogo,  detail: "Decisions logged from transcripts" },
  { id: "notion",    name: "Notion",      category: "Docs",        Logo: NotionLogo,     detail: "Runbooks cited in replies" },
  { id: "vscode",    name: "VS Code",     category: "Code",        Logo: VSCodeLogo,     detail: "Workspace edits kept in sync" }
];

// Deterministic orbit geometry in a 0–100 square coordinate space; center is
// (50, 50). Used for both the logo nodes (CSS %) and the SVG connector beams.
const RADIUS = 39;
const POINTS = TOOLS.map((_, i) => {
  const a = (i / TOOLS.length) * Math.PI * 2 - Math.PI / 2;
  return { x: 50 + RADIUS * Math.cos(a), y: 50 + RADIUS * Math.sin(a) };
});

const STEPS = ["Connect", "Structure", "Ask"];

export default function GettingStarted() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  // Auto-advance the spotlight; pauses while a node is hovered or focused, and
  // stays put entirely when the user prefers reduced motion.
  useEffect(() => {
    if (paused || reduceMotion) return;
    const id = setInterval(() => setActive((a) => (a + 1) % TOOLS.length), 2200);
    return () => clearInterval(id);
  }, [paused, reduceMotion]);

  const tool = TOOLS[active];

  return (
    <section className="getstarted">
      <motion.div
        className="getstarted-copy"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } }}
      >
        <motion.p className="kicker blue" variants={fadeVar} transition={{ duration: 0.5, ease: softEase }}>
          Getting Started
        </motion.p>
        <motion.h2 variants={fadeVar} transition={{ duration: 0.7, ease: softEase }}>
          Plug in the tools you already live in
        </motion.h2>
        <motion.p variants={fadeVar} transition={{ duration: 0.6, ease: softEase }}>
          Connect Slack, Granola, Google Docs, GitHub and more. Orchestra ingests every signal,
          structures it into one account brain, and keeps each deployment in sync — with zero busywork.
        </motion.p>

        <motion.div className="getstarted-steps" variants={fadeVar} transition={{ duration: 0.6, ease: softEase }}>
          {STEPS.map((s, i) => (
            <span className="getstarted-step" key={s}>
              <span className="getstarted-step-num">{i + 1}</span>
              {s}
            </span>
          ))}
        </motion.div>

        <motion.a href="#" className="getstarted-link" variants={fadeVar} transition={{ duration: 0.5, ease: softEase }}>
          See all integrations {"->"}
        </motion.a>
      </motion.div>

      <motion.div
        className="getstarted-stage"
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: softEase }}
        onMouseLeave={() => setPaused(false)}
      >
        <span className="getstarted-stage-pill">
          <span className="getstarted-stage-dot" aria-hidden="true" />
          {TOOLS.length} live integrations
        </span>

        <div className="getstarted-orbit">
          <svg className="getstarted-beams" viewBox="0 0 100 100" aria-hidden="true">
            {POINTS.map((p, i) => (
              <line
                key={i}
                x1={p.x}
                y1={p.y}
                x2={50}
                y2={50}
                className={`getstarted-wire${i === active ? " is-active" : ""}`}
                vectorEffect="non-scaling-stroke"
              />
            ))}
            <motion.line
              key={active}
              x1={POINTS[active].x}
              y1={POINTS[active].y}
              x2={50}
              y2={50}
              className="getstarted-flow"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: softEase }}
            />
            {/* Data packet travelling from the active tool into the brain. */}
            {!reduceMotion && (
              <motion.circle
                key={`packet-${active}`}
                className="getstarted-packet"
                r={1.7}
                initial={{ cx: POINTS[active].x, cy: POINTS[active].y, opacity: 0 }}
                animate={{
                  cx: [POINTS[active].x, 50],
                  cy: [POINTS[active].y, 50],
                  opacity: [0, 1, 1, 0]
                }}
                transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.15, delay: 0.4 }}
              />
            )}
          </svg>

          <span className="getstarted-ring" aria-hidden="true" />

          {/* Concentric pulses radiating from the brain core. */}
          {!reduceMotion && (
            <span className="getstarted-pulse-wrap" aria-hidden="true">
              {[0, 1].map((i) => (
                <motion.span
                  key={i}
                  className="getstarted-pulse"
                  animate={{ scale: [0.5, 1.7], opacity: [0.4, 0] }}
                  transition={{ duration: 3.4, repeat: Infinity, ease: "easeOut", delay: i * 1.7 }}
                />
              ))}
            </span>
          )}

          {TOOLS.map((t, i) => (
            <button
              key={t.id}
              type="button"
              className={`getstarted-node${i === active ? " is-active" : ""}`}
              style={{ left: `${POINTS[i].x}%`, top: `${POINTS[i].y}%` }}
              onMouseEnter={() => { setActive(i); setPaused(true); }}
              onFocus={() => { setActive(i); setPaused(true); }}
              onBlur={() => setPaused(false)}
              aria-label={`${t.name} — ${t.detail}`}
            >
              <t.Logo />
            </button>
          ))}

          <div className="getstarted-core">
            <span className="getstarted-core-glow" aria-hidden="true" />
            <Mark tone="light" />
          </div>
        </div>

        <div className="getstarted-caption">
          <AnimatePresence mode="wait">
            <motion.div
              key={tool.id}
              className="getstarted-caption-inner"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.32, ease: softEase }}
            >
              <span className="getstarted-caption-logo"><tool.Logo /></span>
              <span className="getstarted-caption-text">
                <strong>{tool.name}</strong>
                <small>{tool.detail}</small>
              </span>
              <span className="getstarted-caption-cat">{tool.category}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
