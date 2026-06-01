"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import Mark from "./Mark";

const SOURCES = [
  { name: "Slack",  x: 127, y: 140 },
  { name: "GitHub", x: 473, y: 140 },
  { name: "Gmail",  x: 473, y: 340 },
  { name: "Linear", x: 300, y: 440 },
  { name: "Notion", x: 127, y: 340 },
  { name: "Drive",  x: 300, y:  40 },
];

const CENTER = { x: 300, y: 240 };

interface ParticleProps {
  source: { x: number; y: number };
  delay: number;
  reduced: boolean;
}

function Particle({ source, delay, reduced }: ParticleProps) {
  if (reduced) return null;

  return (
    <motion.circle
      r={3}
      fill="var(--color-accent)"
      initial={{ cx: source.x, cy: source.y, opacity: 0 }}
      animate={{
        cx: [source.x, source.x * 0.6 + CENTER.x * 0.4, CENTER.x],
        cy: [source.y, source.y * 0.6 + CENTER.y * 0.4, CENTER.y],
        opacity: [0, 0.9, 0.9, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

export default function HeroFlow() {
  const reduced = useReducedMotion() ?? false;

  return (
    <div
      style={{
        width: "100%",
        height: "480px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      className="max-sm:h-[280px]"
    >
      <svg
        viewBox="0 0 600 480"
        preserveAspectRatio="xMidYMid meet"
        style={{ width: "100%", height: "100%" }}
        aria-hidden="true"
      >
        {/* Dotted connector lines */}
        {SOURCES.map((src) => (
          <line
            key={`line-${src.name}`}
            x1={src.x}
            y1={src.y}
            x2={CENTER.x}
            y2={CENTER.y}
            stroke="var(--color-accent)"
            strokeWidth={1.5}
            strokeDasharray="4 8"
            opacity={0.3}
          />
        ))}

        {/* Particles */}
        {SOURCES.map((src, i) => (
          <React.Fragment key={`particles-${src.name}`}>
            <Particle source={src} delay={i * 0.5} reduced={reduced} />
            <Particle source={src} delay={i * 0.5 + 1.5} reduced={reduced} />
          </React.Fragment>
        ))}

        {/* Source label pills */}
        {SOURCES.map((src) => (
          <g key={`label-${src.name}`}>
            <rect
              x={src.x - 36}
              y={src.y - 12}
              width={72}
              height={24}
              rx={12}
              fill="var(--color-paper)"
              stroke="var(--color-accent)"
              strokeOpacity={0.3}
            />
            <text
              x={src.x}
              y={src.y + 4}
              textAnchor="middle"
              fontSize={11}
              fontFamily="var(--font-mono, monospace)"
              fill="var(--color-muted)"
            >
              {src.name}
            </text>
          </g>
        ))}

        {/* Center Orchestra mark */}
        <motion.g
          animate={reduced ? {} : { scale: [1, 1.03, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ originX: "300px", originY: "240px" }}
        >
          {/* Background rect */}
          <rect
            x={CENTER.x - 40}
            y={CENTER.y - 40}
            width={80}
            height={80}
            rx={20}
            fill="var(--color-accent)"
          />

          <foreignObject
            x={CENTER.x - 20}
            y={CENTER.y - 26}
            width={40}
            height={52}
          >
            <div
              // @ts-expect-error xmlns needed for SVG foreignObject
              xmlns="http://www.w3.org/1999/xhtml"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                color: "#fff",
                fontSize: 40,
              }}
            >
              <Mark tone="light" />
            </div>
          </foreignObject>
        </motion.g>
      </svg>
    </div>
  );
}
