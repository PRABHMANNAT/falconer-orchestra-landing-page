"use client";

import type { ComponentPropsWithoutRef } from "react";

export function StripedPattern({
  className = "",
  ...props
}: ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full fill-neutral-400/80 ${className}`}
      {...props}
    >
      <defs>
        <pattern
          id="striped-pattern"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line x1="0" y1="0" x2="0" y2="8" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#striped-pattern)" />
    </svg>
  );
}
