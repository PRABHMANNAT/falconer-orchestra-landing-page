"use client";

import { memo } from "react";
import { motion, type Variants } from "framer-motion";
import { GitMerge, FileWarning, Clock, FileSearch, type LucideIcon } from "lucide-react";

type Severity = "low" | "med" | "high";

type Suggestion = {
  id: string;
  category: string;
  Icon: LucideIcon;
  accent: string;
  severity: Severity;
  title: string;
  description: string;
};

const SUGGESTIONS: Suggestion[] = [
  {
    id: "merge",
    category: "Merge conflicts",
    Icon: GitMerge,
    accent: "#d97757",
    severity: "high",
    title: "Maya and Devraj both editing auth.ts",
    description: "Two open PRs touch the same files. Merge either first and the other will need to rebase.",
  },
  {
    id: "drift",
    category: "Spec drift",
    Icon: FileWarning,
    accent: "#7c5cff",
    severity: "med",
    title: "OAuth shipping despite PRD saying v1 is magic-link only",
    description: "Your PRD and your code stopped agreeing. Reconcile before launch.",
  },
  {
    id: "stalled",
    category: "Stalled work",
    Icon: Clock,
    accent: "#e0a020",
    severity: "med",
    title: "PR #43 has had no activity in 7 days",
    description: "Blocked on review from Sarah. Last comment 7 days ago.",
  },
  {
    id: "coverage",
    category: "Coverage gap",
    Icon: FileSearch,
    accent: "#10a5a0",
    severity: "low",
    title: "Driver Assignment spec has no engineering activity",
    description: "Scoped for sprint 4. We're in sprint 5. Nothing has been touched.",
  },
];

const grid: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.06 } },
};

const card: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  visible: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const SEVERITY_LABEL: Record<Severity, string> = { low: "Low", med: "Medium", high: "High" };

function AiPmSuggestionsImpl() {
  return (
    <div
      role="tabpanel"
      id="gs-panel-ask"
      aria-labelledby="gs-tab-ask"
    >
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <span className="gs-stage-pill">
          <span className="gs-stage-pill-dot" aria-hidden="true" />
          Socrates · watching live
        </span>
        <span className="gs-convo-status">{SUGGESTIONS.length} suggestions</span>
      </header>

      <motion.ul
        className="gs-suggestions"
        variants={grid}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        aria-label="Risk suggestions"
        style={{ listStyle: "none", padding: 0, margin: "0 0 4px" }}
      >
        {SUGGESTIONS.map((s) => {
          const Icon = s.Icon;
          return (
            <motion.li
              key={s.id}
              className="gs-card"
              variants={card}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              style={{ ["--accent" as string]: s.accent }}
            >
              <span className="gs-card-bar" aria-hidden="true" />
              <div className="gs-card-head">
                <span className="gs-card-cat">
                  <span className="gs-card-icon" aria-hidden="true">
                    <Icon size={14} strokeWidth={2.4} />
                  </span>
                  {s.category}
                </span>
                <span
                  className={`gs-card-sev ${s.severity}`}
                  aria-label={`Severity: ${SEVERITY_LABEL[s.severity]}`}
                >
                  {SEVERITY_LABEL[s.severity]}
                </span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
              <a
                className="gs-card-cta"
                href={`#suggestion/${s.id}`}
                aria-label={`View details for ${s.title}`}
              >
                View details →
              </a>
            </motion.li>
          );
        })}
      </motion.ul>

      <p className="gs-suggest-foot">
        <a href="#suggestions" className="gs-link">
          Explore suggestions →
        </a>
      </p>
    </div>
  );
}

export default memo(AiPmSuggestionsImpl);
