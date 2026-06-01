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

    </footer>
  );
}
