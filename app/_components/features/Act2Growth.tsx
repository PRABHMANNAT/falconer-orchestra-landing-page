"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Mark from "../Mark";
import OrchestraLogo from "./OrchestraLogo";
import { ALL_RAYS } from "./types";

gsap.registerPlugin(ScrollTrigger);

// ---------------------------------------------
// Socrates Q&A mock card
// ---------------------------------------------
function SocratesMock() {
  const chips = [
    { label: "Call note | May 14", color: "#6f9a8a" },
    { label: "Linear NW-218", color: "#5E6AD2" },
    { label: "Plan | Retries", color: "#d97757" },
  ];
  const followUps = [
    "What did we promise on the SSO rollout?",
    "Who owns the Northwind renewal?",
    "What's still open before we ship?",
  ];

  return (
    <motion.div
      style={{
        background: "var(--color-paper)",
        borderRadius: 16,
        border: "1px solid var(--color-line)",
        padding: 24,
        maxWidth: 460,
        marginTop: 32,
        boxShadow: "0 24px 60px rgba(14,29,11,0.08)",
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}
    >
      <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--color-muted)", margin: "0 0 12px" }}>
        Northwind | Account brain | Socrates
      </p>
      {/* Query */}
      <div style={{ padding: "12px 14px", background: "var(--color-cream)", borderRadius: 10, border: "1px solid var(--color-line)", marginBottom: 16 }}>
        <p style={{ margin: 0, fontSize: 14, color: "var(--color-ink)" }}>
          What did we promise Northwind about retries?
        </p>
      </div>
      {/* Answer */}
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--color-accent)", color: "#fff", display: "grid", placeItems: "center", flexShrink: 0, fontSize: 16 }}>
          <Mark tone="light" />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-accent-darker)", margin: "0 0 6px" }}>
            Socrates
          </p>
          <p style={{ margin: "0 0 12px", fontSize: 14, color: "var(--color-ink)", lineHeight: 1.55 }}>
            Use a 24-hour replay window with idempotency keys. Source: May 14 call.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, paddingTop: 10, borderTop: "1px dashed var(--color-line)" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-muted)" }}>Grounded in</span>
            {chips.map(c => (
              <motion.span
                key={c.label}
                initial={{ opacity: 0, y: 3 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.2 }}
                style={{
                  padding: "3px 8px", borderRadius: 6,
                  background: c.color + "18", color: c.color,
                  fontFamily: "var(--font-mono)", fontSize: 10,
                }}
              >
                {c.label}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
      {/* Follow-ups */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--color-line)" }}>
        {followUps.map((q, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.35 }}
            style={{
              padding: "8px 14px", borderRadius: 999,
              border: "1px solid var(--color-line)",
              background: "white",
              fontSize: 12, color: "var(--color-muted)",
              cursor: "pointer",
            }}
          >
            {q}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------
// Suggestion cards mock
// ---------------------------------------------
function SuggestionsMock() {
  const cards = [
    { accent: "#d97757", cat: "MERGE CONFLICTS", title: "Maya and Devraj both editing auth.ts" },
    { accent: "#7c3aed", cat: "SPEC DRIFT",       title: "OAuth shipping despite PRD saying magic-link" },
    { accent: "#d97706", cat: "STALLED WORK",     title: "PR #43 has had no activity in 7 days" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 32, maxWidth: 440 }}>
      {cards.map((c, i) => (
        <motion.div
          key={c.cat}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15, duration: 0.45, ease: [0.22,1,0.36,1] }}
          style={{
            position: "relative",
            background: "var(--color-paper)",
            borderRadius: 12,
            border: "1px solid var(--color-line)",
            padding: "14px 18px",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: c.accent, borderRadius: "3px 0 0 3px" }} />
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: c.accent, margin: "0 0 6px" }}>
            {c.cat}
          </p>
          <p style={{ margin: 0, fontSize: 13, color: "var(--color-ink)", fontWeight: 600 }}>
            {c.title}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

// ---------------------------------------------
// Mini timeline mock
// ---------------------------------------------
function TimelineMock() {
  const events = [
    { src: "SLACK", color: "#4A154B", bg: "#ede9fe", title: "Scoping call recap posted", attr: "Maya R." },
    { src: "GITHUB", color: "#c2410c", bg: "#fff7ed", title: "PR #47 merged by Devraj", attr: "Devraj K." },
    { src: "MANUAL", color: "#0f766e", bg: "#f0fdfa", title: "PRD updated: auth confirmed", attr: "Sana A." },
  ];
  return (
    <div style={{ position: "relative", paddingLeft: 28, marginTop: 32, maxWidth: 440 }}>
      {/* Spine */}
      <div style={{
        position: "absolute", left: 8, top: 0, bottom: 0, width: 2,
        background: "linear-gradient(to bottom, var(--color-accent), rgba(217,119,87,0.1))",
      }} />
      {events.map((e, i) => (
        <motion.div
          key={e.src + i}
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.12, duration: 0.45, ease: [0.22,1,0.36,1] }}
          style={{ position: "relative", marginBottom: i < events.length - 1 ? 16 : 0 }}
        >
          {/* Dot */}
          <div style={{
            position: "absolute", left: -24, top: 12,
            width: 10, height: 10, borderRadius: "50%",
            background: "var(--color-accent)", border: "2px solid white",
            boxShadow: "0 0 0 3px rgba(217,119,87,0.2)",
          }} />
          <div style={{
            padding: "12px 16px", background: "var(--color-cream)",
            borderRadius: 10, border: "1px solid var(--color-line)",
          }}>
            <span style={{
              display: "inline-block", marginBottom: 6, padding: "2px 7px",
              background: e.bg, color: e.color, borderRadius: 5,
              fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase",
            }}>
              {e.src}
            </span>
            <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 600, color: "var(--color-ink)" }}>
              {e.title}
            </p>
            <p style={{ margin: 0, fontSize: 11, color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}>
              {e.attr}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ---------------------------------------------
// Growth outcomes
// ---------------------------------------------
function GrowthMock() {
  const outcomes = [
    "Faster onboarding",
    "Less repeated work",
    "Clear decision history",
    "Faster reviews",
    "Context-aware AI",
  ];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 32, maxWidth: 440 }}>
      {outcomes.map((o, i) => (
        <motion.div
          key={o}
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.45, ease: [0.22,1,0.36,1], type: "spring", stiffness: 260, damping: 20 }}
          style={{
            padding: "10px 18px", borderRadius: 999,
            background: "var(--color-accent-tint)",
            color: "var(--color-accent-darker)",
            fontFamily: "var(--font-mono)",
            fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase",
          }}
        >
          {o}
        </motion.div>
      ))}
    </div>
  );
}

// ---------------------------------------------
// Panel wrapper
// ---------------------------------------------
function Panel({
  eyebrow, eyebrowColor, title, subtitle, children,
}: {
  eyebrow: string;
  eyebrowColor: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{
      width: "80vw", height: "100vh", display: "flex", alignItems: "center",
      padding: "0 clamp(40px, 5vw, 100px)", flexShrink: 0,
    }}>
      <div style={{ maxWidth: 600, marginLeft: "auto", marginRight: "clamp(60px, 8vw, 140px)" }}>
        <p style={{
          fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.22em",
          textTransform: "uppercase", color: eyebrowColor, margin: "0 0 16px",
        }}>
          {eyebrow}
        </p>
        <h2 style={{
          fontFamily: "var(--font-display)", fontSize: "clamp(44px, 5vw, 68px)",
          fontWeight: 400, textTransform: "uppercase", color: "var(--color-ink)",
          lineHeight: 0.96, margin: "0 0 20px", whiteSpace: "pre-line",
        }}>
          {title}
        </h2>
        <p style={{ fontSize: 17, color: "var(--color-muted)", lineHeight: 1.6, maxWidth: 480 }}>
          {subtitle}
        </p>
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------
// Final CTA frame
// ---------------------------------------------
function CtaFrame() {
  return (
    <div style={{
      width: "100vw", height: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "#0F0D0B", flexShrink: 0,
    }}>
      <div style={{ textAlign: "center" }}>
        {/* Small lit logo */}
        <div style={{ marginBottom: 32, color: "#d97757", fontSize: 72 }}>
          <Mark tone="dark" />
        </div>
        <h2 style={{
          fontFamily: "var(--font-display)", fontSize: "clamp(48px, 6vw, 80px)",
          fontWeight: 400, textTransform: "uppercase", color: "#FAF7F1",
          lineHeight: 0.96, margin: "0 0 20px", whiteSpace: "pre-line",
        }}>
          {"Start free.\nGrow without\nlosing context."}
        </h2>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 40 }}>
          <a href="/waitlist" style={{
            padding: "14px 32px", borderRadius: 999,
            background: "var(--color-accent)", color: "#fff",
            fontFamily: "var(--font-mono)", fontSize: 13, letterSpacing: "0.14em",
            textTransform: "uppercase", textDecoration: "none",
          }}>
            Join Waitlist
          </a>
          <a
            href="https://calendly.com/adidogra07/orchestra-demo"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "14px 32px", borderRadius: 999,
              border: "1.5px solid rgba(255,255,255,0.3)", background: "transparent", color: "#FAF7F1",
              fontFamily: "var(--font-mono)", fontSize: 13, letterSpacing: "0.14em",
              textTransform: "uppercase", textDecoration: "none",
            }}
          >
            Book Demo
          </a>
        </div>
        <p style={{
          marginTop: 20, fontFamily: "var(--font-mono)", fontSize: 11,
          letterSpacing: "0.18em", textTransform: "uppercase",
          color: "rgba(250,247,241,0.35)",
        }}>
          No card needed
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------
// Act 2 - Horizontal scroll container
// ---------------------------------------------
interface Act2Props {
  onSectionChange?: (index: number) => void; // 8-11 for panels, 12 for CTA
}

export default function Act2Growth({ onSectionChange }: Act2Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // 4 panels + 1 CTA = 5 panels - 100vw = 500vw total track
  // But logo takes ~30vw on the left, so content panels are 100vw each
  // Total track width = 30vw (logo) + 4 - 100vw (panels) + 100vw (CTA) = 530vw

  useGSAP(() => {
    if (reduceMotion || !sectionRef.current || !trackRef.current) return;

    const track = trackRef.current;
    // total horizontal travel = track.scrollWidth - window.innerWidth
    const totalX = -(track.scrollWidth - window.innerWidth);

    const tween = gsap.to(track, {
      x: totalX,
      ease: "none",
    });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: `+=${Math.abs(totalX)}`,
      pin: true,
      scrub: 1.5,
      animation: tween,
      onUpdate: (st) => {
        const panelCount = 5; // 4 panels + cta
        const panelIdx = Math.min(Math.floor(st.progress * panelCount), panelCount - 1);
        onSectionChange?.(8 + panelIdx);
      },
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        overflow: "hidden",
        background: "var(--color-cream)",
      }}
    >
      {/* Horizontal track */}
      <div
        ref={trackRef}
        style={{
          display: "flex",
          flexWrap: "nowrap",
          willChange: "transform",
        }}
      >
        {/* Anchored logo column */}
        <div style={{
          width: "30vw",
          minWidth: "30vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          padding: "0 2vw",
        }}>
          <OrchestraLogo size={360} activeRays={ALL_RAYS} glowIntensity={1} />
        </div>

        {/* Panel 1 - Socrates */}
        <Panel
          eyebrow="From your brain"
          eyebrowColor="#0D9488"
          title={"Ask anything.\nGet answers\nyou can trust."}
          subtitle="Socrates searches your connected tools and shows the sources behind every answer."
        >
          <SocratesMock />
        </Panel>

        {/* Panel 2 - Suggestions */}
        <Panel
          eyebrow="The AI PM"
          eyebrowColor="var(--color-accent)"
          title={"Catch issues\nbefore they grow."}
          subtitle="Spot merge conflicts, spec drift, and stalled work while there is still time to fix them."
        >
          <SuggestionsMock />
        </Panel>

        {/* Panel 3 - Timeline */}
        <Panel
          eyebrow="One thread of truth"
          eyebrowColor="#7c3aed"
          title={"Every decision\nwith context."}
          subtitle="See what changed, who decided it, and which source proves it."
        >
          <TimelineMock />
        </Panel>

        {/* Panel 4 - Growth */}
        <Panel
          eyebrow="What it becomes"
          eyebrowColor="#D97706"
          title={"Move faster\nwith less drift."}
          subtitle="Give every team the same context so decisions stay aligned as work moves forward."
        >
          <GrowthMock />
        </Panel>

        {/* Final CTA */}
        <CtaFrame />
      </div>
    </section>
  );
}
