"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { SOURCES } from "./types";
import Mark from "../Mark";

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

function zeroPad(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

/* Animate-in wrapper — skips animation when reduced-motion is set */
function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const shouldReduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });

  if (shouldReduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Capability card data                                                  */
/* ------------------------------------------------------------------ */

const CAPABILITIES = [
  {
    eyebrow: "SOCRATES",
    title: "Ask anything. Get answers you can trust.",
    body: "Query your entire company knowledge base in plain English. Socrates surfaces the source, the date, and the person behind every answer.",
    bg: "#f2f0ec",
    accent: "var(--color-accent)",
  },
  {
    eyebrow: "SUGGESTIONS",
    title: "Notice what you'd miss.",
    body: "Orchestra detects when a decision in Slack contradicts a spec in Docs, when a deadline slipped past a calendar invite, or when a promise made on a call hasn't been followed up on.",
    bg: "#f8f5eb",
    accent: "#1E88E5",
  },
  {
    eyebrow: "TIMELINE",
    title: "Every decision, forever.",
    body: "A permanent, searchable log of every decision your team has ever made — with the full context of why it was made. Onboard new hires in days, not months.",
    bg: "#ffffff",
    accent: "#5E6AD2",
  },
  {
    eyebrow: "GROWTH",
    title: "Now grow your business.",
    body: "Orchestra synthesises customer signals across email, calls, and tickets to surface the patterns that drive revenue — so you can double down on what's working.",
    bg: "var(--color-cream)",
    accent: "var(--color-accent)",
  },
];

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

export default function ReducedMotionFallback() {
  return (
    <section
      style={{
        background: "var(--color-cream)",
        width: "100%",
        overflowX: "hidden",
      }}
    >
      {/* ---- 1. INTRO ---- */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "80px 24px",
          gap: "20px",
        }}
      >
        <FadeUp>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--color-accent)",
            }}
          >
            Features
          </span>
        </FadeUp>

        <FadeUp delay={0.05}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(48px, 8vw, 96px)",
              lineHeight: 1,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              color: "var(--color-ink)",
              margin: 0,
            }}
          >
            Eight Sources.
            <br />
            One Brain.
          </h1>
        </FadeUp>

        <FadeUp delay={0.1}>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "18px",
              lineHeight: 1.6,
              color: "var(--color-muted)",
              maxWidth: "520px",
              margin: 0,
            }}
          >
            Everything your team touches, flowing into one source of truth.
          </p>
        </FadeUp>

        <FadeUp delay={0.15}>
          <div
            style={{
              width: "120px",
              height: "120px",
              color: "var(--color-accent)",
              marginTop: "8px",
            }}
          >
            <Mark tone="dark" />
          </div>
        </FadeUp>
      </div>

      {/* ---- 2. SOURCES GRID ---- */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px 80px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
            gap: "20px",
          }}
        >
          {SOURCES.map((source, i) => (
            <FadeUp key={source.key} delay={i * 0.04}>
              <div
                style={{
                  position: "relative",
                  padding: "28px 28px 28px 44px",
                  background: "var(--color-paper)",
                  borderRadius: "16px",
                  border: "1px solid var(--color-line)",
                  height: "100%",
                  boxSizing: "border-box",
                }}
              >
                {/* Colored left accent bar */}
                <div
                  style={{
                    position: "absolute",
                    left: "16px",
                    top: "12px",
                    bottom: "12px",
                    width: "3px",
                    borderRadius: "3px",
                    background: source.brandColor,
                  }}
                />

                {/* Source number — top-right */}
                <span
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "20px",
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    color: "var(--color-muted)",
                    letterSpacing: "0.06em",
                  }}
                >
                  {zeroPad(i)}
                </span>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "28px",
                    lineHeight: 1.1,
                    letterSpacing: "0.02em",
                    textTransform: "uppercase",
                    color: "var(--color-ink)",
                    margin: "0 0 12px",
                  }}
                >
                  {source.title}
                </h3>

                {/* Body */}
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "16px",
                    lineHeight: 1.6,
                    color: "var(--color-muted)",
                    margin: 0,
                  }}
                >
                  {source.body}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>

      {/* ---- 3. CAPABILITIES ---- */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px 80px",
        }}
      >
        {/* Section header */}
        <FadeUp>
          <div style={{ marginBottom: "48px", textAlign: "center" }}>
            <span
              style={{
                display: "block",
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--color-accent)",
                marginBottom: "12px",
              }}
            >
              What it unlocks
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(36px, 5vw, 64px)",
                lineHeight: 1,
                letterSpacing: "0.02em",
                textTransform: "uppercase",
                color: "var(--color-ink)",
                margin: 0,
              }}
            >
              Four Capabilities
            </h2>
          </div>
        </FadeUp>

        {/* Capability cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {CAPABILITIES.map((cap, i) => (
            <FadeUp key={cap.eyebrow} delay={i * 0.06}>
              <div
                style={{
                  padding: "48px",
                  background: cap.bg,
                  borderRadius: "20px",
                  border: "1px solid var(--color-line)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Accent top divider */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "48px",
                    right: "48px",
                    height: "3px",
                    background: cap.accent,
                    borderRadius: "0 0 3px 3px",
                  }}
                />

                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--font-mono)",
                    fontSize: "13px",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: cap.accent,
                    marginBottom: "16px",
                  }}
                >
                  {cap.eyebrow}
                </span>

                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(28px, 3.5vw, 48px)",
                    lineHeight: 1.05,
                    letterSpacing: "0.01em",
                    textTransform: "uppercase",
                    color: "var(--color-ink)",
                    margin: "0 0 20px",
                    maxWidth: "700px",
                  }}
                >
                  {cap.title}
                </h3>

                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "17px",
                    lineHeight: 1.65,
                    color: "var(--color-muted)",
                    margin: 0,
                    maxWidth: "600px",
                  }}
                >
                  {cap.body}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>

      {/* ---- 4. CTA ---- */}
      <FadeUp>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            padding: "40px 24px 100px",
          }}
        >
          <a
            href="#waitlist"
            style={{
              display: "inline-block",
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: "15px",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "var(--color-paper)",
              background: "var(--color-accent)",
              border: "none",
              borderRadius: "8px",
              padding: "14px 36px",
              cursor: "pointer",
              textDecoration: "none",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background =
                "var(--color-accent-deep)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background =
                "var(--color-accent)";
            }}
          >
            Join Waitlist
          </a>

          <a
            href="https://calendly.com/adidogra07/orchestra-demo"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: "15px",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "var(--color-accent)",
              background: "transparent",
              border: "2px solid var(--color-accent)",
              borderRadius: "8px",
              padding: "12px 36px",
              cursor: "pointer",
              textDecoration: "none",
              transition: "background 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "var(--color-accent-tint)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "transparent";
            }}
          >
            Book Demo
          </a>
        </div>
      </FadeUp>
    </section>
  );
}
