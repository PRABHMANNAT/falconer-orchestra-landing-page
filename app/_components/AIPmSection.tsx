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
    title: "Two PRs are rewriting auth.ts at once",
    body: "Maya and Devraj are deep in the same file. Whoever merges second eats a painful rebase — untangle it before they collide.",
  },
  {
    key: "drift",
    Icon: FileWarning,
    accent: "#7c5cff",
    category: "Spec drift",
    severity: null,
    title: "Your code shipped OAuth — the PRD still says magic-link only",
    body: "Spec and reality stopped agreeing days ago. Reconcile now, not in the launch post-mortem.",
  },
  {
    key: "stalled",
    Icon: Clock,
    accent: "#e0a020",
    category: "Stalled work",
    severity: null,
    title: "PR #43 has been waiting on review for 7 days",
    body: "Blocked on Sarah, untouched since last week — and quietly holding up the release.",
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
            It reads every commit, doc, and thread your team produces — then surfaces the
            one thing about to derail your sprint, before it does. No prompting required.
          </motion.p>
        </motion.div>

        {/* 2×2 grid — striped-frame panels (dark + light themed) */}
        <motion.div
          ref={gridRef}
          variants={gridVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-1 rounded-3xl p-1 antialiased ring-1 shadow-sm ring-black/10 shadow-black/5 md:grid-cols-2 dark:ring-white/10 dark:shadow-white/5"
        >
          {CARDS.map((card) => {
            const Icon = card.Icon;
            return (
              <motion.div
                key={card.key}
                style={{ "--accent": card.accent } as CSSProperties}
                variants={cardVariants}
                className="group relative z-0 rounded-[22px] hover:z-20 [--pattern-fg:color-mix(in_oklab,#0a0a0a_5%,transparent)] dark:[--pattern-fg:color-mix(in_oklab,#fff_5%,transparent)]"
              >
                {/* decorative diagonal-stripe frame */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full rounded-[inherit] bg-[image:repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)] bg-[size:5px_5px] bg-fixed shadow-sm ring-1 ring-black/5 shadow-black/5 transition duration-300 group-hover:ring-black/15 dark:ring-white/5 dark:shadow-white/5 dark:group-hover:ring-white/20"
                />

                {/* content panel — pops out on hover, revealing the stripes */}
                <div className="relative origin-center rounded-[22px] bg-white p-4 ring-1 shadow-sm ring-black/10 shadow-black/5 transition-[transform,box-shadow] duration-300 ease-out will-change-transform group-hover:-translate-y-1 group-hover:-rotate-2 group-hover:scale-[1.05] group-hover:shadow-2xl group-hover:shadow-black/25 md:p-8 dark:bg-neutral-900 dark:ring-white/10 dark:shadow-white/5 dark:group-hover:shadow-black/60">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 font-mono text-[11px] font-medium tracking-[0.14em] uppercase" style={{ color: "var(--accent)" }}>
                      <motion.span
                        variants={iconVariants}
                        className="inline-grid size-7 place-items-center rounded-lg"
                        style={{ background: "color-mix(in srgb, var(--accent) 14%, transparent)" }}
                      >
                        <Icon size={15} strokeWidth={2.2} />
                      </motion.span>
                      {card.category}
                    </span>
                    {card.severity && (
                      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase text-neutral-500 dark:text-gray-400" style={{ background: "color-mix(in srgb, var(--accent) 12%, transparent)" }}>
                        <span className="size-1.5 rounded-full" style={{ background: "var(--accent)" }} />
                        {card.severity}
                      </span>
                    )}
                  </div>

                  <p className="text-base leading-6 font-medium text-neutral-900 dark:text-neutral-100">
                    {card.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-gray-400">
                    {card.body}
                  </p>
                </div>
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
