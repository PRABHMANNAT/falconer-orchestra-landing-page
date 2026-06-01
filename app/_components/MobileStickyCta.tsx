"use client";

import React from "react";
import { motion } from "framer-motion";

export default function MobileStickyCta() {
  return (
    <>
      <style>{`
        .mobile-sticky-cta {
          display: flex;
        }
        @media (min-width: 768px) {
          .mobile-sticky-cta {
            display: none;
          }
        }
        .mobile-sticky-cta-btn {
          display: block;
          width: 100%;
          padding: 14px;
          text-align: center;
          border-radius: 999px;
          background: var(--color-accent);
          color: #fff;
          font-family: var(--font-mono);
          font-size: 13px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 500;
          text-decoration: none;
          transition: transform 0.1s ease;
        }
        .mobile-sticky-cta-btn:active {
          transform: scale(0.97);
        }
      `}</style>

      <motion.div
        className="mobile-sticky-cta"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: "rgba(248,245,235,0.95)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderTop: "1px solid var(--color-line)",
          padding: "12px 20px max(12px, env(safe-area-inset-bottom))",
          flexDirection: "column",
        }}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 28,
          delay: 1,
        }}
      >
        <a href="#" className="mobile-sticky-cta-btn">
          JOIN WAITLIST
        </a>
      </motion.div>
    </>
  );
}
