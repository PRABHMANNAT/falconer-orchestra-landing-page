"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { MessageSquare, GitMerge, FileText, type LucideIcon } from "lucide-react";

type TimelineEvent = {
  source: string;
  icon: LucideIcon;
  sourceBg: string;
  sourceColor: string;
  title: string;
  description: string;
  who: string;
};

const EVENTS: TimelineEvent[] = [
  {
    source: "Slack",
    icon: MessageSquare,
    sourceBg: "#ede9fe",
    sourceColor: "#6d28d9",
    title: "Scoping call recap posted",
    description: "Maya shared the decision: magic-link auth for v1, OAuth deferred.",
    who: "Maya R.",
  },
  {
    source: "GitHub",
    icon: GitMerge,
    sourceBg: "#fff7ed",
    sourceColor: "#c2410c",
    title: "PR #47 merged by Devraj",
    description: "auth.ts refactored — removes the old session middleware.",
    who: "Devraj K.",
  },
  {
    source: "Manual",
    icon: FileText,
    sourceBg: "#f0fdfa",
    sourceColor: "#0f766e",
    title: "PRD updated — auth scope confirmed",
    description: "Spec now matches implementation. Added a SCIM provisioning note.",
    who: "Sana A.",
  },
  {
    source: "Slack",
    icon: MessageSquare,
    sourceBg: "#ede9fe",
    sourceColor: "#6d28d9",
    title: "Northwind asked about SSO timeline",
    description: "Promised SAML by end of Q2 — logged straight to the account brain.",
    who: "Maya R.",
  },
];

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const STEP = 0.16; // per-event cascade delay

const introVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.02 } },
};

const introItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

export default function TimelineSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const inView = useInView(trackRef, { once: true, margin: "-100px" });

  return (
    <section className="timeline-section">
      <div className="timeline-grid">
        {/* LEFT — copy */}
        <motion.div
          className="timeline-intro"
          variants={introVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <motion.p className="timeline-eyebrow" variants={introItem}>
            Timeline
          </motion.p>
          <motion.h2 className="timeline-title" variants={introItem}>
            One timeline.
            <br />
            <span className="accent-word">Zero lost decisions.</span>
          </motion.h2>
          <motion.p className="timeline-sub" variants={introItem}>
            Every change traces back to who, what source, and when. Slack threads, commits,
            scoping calls — all on one immutable thread.
          </motion.p>
          <motion.div className="timeline-chips" variants={introItem}>
            {["Audit-ready", "Sliceable by Socrates", "Admin-approved"].map((c) => (
              <span key={c} className="timeline-chip">
                {c}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* RIGHT — self-drawing timeline */}
        <div className="timeline-card">
          <div className="timeline-track" ref={trackRef}>
            {/* faint full-height rail */}
            <div className="timeline-spine" aria-hidden="true" />
            {/* animated beam that draws downward on enter */}
            <motion.div
              className="timeline-beam"
              aria-hidden="true"
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
            />

            <div className="timeline-events">
              {EVENTS.map((event, i) => {
                const Icon = event.icon;
                return (
                  <div className="timeline-row" key={i}>
                    <motion.span
                      className="timeline-node"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 18,
                        delay: 0.25 + i * STEP,
                      }}
                    >
                      <Icon size={13} strokeWidth={2.2} />
                    </motion.span>

                    <motion.div
                      className="timeline-card-inner"
                      initial={{ opacity: 0, x: 22, filter: "blur(5px)" }}
                      animate={
                        inView
                          ? { opacity: 1, x: 0, filter: "blur(0px)" }
                          : { opacity: 0, x: 22, filter: "blur(5px)" }
                      }
                      transition={{ duration: 0.5, ease: EASE, delay: 0.32 + i * STEP }}
                      whileHover={{ x: 4 }}
                    >
                      <div className="timeline-meta">
                        <span
                          className="timeline-source"
                          style={{ background: event.sourceBg, color: event.sourceColor }}
                        >
                          <Icon size={11} strokeWidth={2.4} />
                          {event.source}
                        </span>
                        <span className="timeline-who">{event.who}</span>
                      </div>
                      <p className="timeline-event-title">{event.title}</p>
                      <p className="timeline-event-desc">{event.description}</p>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
