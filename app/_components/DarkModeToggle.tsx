"use client"

import React, { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("orchestra-theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const dark = stored ? stored === "dark" : prefersDark
    setIsDark(dark)
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light")
  }, [])

  const toggle = () => {
    const next = !isDark
    setIsDark(next)
    const theme = next ? "dark" : "light"
    localStorage.setItem("orchestra-theme", theme)
    document.documentElement.setAttribute("data-theme", theme)
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        border: isDark
          ? "1px solid rgba(255,255,255,0.2)"
          : "1px solid var(--color-line)",
        background: "transparent",
        cursor: "pointer",
        transition: "background 0.2s, border-color 0.2s",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.background = isDark
          ? "rgba(255,255,255,0.1)"
          : "rgba(0,0,0,0.06)"
        el.style.borderColor = isDark
          ? "rgba(255,255,255,0.2)"
          : "var(--color-accent)"
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.background = "transparent"
        el.style.borderColor = isDark
          ? "rgba(255,255,255,0.2)"
          : "var(--color-line)"
      }}
    >
      {isDark ? (
        <Sun size={16} color="var(--color-muted)" />
      ) : (
        <Moon size={16} color="var(--color-muted)" />
      )}
    </button>
  )
}
