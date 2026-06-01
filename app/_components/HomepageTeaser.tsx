"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import Mark from "./Mark";
import {
  SlackLogo,
  GmailLogo,
  LinearLogo,
  NotionLogo,
  GitHubLogo,
  GoogleDocsLogo,
  FirefliesLogo,
  TeamsLogo,
} from "./IntegrationLogos";
import "./HomepageTeaser.css";

const EASE = [0.22, 1, 0.36, 1] as const;

type Node = {
  id: string;
  label: string;
  Logo: (p: { className?: string }) => React.ReactNode;
  /** percent within the stage */
  x: number;
  y: number;
  /** parallax depth (0 = static, 1 = strong) */
  depth: number;
};

// Hand-placed positions for a balanced constellation feel
const NODES: Node[] = [
  { id: "slack",     label: "Slack",     Logo: SlackLogo,      x: 16, y: 22, depth: 0.8 },
  { id: "gmail",     label: "Gmail",     Logo: GmailLogo,      x: 82, y: 18, depth: 0.7 },
  { id: "linear",    label: "Linear",    Logo: LinearLogo,     x: 8,  y: 58, depth: 0.9 },
  { id: "notion",    label: "Notion",    Logo: NotionLogo,     x: 88, y: 48, depth: 1.0 },
  { id: "github",    label: "GitHub",    Logo: GitHubLogo,     x: 22, y: 86, depth: 0.6 },
  { id: "docs",      label: "Docs",      Logo: GoogleDocsLogo, x: 70, y: 88, depth: 0.85 },
  { id: "fireflies", label: "Fireflies", Logo: FirefliesLogo,  x: 30, y: 36, depth: 0.5 },
  { id: "teams",     label: "Teams",     Logo: TeamsLogo,      x: 76, y: 68, depth: 0.75 },
];

// Network edges — every node connects to the core (~50,50) implicitly via the
// core. These are inter-node connections that give the constellation feel.
const EDGES: [string, string][] = [
  ["slack", "fireflies"],
  ["fireflies", "gmail"],
  ["gmail", "notion"],
  ["notion", "teams"],
  ["teams", "docs"],
  ["docs", "github"],
  ["github", "linear"],
  ["linear", "slack"],
  ["fireflies", "notion"],
  ["github", "teams"],
];

// Paths that pulses travel along (chained edges into the core).
const PULSE_PATHS: { from: string; via?: string }[] = [
  { from: "slack",     via: "fireflies" },
  { from: "gmail",     via: "fireflies" },
  { from: "linear" },
  { from: "notion",    via: "teams" },
  { from: "github" },
  { from: "docs",      via: "teams" },
  { from: "teams" },
  { from: "fireflies" },
];

const sectionVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.08 } },
};

const lineUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const word: Variants = {
  hidden: { opacity: 0, y: "100%" },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const stageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.9, ease: EASE } },
};

const nodeIn: Variants = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: EASE, delay: 0.5 + i * 0.07 },
  }),
};

const edgeIn: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 0.32,
    transition: { duration: 1.1, ease: "easeOut", delay: 0.55 + i * 0.04 },
  }),
};

const coreEdgeIn: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 0.45,
    transition: { duration: 1.1, ease: "easeOut", delay: 0.4 + i * 0.05 },
  }),
};

const HEADLINE = ["Watch", "it", "come", "together."];
const CORE = { x: 50, y: 50 };

function byId(id: string): Node {
  const n = NODES.find((x) => x.id === id);
  if (!n) throw new Error("unknown node " + id);
  return n;
}

export default function HomepageTeaser() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-driven parallax: as the section enters/exits, shift nodes by depth.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Per-logo y-offset multiplier, ranges -20 → 20
  const parallax = useTransform(scrollYProgress, [0, 1], [-26, 26]);

  return (
    <motion.section
      ref={sectionRef}
      className="teaser"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.span
        aria-hidden="true"
        className="teaser-glow"
        animate={
          reduce
            ? { opacity: 0.55 }
            : { opacity: [0.45, 0.78, 0.45], scale: [1, 1.05, 1] }
        }
        transition={reduce ? undefined : { duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="teaser-inner">
        <motion.p className="teaser-kicker" variants={lineUp}>
          <span className="teaser-kicker-dot" aria-hidden="true" />
          The features page
        </motion.p>

        <motion.h2 className="teaser-h2" variants={lineUp}>
          {HEADLINE.map((w, i) => (
            <span key={i} className="teaser-word">
              <motion.span variants={word}>{w}</motion.span>
              {i < HEADLINE.length - 1 && " "}
            </span>
          ))}
        </motion.h2>

        <motion.p className="teaser-sub" variants={lineUp}>
          Eight sources. One brain. See the convergence in motion.
        </motion.p>

        {/* Constellation stage */}
        <motion.div className="teaser-stage" variants={stageVariants}>
          {/* Subtle drifting starfield dots */}
          {!reduce &&
            Array.from({ length: 16 }).map((_, i) => {
              const seedX = (i * 73) % 100;
              const seedY = (i * 137) % 100;
              return (
                <motion.span
                  key={`star-${i}`}
                  aria-hidden="true"
                  className="teaser-star"
                  style={{ left: `${seedX}%`, top: `${seedY}%` }}
                  animate={{
                    opacity: [0.2, 0.7, 0.2],
                    scale: [0.8, 1.1, 0.8],
                  }}
                  transition={{
                    duration: 3 + (i % 5) * 0.4,
                    repeat: Infinity,
                    delay: (i % 7) * 0.3,
                    ease: "easeInOut",
                  }}
                />
              );
            })}

          {/* Network beams */}
          <svg
            className="teaser-beams"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="teaser-core-beam" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="100">
                <stop offset="0%"   stopColor="rgba(217,119,87,0)" />
                <stop offset="55%"  stopColor="rgba(217,119,87,0.55)" />
                <stop offset="100%" stopColor="#b85c3e" />
              </linearGradient>
              <radialGradient id="teaser-node-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor="rgba(217,119,87,0.45)" />
                <stop offset="100%" stopColor="rgba(217,119,87,0)" />
              </radialGradient>
            </defs>

            {/* Core ↔ node beams */}
            {NODES.map((n, i) => (
              <motion.line
                key={`core-${n.id}`}
                x1={n.x}
                y1={n.y}
                x2={CORE.x}
                y2={CORE.y}
                stroke="url(#teaser-core-beam)"
                strokeWidth={0.6}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                custom={i}
                variants={coreEdgeIn}
              />
            ))}

            {/* Inter-node edges (constellation lines) */}
            {EDGES.map(([a, b], i) => {
              const A = byId(a);
              const B = byId(b);
              return (
                <motion.line
                  key={`e-${a}-${b}`}
                  x1={A.x}
                  y1={A.y}
                  x2={B.x}
                  y2={B.y}
                  stroke="currentColor"
                  strokeOpacity={0.22}
                  strokeWidth={0.45}
                  strokeDasharray="0.6 1.3"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  custom={i}
                  variants={edgeIn}
                  className="teaser-edge"
                />
              );
            })}

            {/* Soft halos behind each node */}
            {NODES.map((n) => (
              <circle
                key={`halo-${n.id}`}
                cx={n.x}
                cy={n.y}
                r={6}
                fill="url(#teaser-node-glow)"
              />
            ))}
          </svg>

          {/* Pulses flowing toward the core */}
          {!reduce &&
            PULSE_PATHS.map((p, i) => {
              const from = byId(p.from);
              const mid = p.via ? byId(p.via) : null;
              const keyframesX = mid
                ? [`${from.x}%`, `${mid.x}%`, `${CORE.x}%`]
                : [`${from.x}%`, `${CORE.x}%`];
              const keyframesY = mid
                ? [`${from.y}%`, `${mid.y}%`, `${CORE.y}%`]
                : [`${from.y}%`, `${CORE.y}%`];
              return (
                <motion.span
                  key={`pulse-${i}`}
                  aria-hidden="true"
                  className="teaser-pulse"
                  initial={{ opacity: 0 }}
                  animate={{
                    left: keyframesX,
                    top: keyframesY,
                    opacity: [0, 1, 1, 0],
                    scale: [0.4, 1, 0.9, 0.5],
                  }}
                  transition={{
                    duration: 2.8,
                    delay: 1.1 + i * 0.22,
                    repeat: Infinity,
                    repeatDelay: 0.4,
                    ease: "easeIn",
                    times: [0, 0.15, 0.85, 1],
                  }}
                />
              );
            })}

          {/* Source nodes */}
          {NODES.map((n, i) => {
            const Logo = n.Logo;
            const floatY = parallax;
            return (
              <motion.span
                key={n.id}
                className="teaser-node"
                style={{
                  left: `${n.x}%`,
                  top: `${n.y}%`,
                  y: reduce ? 0 : floatY,
                }}
                variants={nodeIn}
                custom={i}
                whileHover={{ scale: 1.16 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                title={n.label}
              >
                {!reduce && (
                  <motion.span
                    aria-hidden="true"
                    className="teaser-node-float"
                    animate={{ y: [0, -6, 0, 4, 0] }}
                    transition={{
                      duration: 6 + (i % 4) * 0.7,
                      delay: i * 0.25,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Logo />
                  </motion.span>
                )}
                {reduce && <Logo />}
              </motion.span>
            );
          })}

          {/* Core mark */}
          <motion.div
            className="teaser-core"
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.45 }}
          >
            <motion.span
              className="teaser-core-glow"
              aria-hidden="true"
              animate={
                reduce ? undefined : { opacity: [0.55, 1, 0.55], scale: [1, 1.18, 1] }
              }
              transition={
                reduce ? undefined : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
              }
            />
            <motion.span
              className="teaser-core-ring"
              aria-hidden="true"
              animate={reduce ? undefined : { rotate: 360 }}
              transition={
                reduce ? undefined : { duration: 22, repeat: Infinity, ease: "linear" }
              }
            />
            <Mark tone="light" />
          </motion.div>
        </motion.div>

        <motion.div variants={lineUp} className="teaser-cta-row">
          <Link href="/features" className="teaser-cta">
            <span>See it all converge</span>
            <span className="teaser-cta-arrow" aria-hidden="true">→</span>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
