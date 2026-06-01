"use client";

import { useEffect, useRef, useState } from "react";

// Only uppercase + numbers + punctuation — matches Bebas Neue's heavy style.
const POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*+=?/~";

interface Props {
  text: string;
  startDelay?: number;  // ms before scramble begins
  duration?: number;    // ms to fully resolve
}

/**
 * Character-scramble reveal.
 * Each character cycles through random chars from POOL, then resolves to its
 * real value. Resolution sweeps left-to-right with a probabilistic tail.
 * SSR-safe: renders final text on server, animates after hydration.
 */
export default function ScrambleText({ text, startDelay = 0, duration = 900 }: Props) {
  // Start with final text to avoid hydration mismatch.
  const [chars, setChars] = useState<string[]>(() => text.split(""));
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const final = text.split("");
    const start = performance.now() + startDelay;
    let lastNow = 0;

    const tick = (now: number) => {
      lastNow = now;
      const elapsed = Math.max(0, now - start);
      const t = elapsed / duration;

      const next = final.map((ch, i) => {
        if (ch === " ") return " ";
        // Each char has a resolve window spread across t = 0.05 … 1.0
        const resolveAt = 0.05 + (i / Math.max(1, final.length - 1)) * 0.8;
        if (t >= resolveAt + 0.18) return ch;          // locked in
        if (t < resolveAt - 0.05) {                    // still scrambling
          return POOL[Math.floor(now / 55 + i * 17) % POOL.length];
        }
        // Transition window: probabilistically resolve
        const p = (t - (resolveAt - 0.05)) / 0.23;
        return Math.random() < p * p
          ? ch
          : POOL[Math.floor(now / 55 + i * 17) % POOL.length];
      });

      setChars(next);

      if (t < 1.4) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setChars(final); // ensure clean final state
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [text, startDelay, duration]);

  return (
    <span
      aria-label={text}
      className="scramble-text"
      style={{ display: "inline", whiteSpace: "pre" }}
    >
      {chars.join("")}
    </span>
  );
}
