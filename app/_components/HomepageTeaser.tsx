"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import Mark from "./Mark";
import { StripedPattern } from "@/registry/magicui/striped-pattern";
import "./HomepageTeaser.css";

const EASE = [0.22, 1, 0.36, 1] as const;
const CORE = { x: 50, y: 50 };
const HEADLINE = ["Watch", "it", "come", "together."];
const FLOW_DURATION = 5.3;
const SIGNAL_START = 1.05;
const SIGNAL_STAGGER = 0.16;

type SourceNode = {
  id: string;
  label: string;
  logoSrc: string;
  x: number;
  y: number;
};

const NODES: SourceNode[] = [
  { id: "slack", label: "Slack", logoSrc: "/teaser-logos/slack.png", x: 15, y: 23 },
  { id: "gmail", label: "Gmail", logoSrc: "/teaser-logos/gmail.png", x: 81, y: 19 },
  { id: "linear", label: "Linear", logoSrc: "/teaser-logos/linear.png", x: 10, y: 58 },
  { id: "notion", label: "Notion", logoSrc: "/teaser-logos/notion.png", x: 88, y: 50 },
  { id: "github", label: "GitHub", logoSrc: "/teaser-logos/github.png", x: 22, y: 84 },
  { id: "docs", label: "Docs", logoSrc: "/teaser-logos/google-docs.png", x: 70, y: 86 },
  { id: "fireflies", label: "Fireflies", logoSrc: "/teaser-logos/fireflies.png", x: 31, y: 37 },
  { id: "teams", label: "Teams", logoSrc: "/teaser-logos/teams.png", x: 76, y: 68 },
];

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

const sectionVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.06 } },
};

const lineUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

const headlineVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.08 } },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: "110%", rotateX: -26 },
  visible: {
    opacity: 1,
    y: "0%",
    rotateX: 0,
    transition: { duration: 0.72, ease: EASE },
  },
};

const stageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 18 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.85, ease: EASE },
  },
};

const nodeVariants: Variants = {
  hidden: { opacity: 0, x: "-50%", y: "-50%", scale: 0.62 },
  visible: (i: number) => ({
    opacity: 1,
    x: "-50%",
    y: "-50%",
    scale: 1,
    transition: {
      duration: 0.58,
      ease: EASE,
      delay: 0.48 + i * 0.06,
    },
  }),
};

const edgeVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 0.22,
    transition: { duration: 1.05, ease: "easeOut", delay: 0.52 + i * 0.035 },
  }),
};

function signalDelay(index: number) {
  return SIGNAL_START + index * SIGNAL_STAGGER;
}

function byId(id: string): SourceNode {
  const node = NODES.find((item) => item.id === id);
  if (!node) {
    throw new Error(`Unknown teaser node: ${id}`);
  }
  return node;
}

export default function HomepageTeaser() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const stageY = useTransform(scrollYProgress, [0, 0.55, 1], [30, 0, -26]);
  const stageScale = useTransform(scrollYProgress, [0, 0.55, 1], [0.97, 1, 0.985]);

  return (
    <motion.section
      ref={sectionRef}
      className="teaser"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.32 }}
    >
      <StripedPattern className="teaser-stripes [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]" />
      <motion.span
        aria-hidden="true"
        className="teaser-glow"
        animate={
          reduce
            ? { opacity: 0.48 }
            : { opacity: [0.34, 0.68, 0.34], scale: [0.98, 1.04, 0.98] }
        }
        transition={reduce ? undefined : { duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="teaser-inner">
        <motion.p className="teaser-kicker" variants={lineUp}>
          <span className="teaser-kicker-dot" aria-hidden="true" />
          The features page
        </motion.p>

        <motion.h2
          className="teaser-h2"
          variants={headlineVariants}
          aria-label="Watch it come together."
        >
          {HEADLINE.map((word) => (
            <span key={word} className="teaser-word-shell" aria-hidden="true">
              <motion.span className="teaser-word" variants={wordVariants}>
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h2>

        <motion.p className="teaser-sub" variants={lineUp}>
          Eight sources. One brain. See the convergence in motion.
        </motion.p>

        <motion.div
          className="teaser-stage"
          variants={stageVariants}
          style={reduce ? undefined : { y: stageY, scale: stageScale }}
        >
          <span className="teaser-sweep" aria-hidden="true" />
          <span className="teaser-burst teaser-burst-one" aria-hidden="true" />
          <span className="teaser-burst teaser-burst-two" aria-hidden="true" />
          <span className="teaser-burst teaser-burst-three" aria-hidden="true" />

          {!reduce &&
            Array.from({ length: 14 }).map((_, i) => (
              <motion.span
                key={`spark-${i}`}
                aria-hidden="true"
                className="teaser-spark"
                style={{
                  left: `${(i * 67 + 14) % 100}%`,
                  top: `${(i * 113 + 18) % 100}%`,
                }}
                animate={{ opacity: [0.12, 0.58, 0.12], scale: [0.8, 1.2, 0.8] }}
                transition={{
                  duration: 3.4 + (i % 5) * 0.35,
                  delay: i * 0.18,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}

          <svg
            className="teaser-beams"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="teaser-node-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(217,119,87,0.42)" />
                <stop offset="100%" stopColor="rgba(217,119,87,0)" />
              </radialGradient>
            </defs>

            {NODES.map((node, i) => (
              <motion.line
                key={`core-line-${node.id}`}
                className="teaser-core-line"
                style={
                  {
                    "--signal-delay": `${signalDelay(i)}s`,
                    "--flow-duration": `${FLOW_DURATION}s`,
                  } as CSSProperties
                }
                x1={node.x}
                y1={node.y}
                x2={CORE.x}
                y2={CORE.y}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={
                  reduce
                    ? { pathLength: 1, opacity: 0.34 }
                    : { pathLength: 1, opacity: [0.18, 0.7, 0.18] }
                }
                viewport={{ once: true, amount: 0.45 }}
                transition={{
                  pathLength: { duration: 1.05, ease: "easeOut", delay: 0.38 + i * 0.04 },
                  opacity: reduce
                    ? { duration: 0.35, delay: 0.38 + i * 0.04 }
                    : {
                        duration: 3.2,
                        ease: "easeInOut",
                        delay: signalDelay(i),
                        repeat: Infinity,
                        repeatDelay: 2.1,
                      },
                }}
              />
            ))}

            {EDGES.map(([from, to], i) => {
              const a = byId(from);
              const b = byId(to);

              return (
                <motion.line
                  key={`${from}-${to}`}
                  className="teaser-edge"
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  custom={i}
                  variants={edgeVariants}
                />
              );
            })}

            {NODES.map((node) => (
              <circle
                key={`node-halo-${node.id}`}
                cx={node.x}
                cy={node.y}
                r="6"
                fill="url(#teaser-node-glow)"
              />
            ))}
          </svg>

          {!reduce &&
            NODES.map((node, i) => (
              <motion.span
                key={`signal-${node.id}`}
                aria-hidden="true"
                className="teaser-signal"
                initial={{ left: `${node.x}%`, top: `${node.y}%`, opacity: 0, scale: 0.45 }}
                animate={{
                  left: [`${node.x}%`, `${node.x}%`, `${CORE.x}%`, `${CORE.x}%`],
                  top: [`${node.y}%`, `${node.y}%`, `${CORE.y}%`, `${CORE.y}%`],
                  opacity: [0, 1, 1, 0],
                  scale: [0.45, 0.7, 1.05, 0.25],
                }}
                transition={{
                  duration: 3.2,
                  delay: signalDelay(i),
                  repeat: Infinity,
                  repeatDelay: 2.1,
                  ease: "easeInOut",
                  times: [0, 0.14, 0.78, 1],
                }}
              />
            ))}

          {NODES.map((node, i) => {
            return (
              <motion.span
                key={node.id}
                className="teaser-node"
                style={
                  {
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    "--signal-delay": `${signalDelay(i)}s`,
                    "--flow-duration": `${FLOW_DURATION}s`,
                  } as CSSProperties
                }
                variants={nodeVariants}
                custom={i}
                whileHover={{ scale: 1.12 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                data-label={node.label}
                title={node.label}
                role="img"
                aria-label={node.label}
              >
                <span className="teaser-node-ping" aria-hidden="true" />
                <motion.span
                  className="teaser-node-float"
                  animate={
                    reduce
                      ? undefined
                      : { y: [0, -5, 0, 3, 0], rotate: [0, -2, 0, 2, 0] }
                  }
                  transition={
                    reduce
                      ? undefined
                      : {
                          duration: 5.8 + (i % 4) * 0.5,
                          delay: i * 0.22,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }
                  }
                >
                  <Image
                    className="teaser-logo"
                    src={node.logoSrc}
                    alt=""
                    width={40}
                    height={40}
                  />
                </motion.span>
              </motion.span>
            );
          })}

          <motion.div
            className="teaser-core"
            initial={{ opacity: 0, scale: 0.64 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.42 }}
          >
            <motion.span
              className="teaser-core-glow"
              aria-hidden="true"
              animate={reduce ? undefined : { opacity: [0.5, 0.95, 0.5], scale: [1, 1.15, 1] }}
              transition={reduce ? undefined : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.span
              className="teaser-core-ring"
              aria-hidden="true"
              animate={reduce ? undefined : { rotate: 360 }}
              transition={reduce ? undefined : { duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <Mark tone="light" />
          </motion.div>
        </motion.div>

        <motion.div variants={lineUp} className="teaser-cta-row">
          <Link href="/features" className="teaser-cta">
            <span>See it all converge</span>
            <span className="teaser-cta-arrow" aria-hidden="true">
              -&gt;
            </span>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
