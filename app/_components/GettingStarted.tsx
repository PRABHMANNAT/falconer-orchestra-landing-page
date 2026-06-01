"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
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
  src: string;
  Logo: (p: React.SVGProps<SVGSVGElement>) => React.ReactElement;
  detail: string;
};

// Real brand logos: Icons8 PNGs for most, logo.dev for tools that aren't in
// the Icons8 bundle (Granola, Notion). ToolLogo falls back to the bundled SVG
// brand mark if either image source fails.
const LOGO_TOKEN = "pk_bAr4xp1ZTdSLLLK4n3m09A";
const logoDev = (domain: string) =>
  `https://img.logo.dev/${domain}?token=${LOGO_TOKEN}&size=128&retina=true&format=png`;

// Ordered so adjacent orbit slots alternate categories — the ring reads as a
// mix of every surface, not clustered blocks.
const TOOLS: Tool[] = [
  { id: "slack",     name: "Slack",       category: "Comms",       src: "/integrations/slack.png",       Logo: SlackLogo,      detail: "Channels & threads, summarised" },
  { id: "granola",   name: "Granola",     category: "Transcripts", src: logoDev("granola.ai"),           Logo: GranolaLogo,    detail: "Calls recapped in seconds" },
  { id: "gdocs",     name: "Google Docs", category: "Docs",        src: "/integrations/google-docs.png", Logo: GoogleDocsLogo, detail: "Docs linked to the brain" },
  { id: "github",    name: "GitHub",      category: "Code",        src: "/integrations/github.png",      Logo: GitHubLogo,     detail: "PRs become changelog context" },
  { id: "teams",     name: "Teams",       category: "Comms",       src: "/integrations/teams.png",       Logo: TeamsLogo,      detail: "Every channel ingested" },
  { id: "fireflies", name: "Fireflies",   category: "Transcripts", src: "/integrations/fireflies.png",   Logo: FirefliesLogo,  detail: "Decisions logged from transcripts" },
  { id: "notion",    name: "Notion",      category: "Docs",        src: logoDev("notion.so"),            Logo: NotionLogo,     detail: "Runbooks cited in replies" },
  { id: "vscode",    name: "VS Code",     category: "Code",        src: "/integrations/vscode.png",      Logo: VSCodeLogo,     detail: "Workspace edits kept in sync" }
];

function ToolLogo({ tool }: { tool: Tool }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    const Fallback = tool.Logo;
    return <Fallback />;
  }
  return (
    <img
      className="getstarted-logo-img"
      src={tool.src}
      alt={`${tool.name} logo`}
      loading="lazy"
      draggable={false}
      onError={() => setFailed(true)}
    />
  );
}

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
  const [prev, setPrev] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  // Auto-advance the spotlight; pauses while a node is hovered or focused, and
  // stays put entirely when the user prefers reduced motion.
  useEffect(() => {
    if (paused || reduceMotion) return;
    const id = setInterval(() => {
      setActive((a) => {
        setPrev(a);
        return (a + 1) % TOOLS.length;
      });
    }, 2200);
    return () => clearInterval(id);
  }, [paused, reduceMotion]);

  // When the active changes via hover/focus, also remember the previous one so
  // the caption can slide in from the right direction.
  const setActiveTracked = (next: number) => {
    setActive((cur) => {
      setPrev(cur);
      return next;
    });
  };

  // Subtle mouse-parallax tilt for the whole orbit stage.
  const orbitRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-1, 1], [4, -4]), { stiffness: 90, damping: 18 });
  const ry = useSpring(useTransform(mx, [-1, 1], [-6, 6]), { stiffness: 90, damping: 18 });

  const handleOrbitMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const el = orbitRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const resetOrbit = () => {
    mx.set(0);
    my.set(0);
  };

  const tool = TOOLS[active];
  // Direction the caption slides from (based on going forward/back around the ring).
  const captionDir = active >= prev ? 1 : -1;

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

        <motion.div
          className="getstarted-steps"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.18, delayChildren: 0.15 } },
          }}
        >
          {STEPS.map((s, i) => (
            <motion.span
              className="getstarted-step"
              key={s}
              variants={{
                hidden: { opacity: 0, y: 10, scale: 0.9 },
                visible: {
                  opacity: 1, y: 0, scale: 1,
                  transition: { type: "spring", stiffness: 360, damping: 22 },
                },
              }}
              whileHover={{ y: -2 }}
            >
              <motion.span
                className="getstarted-step-num"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 420, damping: 18, delay: 0.25 + i * 0.18 }}
              >
                {i + 1}
              </motion.span>
              {s}
            </motion.span>
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

        <motion.div
          className="getstarted-orbit"
          ref={orbitRef}
          onMouseMove={handleOrbitMove}
          onMouseLeave={resetOrbit}
          style={
            reduceMotion
              ? undefined
              : { perspective: 900, rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" as const }
          }
        >
          <svg className="getstarted-beams" viewBox="0 0 100 100" aria-hidden="true">
            <defs>
              <linearGradient id="gs-flow-grad" gradientUnits="userSpaceOnUse"
                x1={POINTS[active].x} y1={POINTS[active].y} x2={50} y2={50}>
                <stop offset="0%" stopColor="rgba(217,119,87,0.0)" />
                <stop offset="40%" stopColor="rgba(217,119,87,0.9)" />
                <stop offset="100%" stopColor="#b85c3e" />
              </linearGradient>
              <filter id="gs-flow-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="0.6" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

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
              stroke="url(#gs-flow-grad)"
              filter="url(#gs-flow-glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.55, ease: softEase }}
            />
            {/* Data packets streaming from the active tool into the brain. */}
            {!reduceMotion &&
              [0, 0.55].map((delay, idx) => (
                <motion.circle
                  key={`packet-${active}-${idx}`}
                  className="getstarted-packet"
                  r={1.7}
                  initial={{ cx: POINTS[active].x, cy: POINTS[active].y, opacity: 0 }}
                  animate={{
                    cx: [POINTS[active].x, 50],
                    cy: [POINTS[active].y, 50],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 0.15,
                    delay: 0.4 + delay,
                  }}
                />
              ))}
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
            <motion.span
              key={t.id}
              className="getstarted-node-slot"
              style={{ left: `${POINTS[i].x}%`, top: `${POINTS[i].y}%` }}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.2 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.25 + i * 0.07 }}
            >
              <motion.span
                className="getstarted-node-float"
                animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
                transition={
                  reduceMotion
                    ? undefined
                    : { duration: 4 + (i % 3), repeat: Infinity, ease: "easeInOut", delay: i * 0.25 }
                }
              >
                <motion.button
                  type="button"
                  className={`getstarted-node${i === active ? " is-active" : ""}`}
                  onMouseEnter={() => { setActiveTracked(i); setPaused(true); }}
                  onFocus={() => { setActiveTracked(i); setPaused(true); }}
                  onBlur={() => setPaused(false)}
                  aria-label={`${t.name} — ${t.detail}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.94 }}
                  animate={{ scale: i === active ? 1.14 : 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <ToolLogo tool={t} />
                </motion.button>
              </motion.span>
            </motion.span>
          ))}

          {/* Active-node halo: a soft ring that scales/fades around the lit node */}
          {!reduceMotion && (
            <motion.span
              key={`halo-${active}`}
              className="getstarted-active-halo"
              aria-hidden="true"
              style={{ left: `${POINTS[active].x}%`, top: `${POINTS[active].y}%` }}
              initial={{ opacity: 0.55, scale: 0.6 }}
              animate={{ opacity: 0, scale: 1.9 }}
              transition={{ duration: 1.2, ease: "easeOut", repeat: Infinity }}
            />
          )}

          <motion.div
            className="getstarted-core"
            animate={
              reduceMotion
                ? undefined
                : { rotate: [0, 360], scale: [1, 1.04, 1] }
            }
            transition={
              reduceMotion
                ? undefined
                : {
                    rotate: { duration: 28, repeat: Infinity, ease: "linear" },
                    scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  }
            }
          >
            <span className="getstarted-core-glow" aria-hidden="true" />
            <motion.div
              animate={reduceMotion ? undefined : { rotate: [0, -360] }}
              transition={reduceMotion ? undefined : { duration: 28, repeat: Infinity, ease: "linear" }}
              style={{ display: "grid", placeItems: "center", width: "50%", height: "50%" }}
            >
              <Mark tone="light" />
            </motion.div>
            {/* Faint shimmer sweeping across the core */}
            {!reduceMotion && (
              <motion.span
                aria-hidden="true"
                className="getstarted-core-shimmer"
                animate={{ x: ["-130%", "130%"] }}
                transition={{ duration: 5.5, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
              />
            )}
          </motion.div>
        </motion.div>

        <div className="getstarted-caption">
          <AnimatePresence mode="wait">
            <motion.div
              key={tool.id}
              className="getstarted-caption-inner"
              initial={{ opacity: 0, x: 18 * captionDir, filter: "blur(6px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -18 * captionDir, filter: "blur(6px)" }}
              transition={{ duration: 0.4, ease: softEase }}
            >
              <motion.span
                className="getstarted-caption-logo"
                initial={{ scale: 0.6, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 360, damping: 18 }}
              >
                <ToolLogo tool={tool} />
              </motion.span>
              <span className="getstarted-caption-text">
                <strong>{tool.name}</strong>
                <small>{tool.detail}</small>
              </span>
              <motion.span
                className="getstarted-caption-cat"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: 0.12, ease: softEase }}
              >
                {tool.category}
              </motion.span>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
