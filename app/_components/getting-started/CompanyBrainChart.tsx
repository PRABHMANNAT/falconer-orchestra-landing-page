"use client";

import { memo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Metric = { key: string; label: string; value: number; max: number; help: string };

const METRICS: Metric[] = [
  { key: "people",    label: "People",    value: 26,   max: 50,    help: "Distinct teammates active this week"     },
  { key: "threads",   label: "Threads",   value: 142,  max: 200,   help: "Slack/email threads ingested"            },
  { key: "docs",      label: "Docs",      value: 89,   max: 150,   help: "PRDs, SRSs, and Notion pages indexed"    },
  { key: "tickets",   label: "Tickets",   value: 64,   max: 100,   help: "Linear / GitHub issues linked"           },
  { key: "calls",     label: "Calls",     value: 31,   max: 60,    help: "Granola / Fireflies transcripts"         },
  { key: "decisions", label: "Decisions", value: 47,   max: 80,    help: "Decisions extracted across the brain"    },
];

function CompanyBrainChartImpl() {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <figure
      className="gs-chart"
      role="img"
      aria-label="Company brain metrics: people, threads, docs, tickets, calls, decisions"
    >
      <header className="gs-chart-head">
        <h3 className="gs-chart-title">Company brain</h3>
        <span className="gs-chart-sub">Last 7 days</span>
      </header>

      <div className="gs-chart-bars" role="list">
        {METRICS.map((m, i) => {
          const pct = Math.min(100, Math.round((m.value / m.max) * 100));
          return (
            <div
              key={m.key}
              className="gs-chart-row"
              role="listitem"
              tabIndex={0}
              aria-label={`${m.label}: ${m.value} out of ${m.max}. ${m.help}`}
              onMouseEnter={() => setHovered(m.key)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(m.key)}
              onBlur={() => setHovered(null)}
              style={{ position: "relative" }}
            >
              <span className="gs-chart-row-label">{m.label}</span>
              <div className="gs-chart-track" aria-hidden="true">
                <motion.span
                  className="gs-chart-fill"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={
                    reduce
                      ? { duration: 0.01 }
                      : { duration: 0.9, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }
                  }
                />
              </div>
              <span className="gs-chart-value">{m.value}</span>

              <AnimatePresence>
                {hovered === m.key && (
                  <motion.span
                    key="tip"
                    className="gs-chart-tip"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.18 }}
                    style={{ top: "-30px", left: "100px" }}
                    role="tooltip"
                  >
                    {m.help}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </figure>
  );
}

export default memo(CompanyBrainChartImpl);
