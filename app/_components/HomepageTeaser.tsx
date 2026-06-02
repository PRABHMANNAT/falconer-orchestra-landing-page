"use client";

import Link from "next/link";
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
const HEADLINE = ["Watch", "it", "come", "together."];

// Six evenly-spaced rays around the core. Sources flow inward along each one.
const RAYS = [-90, -30, 30, 90, 150, 210];

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
          Every source flows into one. See the convergence in motion.
        </motion.p>

        {/* Minimal convergence: dots stream inward along soft rays into the core. */}
        <motion.div
          className="teaser-stage"
          variants={stageVariants}
          style={reduce ? undefined : { y: stageY, scale: stageScale }}
        >
          <div className="teaser-min" aria-hidden="true">
            {RAYS.map((a) => (
              <span
                key={`ray-${a}`}
                className="teaser-ray"
                style={{ "--a": `${a}deg` } as CSSProperties}
              />
            ))}

            {!reduce &&
              RAYS.map((a, i) => (
                <span
                  key={`pulse-${a}`}
                  className="teaser-pulse"
                  style={{ "--a": `${a}deg`, "--d": `${i * 0.5}s` } as CSSProperties}
                />
              ))}

            <div className="teaser-min-core">
              <span className="teaser-min-ring" aria-hidden="true" />
              <Mark tone="light" />
            </div>
          </div>
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
