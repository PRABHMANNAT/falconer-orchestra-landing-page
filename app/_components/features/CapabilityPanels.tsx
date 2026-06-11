"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Mark from "../Mark";

// ---------------------------------------------------------------------------
// Shared layout helpers
// ---------------------------------------------------------------------------

const panelBase: React.CSSProperties = {
  width: "100vw",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  flexShrink: 0,
  padding: "0 clamp(60px, 8vw, 140px)",
};

const innerContent: React.CSSProperties = {
  maxWidth: 680,
  marginLeft: "auto",
};

const eyebrowStyle = (color: string): React.CSSProperties => ({
  fontFamily: "var(--font-mono)",
  fontSize: 12,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  color,
  margin: "0 0 16px",
});

const titleStyle: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: "clamp(44px, 5vw, 72px)",
  textTransform: "uppercase",
  color: "var(--color-ink)",
  lineHeight: 0.96,
  margin: "0 0 20px",
  whiteSpace: "pre-line",
};

const subtitleStyle: React.CSSProperties = {
  fontSize: 18,
  color: "var(--color-muted)",
  maxWidth: 480,
  lineHeight: 1.6,
  margin: "0 0 36px",
};

// ---------------------------------------------------------------------------
// Panel 1 - Socrates
// ---------------------------------------------------------------------------

export function Panel1Socrates() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  const chips = ["Call note | May 14", "Linear NW-218", "Plan | Retries"];
  const followUps = [
    "What did we promise on the SSO rollout?",
    "Who owns the Northwind renewal?",
    "What's still open before we ship?",
  ];

  return (
    <div style={panelBase}>
      <div style={innerContent} ref={ref}>
        <p style={eyebrowStyle("#0D9488")}>From your brain</p>
        <h2 style={titleStyle}>{"Ask anything.\nGet answers you can trust."}</h2>
        <p style={subtitleStyle}>
          Socrates queries every source you connected. Every answer cites where
          it came from.
        </p>

        {/* Mock Q&A card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            background: "var(--color-paper)",
            borderRadius: 16,
            border: "1px solid var(--color-line)",
            padding: 24,
            maxWidth: 480,
            marginTop: 32,
          }}
        >
          {/* Header row */}
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--color-muted)",
              margin: "0 0 14px",
            }}
          >
            Northwind &middot; Account brain &middot; Socrates
          </p>

          {/* Mock search row */}
          <div
            style={{
              background: "var(--color-cream)",
              borderRadius: 8,
              border: "1px solid var(--color-line)",
              padding: "10px 14px",
              fontFamily: "var(--font-sans)",
              fontSize: 14,
              color: "var(--color-ink)",
              marginBottom: 16,
            }}
          >
            What did we promise Northwind about retries?
          </div>

          {/* Answer card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.3 }}
            style={{
              background: "var(--color-cream)",
              borderRadius: 12,
              padding: "14px 16px",
              marginBottom: 14,
            }}
          >
            {/* Avatar + label row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "var(--color-accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                <Mark tone="light" />
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--color-accent)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                Socrates
              </span>
            </div>

            <p
              style={{
                fontSize: 14,
                color: "var(--color-ink)",
                lineHeight: 1.55,
                margin: "0 0 12px",
              }}
            >
              Use a 24-hour replay window with idempotency keys. Source: May 14 call.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--color-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  marginRight: 4,
                }}
              >
                Grounded in
              </span>
              {chips.map((chip) => (
                <span
                  key={chip}
                  style={{
                    padding: "4px 8px",
                    borderRadius: 6,
                    background: "var(--color-accent-tint)",
                    color: "var(--color-accent-darker)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                  }}
                >
                  {chip}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Follow-up pills */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {followUps.map((pill, i) => (
              <motion.div
                key={pill}
                initial={{ opacity: 0, x: -8 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.35,
                  ease: "easeOut",
                  delay: 0.55 + i * 0.12,
                }}
                style={{
                  border: "1px solid var(--color-line)",
                  background: "var(--color-paper)",
                  borderRadius: 999,
                  padding: "8px 14px",
                  fontSize: 13,
                  color: "var(--color-muted)",
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {pill}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Panel 2 - Suggestions
// ---------------------------------------------------------------------------

const suggestionCards = [
  {
    accent: "#d97757",
    label: "Merge Conflicts",
    title: "Maya and Devraj both editing auth.ts",
  },
  {
    accent: "#7c3aed",
    label: "Spec Drift",
    title: "OAuth shipping despite PRD saying magic-link only",
  },
  {
    accent: "#d97706",
    label: "Stalled Work",
    title: "PR #43 has had no activity in 7 days",
  },
];

export function Panel2Suggestions() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <div style={panelBase}>
      <div style={innerContent} ref={ref}>
        <p style={eyebrowStyle("#d97757")}>Signal layer</p>
        <h2 style={titleStyle}>{"Catch issues\nbefore they grow."}</h2>
        <p style={subtitleStyle}>
          Spot conflict risk, decision drift, and stalled reviews while there is still time to fix them.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 0, maxWidth: 480, marginTop: 32 }}>
          {suggestionCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, x: 40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{
                duration: 0.45,
                ease: "easeOut",
                delay: i * 0.2,
              }}
              style={{
                background: "var(--color-paper)",
                borderRadius: 12,
                border: "1px solid var(--color-line)",
                padding: "16px 18px",
                marginBottom: 10,
                display: "flex",
                alignItems: "stretch",
                gap: 0,
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* Left accent bar */}
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 3,
                  background: card.accent,
                  borderRadius: "12px 0 0 12px",
                }}
              />
              <div style={{ paddingLeft: 14 }}>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: card.accent,
                    margin: "0 0 4px",
                  }}
                >
                  {card.label}
                </p>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--color-ink)",
                    margin: 0,
                    lineHeight: 1.4,
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {card.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Panel 3 - Timeline
// ---------------------------------------------------------------------------

const timelineEvents = [
  {
    source: "Slack",
    badgeBg: "#7c3aed",
    title: "Scoping call recap posted",
    author: "Maya R.",
  },
  {
    source: "GitHub",
    badgeBg: "#d97757",
    title: "PR #47 merged by Devraj",
    author: "Devraj K.",
  },
  {
    source: "Manual",
    badgeBg: "#0D9488",
    title: "PRD updated: auth scope confirmed",
    author: "Sana A.",
  },
];

export function Panel3Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <div style={panelBase}>
      <div style={innerContent} ref={ref}>
        <p style={eyebrowStyle("#7c3aed")}>One thread of truth</p>
        <h2 style={titleStyle}>{"Every decision\nwith context."}</h2>
        <p style={subtitleStyle}>
          See what changed, who decided it, and which source proves it.
        </p>

        {/* Mini timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, ease: "easeOut" }}
          style={{
            maxWidth: 420,
            marginTop: 32,
            position: "relative",
            paddingLeft: 24,
          }}
        >
          {/* Spine */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 12,
              bottom: 12,
              width: 2,
              background:
                "linear-gradient(to bottom, var(--color-accent), var(--color-accent-deep))",
              borderRadius: 2,
            }}
          />

          {timelineEvents.map((event, i) => (
            <motion.div
              key={event.source + i}
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{
                duration: 0.4,
                ease: "easeOut",
                delay: 0.15 + i * 0.1,
              }}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                marginBottom: i < timelineEvents.length - 1 ? 20 : 0,
                position: "relative",
              }}
            >
              {/* Dot on spine */}
              <span
                style={{
                  position: "absolute",
                  left: -28,
                  top: 10,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: event.badgeBg,
                  border: "2px solid var(--color-paper)",
                  flexShrink: 0,
                }}
              />

              {/* Card */}
              <div
                style={{
                  flex: 1,
                  background: "var(--color-paper)",
                  borderRadius: 10,
                  border: "1px solid var(--color-line)",
                  padding: "12px 14px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{
                      background: event.badgeBg,
                      color: "#fff",
                      fontFamily: "var(--font-mono)",
                      fontSize: 9,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      padding: "2px 7px",
                      borderRadius: 4,
                    }}
                  >
                    {event.source}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--color-ink)",
                    margin: "0 0 4px",
                    fontFamily: "var(--font-sans)",
                    lineHeight: 1.35,
                  }}
                >
                  {event.title}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "var(--color-muted)",
                    margin: 0,
                  }}
                >
                  {event.author}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Panel 4 - Growth
// ---------------------------------------------------------------------------

const outcomePills = [
  "Faster onboarding",
  "Less repeated work",
  "Clear decision history",
  "Faster reviews",
  "Context-aware AI",
];

export function Panel4Growth() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <div style={panelBase}>
      <div style={innerContent} ref={ref}>
        <p style={eyebrowStyle("#D97706")}>What it becomes</p>
        <h2 style={titleStyle}>{"Move faster\nwith less drift."}</h2>
        <p style={subtitleStyle}>
          Give every team the same context so decisions stay aligned as work moves forward.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            maxWidth: 420,
            marginTop: 32,
            alignItems: "flex-start",
          }}
        >
          {outcomePills.map((pill, i) => (
            <motion.div
              key={pill}
              initial={{ scale: 0, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 22,
                delay: i * 0.1,
              }}
              style={{
                padding: "10px 20px",
                borderRadius: 999,
                background: "var(--color-accent-tint)",
                color: "var(--color-accent-darker)",
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                transformOrigin: "left center",
              }}
            >
              {pill}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Default export - ordered array for Act2Growth to map over
// ---------------------------------------------------------------------------

const CapabilityPanels = [
  Panel1Socrates,
  Panel2Suggestions,
  Panel3Timeline,
  Panel4Growth,
];

export default CapabilityPanels;
