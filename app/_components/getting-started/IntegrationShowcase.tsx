"use client";

import { memo, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import Mark from "../Mark";
import { INTEGRATIONS } from "./integrations";
import IntegrationCard from "./IntegrationCard";

const EASE = [0.22, 1, 0.36, 1] as const;

// Core sits on the right; sources fan down the left edge. Coordinates are a
// percentage of the container (SVG uses preserveAspectRatio="none"), so no
// runtime measurement is needed — the layout is fully deterministic.
const CORE = { x: 79, y: 50 };
const SOURCE_X = 13;

function IntegrationShowcaseImpl() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-100px" });

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Evenly spread the sources down the left edge.
  const points = useMemo(
    () =>
      INTEGRATIONS.map((_, i) => ({
        x: SOURCE_X,
        y: 8 + (i * 84) / (INTEGRATIONS.length - 1),
      })),
    []
  );

  // Auto-advance — only when visible, not paused, and motion is allowed.
  useEffect(() => {
    if (paused || reduce || !inView) return;
    const id = setInterval(
      () => setActive((a) => (a + 1) % INTEGRATIONS.length),
      2200
    );
    return () => clearInterval(id);
  }, [paused, reduce, inView]);

  const integration = INTEGRATIONS[active];

  return (
    <div
      role="tabpanel"
      id="gs-panel-connect"
      aria-labelledby="gs-tab-connect"
      onMouseLeave={() => setPaused(false)}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <span className="gs-stage-pill">
          <span className="gs-stage-pill-dot" aria-hidden="true" />
          {INTEGRATIONS.length} live integrations
        </span>
        <span className="gs-convo-status" aria-live="polite">
          Syncing · {integration.name}
        </span>
      </header>

      <div className="gs-conv" ref={ref}>
        <svg
          className="gs-conv-beams"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="gs-conv-flow"
              gradientUnits="userSpaceOnUse"
              x1={points[active].x}
              y1={points[active].y}
              x2={CORE.x}
              y2={CORE.y}
            >
              <stop offset="0%" stopColor="rgba(217,119,87,0)" />
              <stop offset="55%" stopColor="rgba(217,119,87,0.9)" />
              <stop offset="100%" stopColor="#b85c3e" />
            </linearGradient>
          </defs>

          {/* Always-on streaming beams — every source feeds the brain. */}
          {points.map((p, i) => (
            <line
              key={`beam-${i}`}
              x1={p.x}
              y1={p.y}
              x2={CORE.x}
              y2={CORE.y}
              pathLength={100}
              vectorEffect="non-scaling-stroke"
              className={`gs-conv-beam${i === active ? " is-active" : ""}`}
              style={{ animationDelay: `${(i * 0.4).toFixed(2)}s` } as CSSProperties}
            />
          ))}

          {/* Bright sweep that establishes the active connection. */}
          <motion.line
            key={`flow-${active}`}
            x1={points[active].x}
            y1={points[active].y}
            x2={CORE.x}
            y2={CORE.y}
            stroke="url(#gs-conv-flow)"
            vectorEffect="non-scaling-stroke"
            className="gs-conv-sweep"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: EASE }}
          />

          {/* Data packet riding the active beam into the core. */}
          {!reduce && inView && (
            <motion.circle
              key={`packet-${active}`}
              r={1.7}
              className="gs-conv-packet"
              initial={{ cx: points[active].x, cy: points[active].y, opacity: 0 }}
              animate={{
                cx: [points[active].x, CORE.x],
                cy: [points[active].y, CORE.y],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 1.4,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 0.2,
                delay: 0.25,
              }}
            />
          )}
        </svg>

        {/* Pulse that ripples out of the core when a packet lands. */}
        {!reduce && inView && (
          <motion.span
            key={`core-pulse-${active}`}
            className="gs-conv-core-pulse"
            aria-hidden="true"
            initial={{ opacity: 0.5, scale: 0.5 }}
            animate={{ opacity: 0, scale: 2.1 }}
            transition={{ duration: 1.4, ease: "easeOut", repeat: Infinity }}
          />
        )}

        {/* Source chips down the left edge. */}
        {INTEGRATIONS.map((t, i) => (
          <motion.span
            key={t.id}
            className="gs-conv-chip-slot"
            style={{ left: `${points[i].x}%`, top: `${points[i].y}%` }}
            initial={reduce ? false : { opacity: 0, x: "-50%", y: "-50%", scale: 0.4 }}
            animate={
              inView
                ? { opacity: 1, x: "-50%", y: "-50%", scale: 1 }
                : { opacity: 0, x: "-50%", y: "-50%", scale: 0.4 }
            }
            transition={{ type: "spring", stiffness: 320, damping: 20, delay: 0.15 + i * 0.05 }}
          >
            <button
              type="button"
              className={`gs-conv-chip${i === active ? " is-active" : ""}`}
              onMouseEnter={() => {
                setActive(i);
                setPaused(true);
              }}
              onFocus={() => {
                setActive(i);
                setPaused(true);
              }}
              onClick={() => setActive(i)}
              onBlur={() => setPaused(false)}
              aria-label={`${t.name} — ${t.detail}`}
              aria-pressed={i === active}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="gs-conv-chip-img" src={t.src} alt="" loading="lazy" draggable={false} />
              <span className="gs-conv-chip-dot" aria-hidden="true" />
            </button>
          </motion.span>
        ))}

        {/* Orchestra core — the unified company brain. */}
        <div className="gs-conv-core" style={{ left: `${CORE.x}%`, top: `${CORE.y}%` }}>
          <span className="gs-conv-core-ring" aria-hidden="true" />
          <span className="gs-conv-core-ring gs-conv-core-ring-2" aria-hidden="true" />
          <motion.div
            className="gs-conv-core-orb"
            initial={reduce ? false : { scale: 0.7, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
          >
            <span className="gs-conv-core-shimmer" aria-hidden="true" />
            <Mark tone="light" />
          </motion.div>
          <span className="gs-conv-core-label" aria-hidden="true">
            Company brain
          </span>
        </div>
      </div>

      <IntegrationCard key={integration.id} integration={integration} />
    </div>
  );
}

export default memo(IntegrationShowcaseImpl);
