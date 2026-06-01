"use client";

import { motion } from "framer-motion";

const COMPANIES = [
  { name: "Northwind", initials: "NW" },
  { name: "BloomFast", initials: "BF" },
  { name: "Acorn Labs", initials: "AL" },
  { name: "Sherlock AI", initials: "SA" },
  { name: "Vega Systems", initials: "VS" },
  { name: "Thatch Co", initials: "TC" },
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

      <div className="trusted-marquee" aria-hidden="false">
        <div className="trusted-track">
          {LOOP.map((c, i) => (
            <span className="trusted-logo" key={`${c.name}-${i}`} title={c.name}>
              <span className="trusted-mono" aria-hidden="true">
                {c.initials}
              </span>
              <span className="trusted-name">{c.name}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
