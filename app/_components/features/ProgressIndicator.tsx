"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SOURCES } from "./types";

// --- Label arrays --------------------------------------------------------------

const SOURCE_LABELS = SOURCES.map((s) => s.label.toUpperCase());

const CAPABILITY_LABELS = ["SOCRATES", "SUGGESTIONS", "TIMELINE", "GROWTH"];

const ALL_LABELS = [...SOURCE_LABELS, ...CAPABILITY_LABELS]; // 12 entries

// --- Pulse keyframe -------------------------------------------------------------

const PULSE_STYLE_ID = "progress-indicator-pulse";

function injectPulseKeyframe() {
  if (typeof document === "undefined") return;
  if (document.getElementById(PULSE_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = PULSE_STYLE_ID;
  style.textContent = `
    @keyframes pi-pulse {
      0%   { box-shadow: 0 0 0 0 rgba(217,119,87,0.55); }
      60%  { box-shadow: 0 0 0 5px rgba(217,119,87,0); }
      100% { box-shadow: 0 0 0 0 rgba(217,119,87,0); }
    }
  `;
  document.head.appendChild(style);
}

// --- Types ----------------------------------------------------------------------

interface ProgressIndicatorProps {
  currentIndex: number; // 0–11
  visible: boolean;
}

// --- Component ------------------------------------------------------------------

export default function ProgressIndicator({
  currentIndex,
  visible,
}: ProgressIndicatorProps) {
  const injectedRef = useRef(false);

  useEffect(() => {
    if (!injectedRef.current) {
      injectPulseKeyframe();
      injectedRef.current = true;
    }
  }, []);

  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      style={{
        position: "fixed",
        top: "50%",
        left: 28,
        transform: "translateY(-50%)",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 0,
        pointerEvents: "none",
      }}
    >
      {/* Connector line - sits behind the dots */}
      <div
        style={{
          position: "absolute",
          left: 2,
          top: 3,
          width: 2,
          // Each row is 6px dot + 6px gap + 6px dot … height covers all 12 rows.
          // Row height = 6px dot + 8px gap = 14px; last row has no gap.
          height: 12 * 14 - 8,
          background:
            "linear-gradient(to bottom, var(--color-accent) 0%, transparent 100%)",
          borderRadius: 1,
          opacity: 0.35,
        }}
      />

      {/* Dot rows */}
      {ALL_LABELS.map((label, index) => {
        const isActive = index === currentIndex;
        const isCompleted = index < currentIndex;

        return (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              height: 14,
              position: "relative",
            }}
          >
            {/* Dot */}
            <motion.div
              animate={{
                scale: isActive ? 1.4 : 1,
                backgroundColor: isActive
                  ? "var(--color-accent)"
                  : isCompleted
                  ? "rgba(217,119,87,0.6)"
                  : "rgba(168,162,154,0.4)",
              }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                flexShrink: 0,
                animation: isActive ? "pi-pulse 1.6s ease-out infinite" : "none",
              }}
            />

            {/* Label - only the active label is visible */}
            <AnimatePresence initial={false}>
              {isActive && (
                <motion.span
                  key={label}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -4 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--color-accent)",
                    whiteSpace: "nowrap",
                    lineHeight: 1,
                    userSelect: "none",
                  }}
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </motion.div>
  );
}
