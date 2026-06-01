"use client"

import React, { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

/**
 * DarkModeToggle
 *
 * Pill-shaped track with a sliding "thumb" that morphs between a sun and a
 * crescent moon. Inline SVG icons (no lucide dependency for this component)
 * so we can shape strokes precisely and animate sun rays / moon notch.
 *
 * - Track: subtle inset with a soft accent glow on hover.
 * - Thumb: glassy circle that translates across, rotates 360° on toggle.
 * - Icon: cross-fades with rotation + scale via AnimatePresence.
 * - Background "stars" appear when dark.
 */
export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [hover, setHover] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("orchestra-theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const dark = stored ? stored === "dark" : prefersDark
    setIsDark(dark)
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light")
    setMounted(true)
  }, [])

  const toggle = () => {
    const next = !isDark
    setIsDark(next)
    const theme = next ? "dark" : "light"
    localStorage.setItem("orchestra-theme", theme)
    document.documentElement.setAttribute("data-theme", theme)
  }

  // Tokens
  const TRACK_W = 58
  const TRACK_H = 28
  const PAD = 3
  const THUMB = TRACK_H - PAD * 2

  const trackBg = isDark
    ? "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))"
    : "linear-gradient(135deg, rgba(20,20,19,0.04), rgba(20,20,19,0.08))"

  const trackBorder = isDark
    ? "1px solid rgba(255,255,255,0.14)"
    : "1px solid rgba(20,20,19,0.10)"

  const trackShadow = hover
    ? isDark
      ? "inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 3px rgba(217,119,87,0.18)"
      : "inset 0 1px 0 rgba(255,255,255,0.6), 0 0 0 3px rgba(217,119,87,0.16)"
    : isDark
    ? "inset 0 1px 0 rgba(255,255,255,0.06)"
    : "inset 0 1px 0 rgba(255,255,255,0.55)"

  return (
    <button
      onClick={toggle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        position: "relative",
        width: TRACK_W,
        height: TRACK_H,
        padding: 0,
        border: trackBorder,
        borderRadius: 999,
        background: trackBg,
        boxShadow: trackShadow,
        cursor: "pointer",
        transition:
          "background 0.35s ease, border-color 0.35s ease, box-shadow 0.25s ease",
        outline: "none",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* tiny stars — only visible in dark mode */}
      <motion.span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 999,
          overflow: "hidden",
          pointerEvents: "none",
        }}
        animate={{ opacity: isDark ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        {[
          { top: 6, left: 10, size: 2 },
          { top: 14, left: 18, size: 1.5 },
          { top: 9, left: 24, size: 1 },
        ].map((s, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.7)",
            }}
          />
        ))}
      </motion.span>

      {/* sliding thumb */}
      <motion.span
        aria-hidden
        animate={{
          x: mounted ? (isDark ? TRACK_W - THUMB - PAD : PAD) : PAD,
          rotate: isDark ? 360 : 0,
        }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
        style={{
          position: "absolute",
          top: PAD,
          left: 0,
          width: THUMB,
          height: THUMB,
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle at 30% 30%, #FAF7F1 0%, #D6CFC2 100%)"
            : "radial-gradient(circle at 30% 30%, #FFE6B8 0%, #D97757 100%)",
          boxShadow: isDark
            ? "0 2px 8px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.4)"
            : "0 2px 8px rgba(217,119,87,0.45), inset 0 0 0 1px rgba(255,255,255,0.6)",
          display: "grid",
          placeItems: "center",
          willChange: "transform",
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.svg
              key="moon"
              width={12}
              height={12}
              viewBox="0 0 24 24"
              fill="none"
              initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              <path
                d="M20 14.5A8 8 0 0 1 9.5 4a0.5 0.5 0 0 0-0.7-0.6A10 10 0 1 0 20.6 15.2a0.5 0.5 0 0 0-0.6-0.7z"
                fill="#141413"
              />
            </motion.svg>
          ) : (
            <motion.svg
              key="sun"
              width={14}
              height={14}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              <circle cx="12" cy="12" r="4" fill="#fff" stroke="none" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="M4.93 4.93l1.41 1.41" />
              <path d="M17.66 17.66l1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="M4.93 19.07l1.41-1.41" />
              <path d="M17.66 6.34l1.41-1.41" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.span>
    </button>
  )
}
