"use client";

import { memo, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export type StepId = "connect" | "structure" | "ask";

const STEPS: { id: StepId; label: string; n: string }[] = [
  { id: "connect",   label: "Connect",   n: "1" },
  { id: "structure", label: "Structure", n: "2" },
  { id: "ask",       label: "Ask",       n: "3" },
];

interface Props {
  active: StepId;
  onChange: (id: StepId) => void;
}

function StepTabsImpl({ active, onChange }: Props) {
  const groupRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<StepId, HTMLButtonElement | null>>({
    connect: null,
    structure: null,
    ask: null,
  });
  const [thumb, setThumb] = useState<{ left: number; width: number } | null>(null);

  // Measure the active tab to position the indicator. Runs in a layout effect
  // plus a rAF (so the first measure happens after fonts/flex have settled) and
  // re-measures on active change, container resize, and window resize.
  useLayoutEffect(() => {
    let raf = 0;
    const measure = () => {
      const btn = tabRefs.current[active];
      const group = groupRef.current;
      if (!btn || !group) return;
      const g = group.getBoundingClientRect();
      const b = btn.getBoundingClientRect();
      if (b.width === 0) return; // not laid out yet — wait for rAF
      setThumb({ left: b.left - g.left, width: b.width });
    };
    measure();
    raf = requestAnimationFrame(measure);

    const ro = new ResizeObserver(measure);
    if (groupRef.current) ro.observe(groupRef.current);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [active]);

  const onKey = (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = (idx + dir + STEPS.length) % STEPS.length;
    const id = STEPS[next].id;
    onChange(id);
    tabRefs.current[id]?.focus();
  };

  return (
    <div ref={groupRef} role="tablist" aria-label="Getting started steps" className="gs-tabs">
      {thumb && (
        <motion.span
          aria-hidden="true"
          className="gs-tab-thumb"
          initial={false}
          animate={{ left: thumb.left, width: thumb.width }}
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        />
      )}
      {STEPS.map((s, i) => {
        const isActive = s.id === active;
        return (
          <button
            key={s.id}
            ref={(el) => { tabRefs.current[s.id] = el; }}
            type="button"
            role="tab"
            id={`gs-tab-${s.id}`}
            aria-selected={isActive}
            aria-controls={`gs-panel-${s.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(s.id)}
            onKeyDown={(e) => onKey(e, i)}
            className={`gs-tab${isActive ? " is-active" : ""}`}
          >
            <span className="gs-tab-num" aria-hidden="true">{s.n}</span>
            <span className="gs-tab-label">{s.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default memo(StepTabsImpl);
