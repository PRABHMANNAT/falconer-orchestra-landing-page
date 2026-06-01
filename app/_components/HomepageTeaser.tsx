"use client";

import Link from "next/link";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { useRef } from "react";
import Mark from "./Mark";

export default function HomepageTeaser() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const reducedMotion = useReducedMotion();

  return (
    <motion.section
      ref={sectionRef}
      animate={
        isInView
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 40 }
      }
      initial={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: "100%",
        background: "var(--color-cream)",
        borderTop: "1px solid var(--color-line)",
        padding: "clamp(80px, 10vw, 120px) var(--pad)",
        textAlign: "center",
      }}
    >
      {/* Eyebrow */}
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--color-accent)",
          marginBottom: 20,
          marginTop: 0,
        }}
      >
        THE FEATURES PAGE
      </p>

      {/* Headline */}
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(52px, 7vw, 96px)",
          color: "var(--color-ink)",
          lineHeight: 0.96,
          textTransform: "uppercase",
          margin: "0 0 20px",
        }}
      >
        WATCH IT COME TOGETHER.
      </h2>

      {/* Subtitle */}
      <p
        style={{
          maxWidth: 500,
          margin: "0 auto 52px",
          fontSize: 18,
          color: "var(--color-muted)",
          lineHeight: 1.6,
        }}
      >
        Eight sources. One brain. See the convergence in motion.
      </p>

      {/* Animated Logo */}
      <motion.div
        animate={
          isInView
            ? { opacity: 1, scale: 1 }
            : { opacity: 0, scale: 0.85 }
        }
        initial={{ opacity: 0, scale: 0.85 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        style={{ display: "inline-block" }}
      >
        <motion.div
          animate={
            reducedMotion
              ? {}
              : { scale: [0.98, 1.01, 0.98] }
          }
          transition={
            reducedMotion
              ? {}
              : { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }
          style={{ display: "inline-block" }}
        >
          <div
            aria-hidden="true"
            style={{
              width: 280,
              height: 280,
              display: "grid",
              placeItems: "center",
              color: "#d97757",
              fontSize: 220,
            }}
          >
            <Mark tone="dark" />
          </div>
        </motion.div>
      </motion.div>

      {/* CTA Link */}
      <div style={{ marginTop: 40 }}>
        <Link
          href="/features"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            fontFamily: "var(--font-mono)",
            fontSize: 18,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--color-accent)",
            textDecoration: "none",
            borderBottom: "2px solid var(--color-accent)",
            paddingBottom: 3,
            transition: "gap 0.2s ease, color 0.2s ease",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.gap = "16px";
            el.style.color = "var(--color-accent-deep)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.gap = "10px";
            el.style.color = "var(--color-accent)";
          }}
        >
          SEE IT ALL CONVERGE →
        </Link>
      </div>
    </motion.section>
  );
}
