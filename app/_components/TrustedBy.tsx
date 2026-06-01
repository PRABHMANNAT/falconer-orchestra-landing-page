"use client";

import { motion } from "framer-motion";

/* ----- Inline minimal logos (24×24, currentColor) -------------------- */

function CompassMark() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none">
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 4l2.4 7L12 20l-2.4-9L12 4z" fill="currentColor" />
    </svg>
  );
}

function BloomMark() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <g fill="currentColor">
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <ellipse
            key={deg}
            cx="12"
            cy="6.5"
            rx="2.2"
            ry="4.2"
            transform={`rotate(${deg} 12 12)`}
            opacity="0.85"
          />
        ))}
        <circle cx="12" cy="12" r="1.8" fill="currentColor" />
      </g>
    </svg>
  );
}

function AcornMark() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none">
      <path
        d="M5 9 Q12 4 19 9 Z"
        fill="currentColor"
        opacity="0.85"
      />
      <path
        d="M6 10 Q12 21 18 10 Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill="none"
      />
      <line x1="12" y1="3" x2="12" y2="6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function SherlockMark() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none">
      <circle cx="10.5" cy="10.5" r="6" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="10.5" cy="10.5" r="2.3" fill="currentColor" />
      <line
        x1="15"
        y1="15"
        x2="20"
        y2="20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StarMark() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        d="M12 2 L14.3 9 L21.5 9.5 L15.8 13.7 L17.9 21 L12 16.7 L6.1 21 L8.2 13.7 L2.5 9.5 L9.7 9 Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ThatchMark() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none">
      <path
        d="M3 18 L8 6 L13 18 M9 18 L14 6 L19 18 M15 18 L20 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const COMPANIES = [
  { name: "Northwind", Logo: CompassMark },
  { name: "BloomFast", Logo: BloomMark },
  { name: "Acorn Labs", Logo: AcornMark },
  { name: "Sherlock AI", Logo: SherlockMark },
  { name: "Vega Systems", Logo: StarMark },
  { name: "Thatch Co", Logo: ThatchMark },
];

// Duplicate the list so the marquee loops seamlessly.
const LOOP = [...COMPANIES, ...COMPANIES];

export default function TrustedBy() {
  return (
    <section className="trusted-by" aria-label="Companies using Orchestra">
      <motion.p
        className="trusted-eyebrow"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        Trusted by teams shipping at
      </motion.p>

      <div className="trusted-marquee">
        <div className="trusted-track">
          {LOOP.map(({ name, Logo }, i) => (
            <span className="trusted-logo" key={`${name}-${i}`} title={name}>
              <span className="trusted-mark" aria-hidden="true">
                <Logo />
              </span>
              <span className="trusted-name">{name}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
