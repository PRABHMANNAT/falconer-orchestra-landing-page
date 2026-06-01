"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import Mark from "./Mark";
import HalftoneGlobe from "../HalftoneGlobe";

// Footer palette (scoped — does not affect the rest of the site):
//   --footer-bg   #000000 (black)
//   --footer-text #FFFFFF (white)
//   --footer-mute #B1ADA1 (Cloudy)
//   --footer-acc  #C15F3C (Crail)

const FOOTER_COLUMNS: Array<{
  heading: string;
  links: Array<{ label: string; href: string; external?: boolean }>;
}> = [
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Customers", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Manifesto", href: "#" }
    ]
  },
  {
    heading: "Resources",
    links: [
      { label: "Docs", href: "#" },
      { label: "Integrations", href: "#" },
      { label: "Changelog", href: "#" },
      { label: "Notes", href: "#" }
    ]
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Security", href: "/security" },
      { label: "SOC 2", href: "#" }
    ]
  }
];

const CALENDLY_URL = "https://calendly.com/adidogra07/orchestra-demo";

// Light-tinted dots so the globe reads against the dark footer card.
const GLOBE_INK: [number, number, number] = [235, 233, 227];
const GLOBE_ACCENT: [number, number, number] = [193, 95, 60];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setJoined(true);
  };

  return (
    <footer className="big-footer" aria-labelledby="footer-cta">
      {/* ── CTA card — tagline + waitlist + dotted Earth ───────────────── */}
      <div className="footer-cta-card">
        <div className="footer-cta-card-copy">
          <p className="footer-cta-eyebrow">One source of truth. Powered by AI.</p>
          <h2 className="footer-cta-title">
            Experience the
            <br />
            source of truth.
          </h2>
          <p className="footer-cta-lede">
            Eight sources, one company brain. Join the waitlist and be first in line.
          </p>

          {joined ? (
            <p className="footer-waitlist-done" role="status">
              ✓ You&apos;re on the list — we&apos;ll be in touch.
            </p>
          ) : (
            <form className="footer-waitlist" onSubmit={onSubmit}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                aria-label="Work email address"
                className="footer-waitlist-input"
              />
              <button type="submit" className="footer-waitlist-btn">
                Join Waitlist
              </button>
            </form>
          )}
        </div>

        {/* Dotted Earth, anchored to the right edge and partly clipped */}
        <div className="footer-cta-globe" aria-hidden="true">
          <HalftoneGlobe ink={GLOBE_INK} accent={GLOBE_ACCENT} />
        </div>
      </div>

      {/* ── Sitemap — brand + CTA + link columns ───────────────────────── */}
      <div className="footer-sitemap footer-sitemap--4col">
        <div className="footer-sitemap-brand">
          <Link href="/" className="footer-brand-link" aria-label="Orchestra home">
            <Mark tone="light" />
            <span>orchestra</span>
          </Link>
          <p className="footer-brand-line">
            The source of truth for teams that ship.
          </p>

          <div className="footer-cta-wrap">
            <a
              id="footer-cta"
              href={CALENDLY_URL}
              target="_blank"
              rel="noreferrer"
              className="footer-cta-btn"
            >
              <span className="footer-cta-label">Talk to Founders</span>
              <motion.span
                className="footer-cta-shine"
                aria-hidden="true"
                initial={{ x: "-110%" }}
                animate={{ x: "110%" }}
                transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 3.2, ease: "easeInOut" }}
              />
            </a>
          </div>
        </div>

        <nav className="footer-sitemap-cols footer-sitemap-cols--3" aria-label="Footer navigation">
          {FOOTER_COLUMNS.map((col) => (
            <div className="footer-sitemap-col" key={col.heading}>
              <h4 className="footer-col-heading">{col.heading}</h4>
              <ul className="footer-col-links">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a href={link.href} target="_blank" rel="noreferrer">
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href}>{link.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* ── Giant ORCHESTRA watermark ──────────────────────────────────── */}
      <div className="footer-megaword" aria-hidden="true">
        <span>orchestra</span>
      </div>

      {/* ── Slim bottom bar ────────────────────────────────────────────── */}
      <div className="footer-bar">
        <small className="footer-copyright">&copy; 2026 Orchestra</small>
        <div
          className="footer-bar-social"
          style={{ display: "flex", gap: 16, alignItems: "center" }}
        >
          {/* Twitter / X */}
          <a
            href="https://x.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Twitter / X"
            style={{
              color: "rgba(255,255,255,0.45)",
              transition: "color 0.2s",
              display: "flex",
              alignItems: "center"
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#fff")}
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.45)")
            }
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.631L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
            </svg>
          </a>
          {/* LinkedIn */}
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            style={{
              color: "rgba(255,255,255,0.45)",
              transition: "color 0.2s",
              display: "flex",
              alignItems: "center"
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#fff")}
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.45)")
            }
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          {/* GitHub */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            style={{
              color: "rgba(255,255,255,0.45)",
              transition: "color 0.2s",
              display: "flex",
              alignItems: "center"
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#fff")}
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.45)")
            }
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
