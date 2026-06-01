"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef, type CSSProperties } from "react";
import { GitMerge, FileWarning, Clock, FileSearch, type LucideIcon } from "lucide-react";

type Card = {
  key: string;
  Icon: LucideIcon;
  accent: string;
  category: string;
  severity: string | null;
  title: string;
  body: string;
};

const CARDS: Card[] = [
  {
    key: "merge",
    Icon: GitMerge,
    accent: "#d97757",
    category: "Merge conflicts",
    severity: "High",
    title: "Maya and Devraj both editing auth.ts",
    body: "Two open PRs touch the same files. Merge either first and the other will need to rebase.",
  },
  {
    key: "drift",
    Icon: FileWarning,
    accent: "#7c5cff",
    category: "Spec drift",
    severity: null,
    title: "OAuth shipping despite PRD saying v1 is magic-link only",
    body: "Your PRD and your code stopped agreeing. Reconcile before launch.",
  },
  {
    key: "stalled",
    Icon: Clock,
    accent: "#e0a020",
    category: "Stalled work",
    severity: null,
    title: "PR #43 has had no activity in 7 days",
    body: "Blocked on review from Sarah. Last comment was 7 days ago.",
  },
  {
    key: "coverage",
    Icon: FileSearch,
    accent: "#10a5a0",
    category: "Coverage gap",
    severity: null,
    title: "Driver Assignment spec has no engineering activity",
    body: "Scoped for sprint 4. We're in sprint 5. Nothing's been touched.",
  },
];

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const headVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.02 } },
};

const headItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.12 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: EASE } },
};

const iconVariants: Variants = {
  hidden: { scale: 0, rotate: -25 },
  visible: { scale: 1, rotate: 0, transition: { type: "spring", stiffness: 360, damping: 16 } },
};

export default function AIPmSection() {
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { once: true, margin: "-100px" });

  return (
    <section className="aipm-section">
      <div className="aipm-inner">
        {/* Header */}
        <motion.div
          className="aipm-head"
          variants={headVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <motion.span className="aipm-live" variants={headItem}>
            <span className="aipm-live-dot" />
            Socrates · watching live
          </motion.span>
          <motion.h2 className="aipm-title" variants={headItem}>
            The AI PM you never hired
          </motion.h2>
          <motion.p className="aipm-sub" variants={headItem}>
            Socrates doesn&apos;t just answer questions. It watches your company in motion and
            surfaces what would slip through — before it costs you a sprint.
          </motion.p>
        </motion.div>

        {/* 2×2 grid */}
        <motion.div
          ref={gridRef}
          className="aipm-grid"
          variants={gridVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {CARDS.map((card) => {
            const Icon = card.Icon;
            return (
              <motion.div
                key={card.key}
                className="aipm-card"
                style={{ "--accent": card.accent } as CSSProperties}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
              >
                <span className="aipm-card-glow" aria-hidden="true" />
                <span className="aipm-card-bar" aria-hidden="true" />

                <div className="aipm-card-head">
                  <span className="aipm-cat">
                    <motion.span className="aipm-icon" variants={iconVariants}>
                      <Icon size={16} strokeWidth={2.2} />
                    </motion.span>
                    {card.category}
                  </span>
                  {card.severity && (
                    <span className="aipm-sev">
                      <span className="aipm-sev-dot" />
                      {card.severity}
                    </span>
                  )}
                </div>

                <p className="aipm-card-title">{card.title}</p>
                <p className="aipm-card-body">{card.body}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          className="aipm-footer"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
        >
          <a href="#" className="aipm-cta">
            Explore suggestions <span aria-hidden="true">→</span>
          </a>
          <p className="aipm-note">
            Socrates surfaces 8 categories of risk. Only what needs attention now is shown.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
