"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import type { Integration } from "./integrations";

const EASE = [0.22, 1, 0.36, 1] as const;

function IntegrationCardImpl({ integration }: { integration: Integration }) {
  return (
    <motion.figure
      key={integration.id}
      className="gs-int-card"
      initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.32, ease: EASE }}
      aria-live="polite"
    >
      <span className="gs-int-card-logo" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={integration.src} alt="" loading="lazy" draggable={false} />
      </span>
      <figcaption className="gs-int-card-text">
        <b>{integration.name}</b>
        <small>{integration.detail}</small>
      </figcaption>
      {integration.docs && (
        <a
          href={integration.docs}
          className="gs-int-card-tag"
          aria-label={`Open ${integration.name} documentation`}
        >
          Docs →
        </a>
      )}
    </motion.figure>
  );
}

export default memo(IntegrationCardImpl);
