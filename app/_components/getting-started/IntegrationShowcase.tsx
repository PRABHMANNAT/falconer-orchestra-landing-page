"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import Mark from "../Mark";
import { INTEGRATIONS } from "./integrations";
import IntegrationCard from "./IntegrationCard";

const RADIUS = 38;
const EASE = [0.22, 1, 0.36, 1] as const;

function IntegrationShowcaseImpl() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-100px" });

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Deterministic orbit positions in a 0–100 square coordinate space.
  const points = useMemo(
    () =>
      INTEGRATIONS.map((_, i) => {
        const a = (i / INTEGRATIONS.length) * Math.PI * 2 - Math.PI / 2;
        return { x: 50 + RADIUS * Math.cos(a), y: 50 + RADIUS * Math.sin(a) };
      }),
    []
  );

  // Auto-advance — only when visible, not paused, and motion is allowed.
  useEffect(() => {
    if (paused || reduce || !inView) return;
    const id = setInterval(() => setActive((a) => (a + 1) % INTEGRATIONS.length), 2400);
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
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}
      >
        <span className="gs-stage-pill">
          <span className="gs-stage-pill-dot" aria-hidden="true" />
          {INTEGRATIONS.length} live integrations
        </span>
        <span
          className="gs-convo-status"
          aria-live="polite"
        >
          Now · {integration.name}
        </span>
      </header>

      <div className="gs-orbit" ref={ref}>
        <span className="gs-orbit-ring" aria-hidden="true" />

        <svg className="gs-orbit-beams" viewBox="0 0 100 100" aria-hidden="true">
          <defs>
            <linearGradient
              id="gs-flow"
              gradientUnits="userSpaceOnUse"
              x1={points[active].x}
              y1={points[active].y}
              x2={50}
              y2={50}
            >
              <stop offset="0%" stopColor="rgba(217,119,87,0)" />
              <stop offset="50%" stopColor="rgba(217,119,87,0.9)" />
              <stop offset="100%" stopColor="#b85c3e" />
            </linearGradient>
          </defs>
          {points.map((p, i) => (
            <line
              key={i}
              x1={p.x}
              y1={p.y}
              x2={50}
              y2={50}
              vectorEffect="non-scaling-stroke"
              className={`gs-wire${i === active ? " is-active" : ""}`}
            />
          ))}
          <motion.line
            key={active}
            x1={points[active].x}
            y1={points[active].y}
            x2={50}
            y2={50}
            stroke="url(#gs-flow)"
            vectorEffect="non-scaling-stroke"
            className="gs-flow"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.55, ease: EASE }}
          />
          {!reduce && inView && (
            <motion.circle
              key={`packet-${active}`}
              r={1.6}
              className="gs-packet"
              initial={{ cx: points[active].x, cy: points[active].y, opacity: 0 }}
              animate={{
                cx: [points[active].x, 50],
                cy: [points[active].y, 50],
                opacity: [0, 1, 1, 0],
              }}
              transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.2, delay: 0.3 }}
            />
          )}
        </svg>

        {!reduce && inView && (
          <motion.span
            key={`halo-${active}`}
            className="gs-active-halo"
            aria-hidden="true"
            style={{ left: `${points[active].x}%`, top: `${points[active].y}%` }}
            initial={{ opacity: 0.55, scale: 0.6 }}
            animate={{ opacity: 0, scale: 1.9 }}
            transition={{ duration: 1.2, ease: "easeOut", repeat: Infinity }}
          />
        )}

        {INTEGRATIONS.map((t, i) => (
          <motion.span
            key={t.id}
            className="gs-node-slot"
            style={{ left: `${points[i].x}%`, top: `${points[i].y}%` }}
            initial={reduce ? false : { opacity: 0, scale: 0.2 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.2 }}
            transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.2 + i * 0.06 }}
          >
            <motion.button
              type="button"
              className={`gs-node${i === active ? " is-active" : ""}`}
              onMouseEnter={() => { setActive(i); setPaused(true); }}
              onFocus={() => { setActive(i); setPaused(true); }}
              onClick={() => setActive(i)}
              onBlur={() => setPaused(false)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.94 }}
              animate={{ scale: i === active ? 1.14 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              aria-label={`${t.name} — ${t.detail}`}
              aria-pressed={i === active}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="gs-node-img" src={t.src} alt="" loading="lazy" draggable={false} />
            </motion.button>
          </motion.span>
        ))}

        {/* Rotating core — disabled under reduced motion. */}
        <motion.div
          className="gs-orbit-core"
          animate={reduce ? undefined : { rotate: 360 }}
          transition={reduce ? undefined : { duration: 28, repeat: Infinity, ease: "linear" }}
        >
          <span className="gs-orbit-core-shimmer" aria-hidden="true" />
          {/* Counter-rotate so the Mark stays upright */}
          <motion.div
            animate={reduce ? undefined : { rotate: -360 }}
            transition={reduce ? undefined : { duration: 28, repeat: Infinity, ease: "linear" }}
            style={{ display: "grid", placeItems: "center", width: "52%", height: "52%" }}
          >
            <Mark tone="light" />
          </motion.div>
        </motion.div>
      </div>

      <IntegrationCard key={integration.id} integration={integration} />
    </div>
  );
}

export default memo(IntegrationShowcaseImpl);
