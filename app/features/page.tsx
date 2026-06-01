"use client";

import { useState, useEffect, useCallback } from "react";
import { useReducedMotion } from "framer-motion";
import Link from "next/link";
import Mark from "../_components/Mark";
import Footer from "../_components/Footer";
import TimelineNav from "../_components/features/TimelineNav";
import { SOURCES } from "../_components/features/types";
import "./features.css";

const CAPABILITIES = [
  {
    eyebrow: "Socrates",
    accent: "#d97757",
    title: "Ask anything. Trust the answer.",
    body: "Query your whole company in plain English. Socrates surfaces the source, the date, and the person behind every answer.",
  },
  {
    eyebrow: "Suggestions",
    accent: "#7c5cff",
    title: "Notice what you'd miss.",
    body: "Orchestra flags when a Slack decision contradicts a spec, when a deadline slips, or when a promise on a call goes unanswered.",
  },
  {
    eyebrow: "Timeline",
    accent: "#10a5a0",
    title: "Every decision, forever.",
    body: "A permanent, searchable log of every decision your team has made — with the full context of why. Onboard in days, not months.",
  },
  {
    eyebrow: "Growth",
    accent: "#e0a020",
    title: "Grow on what's working.",
    body: "Orchestra synthesises customer signals across email, calls, and tickets to surface the patterns that drive revenue.",
  },
];

function FeaturesNav() {
  return (
    <nav className="features-nav" aria-label="Primary">
      <Link href="/" className="features-brand">
        <Mark tone="dark" />
        Orchestra
      </Link>
      <div className="features-nav-right">
        <Link href="/" className="features-nav-home">
          ← Home
        </Link>
        <a href="#waitlist" className="features-nav-cta">
          Join Waitlist
        </a>
      </div>
    </nav>
  );
}

export default function FeaturesPage() {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<string>(SOURCES[0].key);

  // Track the section nearest the viewport centre for the timeline + progress bar.
  useEffect(() => {
    const sections = SOURCES.map((s) => document.getElementById(s.key)).filter(
      (el): el is HTMLElement => Boolean(el)
    );
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const handleJump = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
    },
    [reduceMotion]
  );

  const activeIdx = SOURCES.findIndex((s) => s.key === activeId);
  const progressPct = activeIdx < 0 ? 0 : ((activeIdx + 1) / SOURCES.length) * 100;
  const timelineItems = SOURCES.map((s) => ({
    id: s.key,
    label: s.label,
    brandColor: s.brandColor,
  }));

  return (
    <>
      <FeaturesNav />

      <main className="features-main">
        {/* Hero */}
        <header className="features-hero">
          <p className="features-eyebrow">Features</p>
          <h1>
            Eight sources.
            <br />
            One brain.
          </h1>
          <p className="features-hero-sub">
            Everything your team touches, flowing into one source of truth.
          </p>
        </header>

        {/* Mobile progress bar (hidden on desktop via CSS) */}
        <div className="features-progress" role="presentation">
          <div className="features-progress-meta">
            <span>{SOURCES[activeIdx < 0 ? 0 : activeIdx].label}</span>
            <span>
              {String(activeIdx < 0 ? 1 : activeIdx + 1).padStart(2, "0")} / {SOURCES.length}
            </span>
          </div>
          <div className="features-progress-track">
            <div
              className="features-progress-fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Timeline + content */}
        <div className="features-layout">
          <TimelineNav items={timelineItems} activeId={activeId} onJump={handleJump} />

          <div className="features-content">
            {SOURCES.map((source, i) => (
              <section
                key={source.key}
                id={source.key}
                className="feature-section"
                aria-labelledby={`${source.key}-title`}
              >
                <span className="feature-bg" aria-hidden="true">
                  <Mark tone="dark" />
                </span>
                <div className="feature-body-wrap">
                  <p className="feature-eyebrow" style={{ color: source.brandColor }}>
                    <span
                      className="feature-eyebrow-dot"
                      style={{ background: source.brandColor }}
                      aria-hidden="true"
                    />
                    {source.label} · Source {String(i + 1).padStart(2, "0")} / {SOURCES.length}
                  </p>
                  <h2 id={`${source.key}-title`}>{source.title}</h2>
                  <p className="feature-text">{source.body}</p>
                  <a
                    href="#"
                    className="feature-learn"
                    aria-label={`Learn more about the ${source.label} integration`}
                  >
                    Learn more <span aria-hidden="true">→</span>
                  </a>
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* Capabilities */}
        <section className="features-capabilities" aria-labelledby="capabilities-title">
          <div className="features-cap-head">
            <p className="features-eyebrow">What it unlocks</p>
            <h2 id="capabilities-title" className="features-cap-title">
              Four capabilities
            </h2>
          </div>
          <div className="features-cap-grid">
            {CAPABILITIES.map((cap) => (
              <article
                key={cap.eyebrow}
                className="cap-card"
                style={{ ["--cap-accent" as string]: cap.accent }}
              >
                <p className="cap-eyebrow">{cap.eyebrow}</p>
                <h3>{cap.title}</h3>
                <p>{cap.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="features-cta" id="waitlist" aria-labelledby="features-cta-title">
          <div className="features-cta-inner">
            <h2 id="features-cta-title">Put it all in one brain.</h2>
            <p>Join the waitlist and be first in line when your spot opens.</p>
            <div className="features-cta-actions">
              <a href="#" className="features-btn features-btn--primary">
                Join Waitlist
              </a>
              <a href="#demo" className="features-btn features-btn--ghost">
                Book a Demo
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
