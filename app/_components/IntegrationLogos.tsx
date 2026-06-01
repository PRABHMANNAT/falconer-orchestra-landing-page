// Inline brand marks for the Getting Started section.
// Drawn fresh (not copies of the official kits) — these are simplified,
// recognisable glyphs in each brand's signature palette. All use a 32-unit
// viewBox so they're swappable inside the same tile slot.

import type { SVGProps } from "react";

type LogoProps = SVGProps<SVGSVGElement>;

export function SlackLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <rect x="6" y="13" width="14" height="6" rx="3" fill="#ECB22E" />
      <rect x="13" y="6" width="6" height="14" rx="3" fill="#36C5F0" />
      <rect x="12" y="13" width="14" height="6" rx="3" fill="#2EB67D" />
      <rect x="13" y="12" width="6" height="14" rx="3" fill="#E01E5A" />
      <circle cx="9" cy="22" r="2.2" fill="#ECB22E" />
      <circle cx="23" cy="10" r="2.2" fill="#2EB67D" />
      <circle cx="22" cy="23" r="2.2" fill="#E01E5A" />
      <circle cx="10" cy="9" r="2.2" fill="#36C5F0" />
    </svg>
  );
}

export function TeamsLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <rect x="3" y="6" width="20" height="20" rx="3" fill="#5059C9" />
      <path d="M8 11h10v2.4h-3.8V22h-2.4v-8.6H8z" fill="#fff" />
      <circle cx="25" cy="11" r="3.2" fill="#7B83EB" />
      <path d="M21 16h8v6.5a3 3 0 0 1-3 3h-2a3 3 0 0 1-3-3V16z" fill="#7B83EB" />
    </svg>
  );
}

export function GranolaLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <rect width="32" height="32" rx="8" fill="#111111" />
      <path
        d="M5 23 L11 12 L16 19 L20 14 L27 23 Z"
        fill="#FFB55C"
        stroke="#FFB55C"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="22" cy="9" r="2" fill="#FFB55C" />
    </svg>
  );
}

export function FirefliesLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <rect width="32" height="32" rx="8" fill="#0F1322" />
      <circle cx="16" cy="13" r="4.6" fill="#FFD341" />
      <circle cx="16" cy="13" r="2" fill="#fff" opacity="0.85" />
      <path
        d="M13.2 16.4c-1.6 2.8-1.7 5.6-0.6 8.4 0.6-1.5 1.7-2.8 3.4-4 1.7 1.2 2.8 2.5 3.4 4 1.1-2.8 1-5.6-0.6-8.4-0.8 0.6-1.7 0.9-2.8 0.9s-2-0.3-2.8-0.9z"
        fill="#FFD341"
        opacity="0.85"
      />
    </svg>
  );
}

export function GoogleDocsLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <path
        d="M8 3h11l7 7v17a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
        fill="#4285F4"
      />
      <path d="M19 3l7 7h-5a2 2 0 0 1-2-2V3z" fill="#A1C2FA" />
      <path
        d="M11 15h10M11 19h10M11 23h7"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function NotionLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <rect x="2" y="2" width="28" height="28" rx="6" fill="#ffffff" stroke="#E5E3DC" />
      <path
        d="M11 8.5v15M11 8.5l10 15M21 8.5v15"
        stroke="#111"
        strokeWidth="2.6"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

export function GitHubLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <circle cx="16" cy="16" r="14" fill="#181717" />
      <path
        fill="#fff"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 5.5C9.9 5.5 5 10.4 5 16.6c0 4.9 3.1 9.1 7.5 10.6 0.6 0.1 0.8-0.2 0.8-0.6v-2.1c-3 0.7-3.7-1.4-3.7-1.4-0.5-1.3-1.2-1.6-1.2-1.6-1-0.7 0.1-0.7 0.1-0.7 1.1 0.1 1.7 1.1 1.7 1.1 1 1.7 2.6 1.2 3.3 0.9 0.1-0.7 0.4-1.2 0.7-1.5-2.4-0.3-4.9-1.2-4.9-5.3 0-1.2 0.4-2.1 1.1-2.9-0.1-0.3-0.5-1.4 0.1-2.8 0 0 0.9-0.3 2.9 1.1 0.8-0.2 1.7-0.3 2.6-0.3 0.9 0 1.8 0.1 2.6 0.3 2-1.4 2.9-1.1 2.9-1.1 0.6 1.4 0.2 2.5 0.1 2.8 0.7 0.7 1.1 1.7 1.1 2.9 0 4.1-2.5 5-4.9 5.3 0.4 0.3 0.7 1 0.7 2v3c0 0.4 0.2 0.7 0.8 0.6 4.4-1.5 7.5-5.7 7.5-10.6C27 10.4 22.1 5.5 16 5.5z"
      />
    </svg>
  );
}

export function GmailLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h21A2.5 2.5 0 0 1 29 8.5v15A2.5 2.5 0 0 1 26.5 26h-21A2.5 2.5 0 0 1 3 23.5v-15z" fill="#fff" stroke="#E5E3DC" />
      <path d="M3 9l13 9 13-9v3.2L16 21 3 12.2V9z" fill="#EA4335" />
      <path d="M3 9v3.2L16 21V13l-7-5H5.5A2.5 2.5 0 0 0 3 10.5V9z" fill="#C5221F" />
      <path d="M29 9v3.2L16 21V13l7-5h3.5A2.5 2.5 0 0 1 29 10.5V9z" fill="#FBBC04" />
      <path d="M16 13L9 8h14l-7 5z" fill="#34A853" />
    </svg>
  );
}

export function LinearLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <defs>
        <linearGradient id="lin-bg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#5E6AD2" />
          <stop offset="100%" stopColor="#7E87E7" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#lin-bg)" />
      <path
        d="M7 18.3a9.7 9.7 0 0 0 6.7 6.7L7 18.3zm0-4.4l11 11a9.7 9.7 0 0 0 3-1l-13-13a9.7 9.7 0 0 0-1 3zm1.8-5.6 14.9 14.9a9.7 9.7 0 0 0 1.6-2L10.8 6.7a9.7 9.7 0 0 0-2 1.6zm3.6-2.5a9.7 9.7 0 0 1 12.8 12.8L12.4 5.8z"
        fill="#fff"
      />
    </svg>
  );
}

export function VSCodeLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <path
        d="M23.5 3.2l4.6 2.2A2 2 0 0 1 29 7.2v17.6a2 2 0 0 1-0.9 1.8l-4.6 2.2a2 2 0 0 1-2.2-0.3L4.8 22.8 8 19.7l13.5 9.6V2.7L8 12.3 4.8 9.2 21.3 3.5a2 2 0 0 1 2.2-0.3z"
        fill="#0098FF"
      />
      <path d="M4.8 9.2L8 12.3 4.8 15.4 1.7 13.4a1.4 1.4 0 0 1 0-2.5L4.8 9.2z" fill="#0065A9" />
      <path d="M4.8 22.8L8 19.7l-3.2-3.1L1.7 18.6a1.4 1.4 0 0 0 0 2.5l3.1 1.7z" fill="#007ACC" />
    </svg>
  );
}
