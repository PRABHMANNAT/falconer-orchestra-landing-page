"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SOURCES = [
  { key: "docs", label: "Docs / Specs / PDFs" },
  { key: "slack", label: "Slack Channels" },
  { key: "gmail", label: "Every Email" },
  { key: "github", label: "GitHub Commits + PRs" },
  { key: "calendar", label: "Google Calendar" },
  { key: "transcripts", label: "Meeting Transcripts" },
  { key: "linear", label: "Linear Issues" },
  { key: "notion", label: "Notion Workspaces" },
];

const CAPABILITIES = [
  { key: "cap-0", label: "Unified Search" },
  { key: "cap-1", label: "Smart Summaries" },
  { key: "cap-2", label: "Auto Actions" },
  { key: "cap-3", label: "Team Insights" },
];

interface SkipControlsProps {
  onSkip?: () => void;
  onJump?: (index: number) => void;
  visible?: boolean;
  activeIndex?: number;
}

export default function SkipControls({
  onSkip,
  onJump,
  visible = true,
  activeIndex,
}: SkipControlsProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      window.location.href = "/#pricing";
    }
  };

  const handleJump = (index: number) => {
    setMenuOpen(false);
    if (onJump) {
      onJump(index);
    }
  };

  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        overlayRef.current &&
        !overlayRef.current.contains(e.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  if (!visible) return null;

  const allSections = [...SOURCES, ...CAPABILITIES];

  return (
    <>
      {/* Skip to Pricing button — bottom-right */}
      <button
        onClick={handleSkip}
        style={{
          position: "fixed",
          bottom: 40,
          right: 32,
          zIndex: 50,
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(90,90,90,0.6)",
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          padding: "8px 14px",
          borderRadius: 999,
          border: "1px solid rgba(0,0,0,0.1)",
          cursor: "pointer",
          transition: "color 0.15s, border-color 0.15s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color =
            "var(--color-accent)";
          (e.currentTarget as HTMLButtonElement).style.borderColor =
            "var(--color-accent-tint)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color =
            "rgba(90,90,90,0.6)";
          (e.currentTarget as HTMLButtonElement).style.borderColor =
            "rgba(0,0,0,0.1)";
        }}
      >
        SKIP TO PRICING &rarr;
      </button>

      {/* Section Jump Menu button — top-right */}
      <button
        ref={menuButtonRef}
        onClick={() => setMenuOpen((prev) => !prev)}
        style={{
          position: "fixed",
          top: 90,
          right: 32,
          zIndex: 50,
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: menuOpen ? "var(--color-accent)" : "rgba(90,90,90,0.7)",
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          padding: "8px 14px",
          borderRadius: 999,
          border: `1px solid ${menuOpen ? "var(--color-accent-tint)" : "rgba(0,0,0,0.1)"}`,
          cursor: "pointer",
          transition: "color 0.15s, border-color 0.15s",
        }}
      >
        &#8801; MENU
      </button>

      {/* Overlay card */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{
              position: "fixed",
              top: 130,
              right: 32,
              zIndex: 50,
              background: "rgba(255,255,255,0.96)",
              borderRadius: 16,
              border: "1px solid var(--color-line)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              padding: 16,
              minWidth: 180,
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            }}
          >
            {/* Sources */}
            <div>
              {SOURCES.map((source, i) => (
                <div
                  key={source.key}
                  onClick={() => handleJump(i)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "background 0.15s",
                    color:
                      activeIndex === i
                        ? "var(--color-accent)"
                        : "var(--color-muted)",
                    fontWeight: activeIndex === i ? 600 : 400,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background =
                      "var(--color-accent-tint)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background =
                      "transparent";
                  }}
                >
                  {source.label}
                </div>
              ))}
            </div>

            {/* Divider */}
            <div
              style={{
                height: 1,
                background: "var(--color-line)",
                margin: "8px 0",
              }}
            />

            {/* Capabilities */}
            <div>
              {CAPABILITIES.map((cap, i) => {
                const globalIndex = SOURCES.length + i;
                return (
                  <div
                    key={cap.key}
                    onClick={() => handleJump(globalIndex)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 8,
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      transition: "background 0.15s",
                      color:
                        activeIndex === globalIndex
                          ? "var(--color-accent)"
                          : "var(--color-muted)",
                      fontWeight: activeIndex === globalIndex ? 600 : 400,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.background =
                        "var(--color-accent-tint)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.background =
                        "transparent";
                    }}
                  >
                    {cap.label}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
