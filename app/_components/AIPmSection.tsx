"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { GitMerge, FileWarning, Clock, FileSearch } from "lucide-react";

const cards = [
  {
    accentColor: "#d97757",
    icon: <GitMerge size={18} color="#d97757" />,
    category: "MERGE CONFLICTS",
    categoryColor: "#d97757",
    severity: { label: "HIGH", bg: "#fee2e2", color: "#dc2626" },
    title: "Maya and Devraj both editing auth.ts",
    body: "Two open PRs touch the same files. Merge either first and the other will need to rebase.",
  },
  {
    accentColor: "#7c3aed",
    icon: <FileWarning size={18} color="#7c3aed" />,
    category: "SPEC DRIFT",
    categoryColor: "#7c3aed",
    severity: null,
    title: "OAuth shipping despite PRD saying v1 is magic-link only",
    body: "Your PRD and your code stopped agreeing. Reconcile before launch.",
  },
  {
    accentColor: "#d97706",
    icon: <Clock size={18} color="#d97706" />,
    category: "STALLED WORK",
    categoryColor: "#d97706",
    severity: null,
    title: "PR #43 has had no activity in 7 days",
    body: "Blocked on review from Sarah. Last comment 7 days ago.",
  },
  {
    accentColor: "#d97757",
    icon: <FileSearch size={18} color="#d97757" />,
    category: "COVERAGE GAP",
    categoryColor: "#d97757",
    severity: null,
    title: "Driver Assignment spec has no engineering activity",
    body: "Scoped for sprint 4. We're in sprint 5. Nothing's been touched.",
  },
];

export default function AIPmSection() {
  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(gridRef, { once: true, margin: "-100px" });

  return (
    <section
      style={{
        background:
          "radial-gradient(ellipse 60% 50% at 100% 0%, rgba(217,119,87,0.08), transparent 60%), var(--color-cream)",
        paddingTop: "clamp(80px, 10vw, 130px)",
        paddingBottom: "clamp(80px, 10vw, 130px)",
        paddingLeft: "var(--pad)",
        paddingRight: "var(--pad)",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              fontSize: 12,
              color: "var(--color-accent)",
              marginBottom: 16,
              margin: "0 0 16px",
            }}
          >
            SUGGESTIONS
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(48px, 6vw, 80px)",
              lineHeight: 0.96,
              color: "var(--color-ink)",
              textTransform: "uppercase",
              textAlign: "center",
              margin: 0,
            }}
          >
            THE AI PM YOU NEVER HIRED
          </h2>
          <p
            style={{
              maxWidth: 600,
              margin: "24px auto 64px",
              fontSize: "clamp(16px, 1.4vw, 18px)",
              color: "var(--color-muted)",
              lineHeight: 1.6,
            }}
          >
            Socrates doesn&apos;t just answer questions. It watches your company
            in motion and surfaces what would slip through — before it costs you
            a sprint.
          </p>
        </div>

        {/* 2×2 Grid */}
        <div
          ref={gridRef}
          style={{
            maxWidth: 900,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 20,
          }}
          className="ai-pm-grid"
        >
          {cards.map((card, i) => (
            <motion.div
              key={card.category}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: "easeOut" }}
              whileHover={{
                y: -2,
                boxShadow: "0 20px 40px rgba(14,29,11,0.08)",
              }}
              style={{
                background: "#fff",
                borderRadius: 16,
                border: "1px solid var(--color-line)",
                padding: 24,
                position: "relative",
                overflow: "hidden",
                cursor: "default",
              }}
            >
              {/* Left accent bar */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 3,
                  borderRadius: "3px 0 0 3px",
                  background: card.accentColor,
                }}
              />

              {/* Card header row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 12,
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                  {card.icon}
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: card.categoryColor,
                      marginLeft: 6,
                    }}
                  >
                    {card.category}
                  </span>
                </div>
                {card.severity && (
                  <span
                    style={{
                      background: card.severity.bg,
                      color: card.severity.color,
                      fontSize: 10,
                      borderRadius: 999,
                      padding: "2px 7px",
                      fontFamily: "var(--font-mono)",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      flexShrink: 0,
                    }}
                  >
                    {card.severity.label}
                  </span>
                )}
              </div>

              {/* Title */}
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "var(--color-ink)",
                  margin: "0 0 8px",
                }}
              >
                {card.title}
              </p>

              {/* Body */}
              <p
                style={{
                  fontSize: 14,
                  color: "var(--color-muted)",
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                {card.body}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Below grid CTA */}
        <div
          style={{ textAlign: "center", marginTop: 48 }}
        >
          <a
            href="#"
            style={{
              color: "var(--color-accent)",
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              textDecoration: "none",
              borderBottom: "1px solid var(--color-accent)",
              paddingBottom: 2,
              display: "inline-block",
            }}
          >
            EXPLORE SUGGESTIONS →
          </a>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--color-muted)",
              marginTop: 14,
              margin: "14px 0 0",
            }}
          >
            Socrates surfaces 8 categories of risk. Only what needs attention
            now is shown.
          </p>
        </div>
      </div>

      {/* Responsive grid style */}
      <style>{`
        @media (max-width: 640px) {
          .ai-pm-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
