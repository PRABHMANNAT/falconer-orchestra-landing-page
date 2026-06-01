"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const events = [
  {
    source: "SLACK",
    sourceBg: "#ede9fe",
    sourceColor: "#7c3aed",
    title: "Scoping call recap posted",
    description: "Maya shared decision: magic-link auth for v1, OAuth deferred.",
    attribution: "Maya R.",
  },
  {
    source: "GITHUB",
    sourceBg: "#fff7ed",
    sourceColor: "#c2410c",
    title: "PR #47 merged by Devraj",
    description: "auth.ts refactored, removes old session middleware.",
    attribution: "Devraj K.",
  },
  {
    source: "MANUAL",
    sourceBg: "#f0fdfa",
    sourceColor: "#0f766e",
    title: "PRD updated — auth scope confirmed",
    description: "Spec now matches implementation. Added SCIM provisioning note.",
    attribution: "Sana A.",
  },
  {
    source: "SLACK",
    sourceBg: "#ede9fe",
    sourceColor: "#7c3aed",
    title: "Northwind asked about SSO timeline",
    description: "Promised SAML by end of Q2. Logged to account brain.",
    attribution: "Maya R.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const itemVariants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.45,
      ease: EASE,
    },
  },
};

export default function TimelineSection() {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-80px" });

  return (
    <section
      style={{
        background: "var(--color-cream)",
        paddingTop: "clamp(80px, 10vw, 130px)",
        paddingBottom: "clamp(80px, 10vw, 130px)",
        paddingLeft: "var(--pad)",
        paddingRight: "var(--pad)",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "0.85fr 1.15fr",
          gap: "clamp(48px, 6vw, 96px)",
          alignItems: "center",
        }}
        className="timeline-grid"
      >
        {/* LEFT COLUMN */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--color-accent)",
              marginBottom: 16,
              margin: "0 0 16px",
            }}
          >
            TIMELINE
          </p>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(44px, 5.5vw, 72px)",
              textTransform: "uppercase",
              color: "var(--color-ink)",
              lineHeight: 0.96,
              margin: "0 0 24px",
            }}
          >
            <span style={{ display: "block" }}>ONE TIMELINE.</span>
            <span style={{ display: "block" }}>ZERO LOST DECISIONS.</span>
          </h2>

          <p
            style={{
              maxWidth: "44ch",
              fontSize: "clamp(16px, 1.5vw, 19px)",
              color: "var(--color-muted)",
              lineHeight: 1.55,
              margin: "0 0 32px",
            }}
          >
            Every change traces back to who, what source, and when. Slack
            threads, commits, scoping calls — all on one immutable thread.
          </p>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            {["AUDIT-READY", "SLICEABLE BY SOCRATES", "ADMIN-APPROVED"].map(
              (pill) => (
                <span
                  key={pill}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 999,
                    background: "var(--color-near-black)",
                    color: "#fff",
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  }}
                >
                  {pill}
                </span>
              )
            )}
          </div>
        </div>

        {/* RIGHT COLUMN — Timeline Mock */}
        <div
          ref={cardRef}
          style={{
            background: "#fff",
            border: "1px solid var(--color-line)",
            borderRadius: 20,
            padding: "32px 28px",
            boxShadow: "0 24px 60px rgba(14,29,11,0.08)",
          }}
        >
          {/* Spine + events container */}
          <div style={{ position: "relative" }}>
            {/* Vertical spine */}
            <div
              style={{
                position: "absolute",
                left: 24,
                top: 0,
                bottom: 0,
                width: 2,
                background:
                  "linear-gradient(to bottom, var(--color-accent), rgba(217,119,87,0.15))",
              }}
            />

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {events.map((event, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  style={{
                    marginLeft: 48,
                    marginBottom: index < events.length - 1 ? 24 : 0,
                    padding: 16,
                    background: "var(--color-cream)",
                    borderRadius: 12,
                    border: "1px solid var(--color-line)",
                    position: "relative",
                  }}
                >
                  {/* Dot on spine */}
                  <div
                    style={{
                      position: "absolute",
                      left: -36,
                      top: 20,
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: "var(--color-accent)",
                      border: "2px solid white",
                      boxShadow: "0 0 0 3px rgba(217,119,87,0.2)",
                    }}
                  />

                  {/* Source badge */}
                  <span
                    style={{
                      display: "inline-block",
                      padding: "3px 8px",
                      borderRadius: 6,
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      marginBottom: 8,
                      background: event.sourceBg,
                      color: event.sourceColor,
                    }}
                  >
                    {event.source}
                  </span>

                  {/* Event title */}
                  <p
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      color: "var(--color-ink)",
                      margin: "0 0 4px",
                    }}
                  >
                    {event.title}
                  </p>

                  {/* Event description */}
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--color-muted)",
                      margin: "0 0 6px",
                      lineHeight: 1.45,
                    }}
                  >
                    {event.description}
                  </p>

                  {/* Attribution */}
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10.5,
                      color: "var(--color-muted)",
                    }}
                  >
                    {event.attribution}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .timeline-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
