"use client";

// Act 1 — Convergence
// Architecture: sticky logo + normally-scrolling content sections side-by-side.
// NO GSAP pinning. framer-motion useScroll tracks progress and lights up rays.
//
// Layout inside wrapper (660vh total):
//   [sticky logo, z-index 1] always centered on screen
//   [content overlay, z-index 2, margin-top -100vh] scrolls normally over logo
//     · IntroSection   100vh  (centered, logo dim)
//     · 8 SourceSecs    60vh each  (alternating left/right)
//     · OutroSection    80vh  (centered, logo fully lit)

import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import OrchestraLogo, { type SourceKey } from "./OrchestraLogo";
import { SOURCES } from "./types";

// ─── Scroll height constants ──────────────────────────────────────────────────
const INTRO_VH  = 100;
const SOURCE_VH = 60;   // each source section — fast, keeps total under 15s scroll
const OUTRO_VH  = 80;
const TOTAL_VH  = INTRO_VH + SOURCES.length * SOURCE_VH + OUTRO_VH; // 660

// Fraction of total scroll each zone occupies
const INTRO_F  = INTRO_VH  / TOTAL_VH; // 0.152
const SRC_F    = SOURCE_VH / TOTAL_VH; // 0.091

// Activation threshold for each ray: midpoint of its section
const RAY_MID = SOURCES.map((_, i) => INTRO_F + (i + 0.5) * SRC_F);

// ─── Ease ────────────────────────────────────────────────────────────────────
const E = [0.22, 1, 0.36, 1] as const;

// ─── Data samples per source ─────────────────────────────────────────────────
const SAMPLES: { icon: string; text: string }[][] = [
  // 0 docs
  [
    { icon: "📄", text: "BloomFast PRD v2 · 47 pages · ingested 2s ago" },
    { icon: "📋", text: "Northwind SRS · 12 sections · last edited 3h ago" },
  ],
  // 1 slack
  [
    { icon: "💬", text: `#retries — "agreed on 24hr replay" · Maya, May 14` },
    { icon: "💬", text: `#auth — "SAML first, OIDC fallback" · Dev, Apr 22` },
    { icon: "💬", text: `#northwind — "renewal Jun 3" · Sana` },
  ],
  // 2 gmail
  [
    { icon: "📧", text: "Re: Webhook SLA · Northwind · May 8" },
    { icon: "📧", text: "Follow-up: SSO timeline · cto@northwind.co" },
  ],
  // 3 github
  [
    { icon: "🔀", text: "PR #47 · auth.ts refactor · merged 2d ago" },
    { icon: "📝", text: "feat: retry backoff (#51) · +234 −18 · open" },
    { icon: "✅", text: "8a3f91c · fix: idempotency key on replays" },
  ],
  // 4 calendar
  [
    { icon: "📅", text: "Northwind Sprint Planning · May 20 · 9 AM" },
    { icon: "📅", text: "Customer QBR · Northwind · Jun 3 · 2 PM" },
  ],
  // 5 transcripts
  [
    { icon: "🎙️", text: `Northwind · May 14 · "replay window" cited 3×` },
    { icon: "🎙️", text: "Sprint planning · May 20 · action items extracted" },
  ],
  // 6 linear
  [
    { icon: "📌", text: "NW-218 · Dead-letter queue · In Progress · Devraj" },
    { icon: "📌", text: "NW-141 · SCIM provisioning · Backlog" },
  ],
  // 7 notion
  [
    { icon: "📓", text: "Northwind runbook · 8 pages · synced 1h ago" },
    { icon: "📓", text: "Engineering wiki · Auth patterns · read 12×" },
  ],
];

// ─── Source content overlay ───────────────────────────────────────────────────
function SourceContent({
  source,
  index,
  visible,
}: {
  source: typeof SOURCES[0];
  index: number;
  visible: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.45 }}
      transition={{ duration: 0.5, ease: E }}
      style={{ maxWidth: 380 }}
    >
      {/* Eyebrow */}
      <p style={{
        fontFamily: "var(--font-mono)", fontSize: 11,
        letterSpacing: "0.22em", textTransform: "uppercase",
        color: "var(--color-accent)", margin: "0 0 10px",
      }}>
        Source {String(index + 1).padStart(2, "0")} / 08
      </p>

      {/* Brand chip */}
      <span style={{
        display: "inline-block", marginBottom: 12,
        padding: "4px 12px", borderRadius: 999,
        background: source.brandColor + "18",
        border: `1px solid ${source.brandColor}33`,
        fontFamily: "var(--font-mono)", fontSize: 10,
        letterSpacing: "0.16em", textTransform: "uppercase",
        color: source.brandColor === "#000000" ? "#555" : source.brandColor,
      }}>
        {source.label}
      </span>

      {/* Headline */}
      <h2 style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(28px, 3.5vw, 46px)",
        fontWeight: 400, textTransform: "uppercase",
        color: "var(--color-ink)", lineHeight: 0.96,
        margin: "0 0 14px", letterSpacing: "0.01em",
      }}>
        {source.title}
      </h2>

      {/* Body */}
      <p style={{
        fontSize: 14, color: "var(--color-muted)",
        lineHeight: 1.6, margin: "0 0 18px", maxWidth: 360,
      }}>
        {source.body}
      </p>

      {/* Data samples */}
      <motion.div
        style={{ display: "flex", flexDirection: "column", gap: 7 }}
        initial="h"
        whileInView="v"
        viewport={{ once: false, amount: 0.6 }}
        variants={{ h: {}, v: { transition: { staggerChildren: 0.1 } } }}
      >
        {SAMPLES[index]?.map((s, si) => (
          <motion.div
            key={si}
            variants={{ h: { opacity: 0, x: -8 }, v: { opacity: 1, x: 0, transition: { duration: 0.35, ease: E } } }}
            style={{
              display: "flex", alignItems: "center", gap: 9,
              padding: "9px 13px",
              background: "var(--color-paper)",
              borderRadius: 9, border: "1px solid var(--color-line)",
              fontSize: 12, color: "var(--color-muted)",
              fontFamily: "var(--font-mono)",
              boxShadow: "0 3px 10px rgba(14,29,11,0.06)",
            }}
          >
            <span style={{ fontSize: 15, flexShrink: 0 }}>{s.icon}</span>
            <span style={{
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {s.text}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* "Connected" pill — shows once section is mostly scrolled */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            style={{
              marginTop: 14, display: "inline-flex", alignItems: "center", gap: 7,
              padding: "5px 12px", borderRadius: 999,
              background: "rgba(111,154,138,0.14)",
              border: "1px solid rgba(111,154,138,0.28)",
            }}
          >
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "#6f9a8a", flexShrink: 0,
              boxShadow: "0 0 0 3px rgba(111,154,138,0.2)",
            }} />
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 10,
              letterSpacing: "0.16em", textTransform: "uppercase",
              color: "#4a7a69",
            }}>
              Source connected
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Intro section content ────────────────────────────────────────────────────
const INTRO_HEADING = ["Watch", "it", "come", "together."];

function IntroSection() {
  const introContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } },
  };
  const introItem = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: E } },
  };
  const headingWord = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: {
      opacity: 1, y: 0, filter: "blur(0px)",
      transition: { duration: 0.7, ease: E },
    },
  };

  return (
    <div style={{
      position: "relative",
      height: `${INTRO_VH}vh`,
      display: "flex", alignItems: "center", justifyContent: "center",
      pointerEvents: "none",
    }}>
      {/* ambient accent glow that breathes behind the copy */}
      <motion.div
        aria-hidden="true"
        style={{
          position: "absolute",
          width: "min(560px, 80vw)",
          height: "min(560px, 80vw)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(217,119,87,0.14), transparent 68%)",
          pointerEvents: "none",
        }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: [0.5, 0.85, 0.5], scale: [1, 1.07, 1] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        style={{ position: "relative", textAlign: "center", maxWidth: 600 }}
        variants={introContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          variants={introItem}
          style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            fontFamily: "var(--font-mono)", fontSize: 11,
            letterSpacing: "0.28em", textTransform: "uppercase",
            color: "var(--color-accent)", margin: "0 0 20px",
          }}
        >
          <motion.span
            aria-hidden="true"
            style={{
              width: 7, height: 7, borderRadius: "50%",
              background: "var(--color-accent)", flexShrink: 0,
            }}
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
          Features
          <motion.span
            aria-hidden="true"
            style={{
              width: 28, height: 1,
              background: "var(--color-accent)", transformOrigin: "left center",
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 0.6 }}
            transition={{ duration: 0.7, ease: E, delay: 0.5 }}
          />
        </motion.p>

        <motion.h1
          variants={introContainer}
          aria-label="Watch it come together."
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(52px, 7vw, 96px)",
            fontWeight: 400, textTransform: "uppercase",
            color: "var(--color-ink)", lineHeight: 0.96,
            margin: "0 0 24px",
          }}
        >
          {INTRO_HEADING.map((word, i) => (
            <motion.span
              key={i}
              variants={headingWord}
              aria-hidden="true"
              style={{
                display: "inline-block",
                marginRight: i < INTRO_HEADING.length - 1 ? "0.26em" : 0,
                willChange: "transform, filter",
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          variants={introItem}
          style={{
            fontSize: 17, color: "var(--color-muted)",
            lineHeight: 1.6, maxWidth: 460, margin: "0 auto 40px",
          }}
        >
          Eight sources of truth, one company brain. Scroll to see how Orchestra assembles itself.
        </motion.p>

        <motion.div
          variants={introItem}
          style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
          }}
        >
          {/* mouse outline with a falling wheel dot */}
          <span
            aria-hidden="true"
            style={{
              width: 24, height: 38, borderRadius: 14,
              border: "1.5px solid var(--color-muted)",
              display: "flex", justifyContent: "center", paddingTop: 7,
              opacity: 0.55,
            }}
          >
            <motion.span
              style={{
                width: 3, height: 7, borderRadius: 3,
                background: "var(--color-accent)",
              }}
              animate={{ y: [0, 10, 0], opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)", fontSize: 10,
              letterSpacing: "0.22em", textTransform: "uppercase",
              color: "var(--color-muted)",
            }}
          >
            Scroll
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── Outro / transition section ───────────────────────────────────────────────
function OutroSection() {
  return (
    <div style={{
      height: `${OUTRO_VH}vh`,
      display: "flex", alignItems: "center", justifyContent: "center",
      pointerEvents: "none",
    }}>
      <motion.div
        style={{ textAlign: "center", maxWidth: 560 }}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: E }}
      >
        <p style={{
          fontFamily: "var(--font-mono)", fontSize: 11,
          letterSpacing: "0.26em", textTransform: "uppercase",
          color: "var(--color-accent)", margin: "0 0 16px",
        }}>
          All sources connected
        </p>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(52px, 7vw, 88px)",
          fontWeight: 400, textTransform: "uppercase",
          color: "var(--color-ink)", lineHeight: 0.96,
          margin: "0 0 20px",
        }}>
          Now it&apos;s a brain.
        </h2>
        <p style={{
          fontSize: 17, color: "var(--color-muted)",
          lineHeight: 1.6, maxWidth: 440, margin: "0 auto 36px",
        }}>
          Every signal, in one source of truth. But that&apos;s just the beginning.
        </p>
        <p style={{
          fontFamily: "var(--font-mono)", fontSize: 11,
          letterSpacing: "0.18em", textTransform: "uppercase",
          color: "var(--color-muted)", margin: 0,
        }}>
          Continue ↓
        </p>
      </motion.div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
interface Act1Props {
  onSectionChange?: (index: number) => void; // -1=intro, 0-7=sources, 8=outro
}

export default function Act1Convergence({ onSectionChange }: Act1Props) {
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const [litRays,  setLitRays]  = useState<SourceKey[]>([]);
  const [currentSection, setCurrentSection] = useState(-1);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    // Which rays are lit (past their midpoint threshold)?
    const lit = SOURCES
      .filter((_, i) => p > RAY_MID[i])
      .map(s => s.key) as SourceKey[];
    setLitRays(lit);

    // Which section are we in?
    let sec = -1;
    for (let i = 0; i < SOURCES.length; i++) {
      const start = INTRO_F + i * SRC_F;
      const end   = start + SRC_F;
      if (p >= start && p < end) { sec = i; break; }
    }
    const outro = p >= (INTRO_F + SOURCES.length * SRC_F);
    setCurrentSection(sec);
    onSectionChange?.(outro ? 8 : sec);
  });

  const glowInt = litRays.length / 8;

  // ── Reduced-motion / mobile: skip the sticky layout ──────────────────────
  if (reduceMotion) {
    return (
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px var(--pad)" }}>
        <IntroSection />
        {SOURCES.map((src, i) => (
          <div key={src.key} style={{ padding: "40px 0" }}>
            <SourceContent source={src} index={i} visible />
          </div>
        ))}
        <OutroSection />
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      style={{ position: "relative", height: `${TOTAL_VH}vh` }}
    >
      {/* ── Layer 1: Sticky logo (always centered, behind content) ── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
          pointerEvents: "none",
          background: "var(--color-cream)",
        }}
      >
        <OrchestraLogo
          size={460}
          activeRays={litRays}
          glowIntensity={glowInt}
        />
      </div>

      {/* ── Layer 2: Content overlay — pulled back to start at top ── */}
      <div style={{ position: "relative", zIndex: 2, marginTop: "-100vh" }}>

        {/* INTRO — 100vh, centered, transparent bg so logo shows */}
        <IntroSection />

        {/* 8 SOURCE SECTIONS — 60vh each, alternating sides */}
        {SOURCES.map((source, i) => {
          const isEven = i % 2 === 0;
          const connectedNow = currentSection === i && litRays.includes(source.key as SourceKey);

          return (
            <div
              key={source.key}
              style={{
                height: `${SOURCE_VH}vh`,
                display: "flex",
                alignItems: "center",
                // Alternate: even = left 40vw, odd = right 40vw
                // Use paddingLeft/Right to push content away from logo center
                ...(isEven
                  ? { paddingLeft: "5vw",  paddingRight: "52vw" }
                  : { paddingLeft: "52vw", paddingRight: "5vw"  }),
              }}
            >
              <SourceContent
                source={source}
                index={i}
                visible={connectedNow}
              />
            </div>
          );
        })}

        {/* OUTRO — 80vh, centered */}
        <OutroSection />
      </div>
    </div>
  );
}
