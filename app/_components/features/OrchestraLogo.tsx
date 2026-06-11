"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export type SourceKey =
  | "docs" | "slack" | "gmail" | "github"
  | "calendar" | "transcripts" | "linear" | "notion";

export const RAYS_META = [
  { key: "docs" as SourceKey, angle: 0 },
  { key: "slack" as SourceKey, angle: 45 },
  { key: "gmail" as SourceKey, angle: 90 },
  { key: "github" as SourceKey, angle: 135 },
  { key: "calendar" as SourceKey, angle: 180 },
  { key: "transcripts" as SourceKey, angle: 225 },
  { key: "linear" as SourceKey, angle: 270 },
  { key: "notion" as SourceKey, angle: 315 },
];

const CX = 240;
const CY = 240;
const INNER = 50;
const OUTER = 230;
const SW = 28;

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

export interface OrchestraLogoProps {
  size?: number;
  activeRays?: SourceKey[];
  glowIntensity?: number;
  className?: string;
}

export default function OrchestraLogo({
  size = 480,
  activeRays = [],
  glowIntensity = 0,
  className,
}: OrchestraLogoProps) {
  const prevCount = useRef(0);
  const [pulse, setPulse] = useState(0);
  const allLit = activeRays.length === 8;

  useEffect(() => {
    const n = activeRays.length;
    if (n > prevCount.current) setPulse((p) => p + 1);
    prevCount.current = n;
  }, [activeRays.length]);

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 480 480"
      fill="none"
      style={{ overflow: "visible" }}
      aria-hidden="true"
    >
      <defs>
        <filter id="feat-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {glowIntensity > 0 && (
        <motion.circle
          cx={CX}
          cy={CY}
          r={24 + glowIntensity * 10}
          fillOpacity={0.2 + glowIntensity * 0.2}
          animate={{
            r: 24 + glowIntensity * 10,
            fillOpacity: 0.2 + glowIntensity * 0.2,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          fill="#d97757"
          className={allLit ? "orch-glow-breathing" : ""}
        />
      )}

      {pulse > 0 && (
        <motion.circle
          key={`pulse-${pulse}`}
          cx={CX}
          cy={CY}
          r={28}
          fill="#d97757"
          initial={{ scale: 1, fillOpacity: 0.55 }}
          animate={{ scale: 2, fillOpacity: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          style={{ originX: CX, originY: CY }}
        />
      )}

      {RAYS_META.map(({ key, angle }, i) => {
        const r = toRad(angle);
        const x1 = CX + Math.cos(r) * INNER;
        const y1 = CY - Math.sin(r) * INNER;
        const x2 = CX + Math.cos(r) * OUTER;
        const y2 = CY - Math.sin(r) * OUTER;
        const isOn = activeRays.includes(key);

        return (
          <motion.line
            key={key}
            id={`feat-ray-${key}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            strokeWidth={SW}
            strokeLinecap="round"
            filter={isOn ? "url(#feat-glow)" : undefined}
            initial={{ strokeOpacity: 0, stroke: "#A8A29A" }}
            animate={{
              stroke: isOn ? "#d97757" : "#A8A29A",
              strokeOpacity: isOn ? 1 : 0.22,
            }}
            transition={{
              stroke: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
              strokeOpacity: { duration: 0.6 },
              delay: i * 0.06,
            }}
          />
        );
      })}

      <motion.circle
        cx={CX}
        cy={CY}
        r={12}
        fillOpacity={0.18 + glowIntensity * 0.82}
        animate={{
          fill: glowIntensity > 0 ? "#d97757" : "#A8A29A",
          fillOpacity: 0.18 + glowIntensity * 0.82,
        }}
        transition={{ duration: 0.5 }}
      />
    </svg>
  );
}
