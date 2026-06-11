"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { Check, X } from "lucide-react";
import Footer from "../_components/Footer";
import SiteHeader from "../_components/SiteHeader";
import "./pricing.css";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* Pricing plans */
type Plan = {
  id: "team" | "scale";
  name: string;
  price: string;
  unit?: string;
  blurb: string;
  features: string[];
  cta: string;
  ctaHref: string;
  featured?: boolean;
  dark?: boolean;
};

const PLANS: Plan[] = [
  {
    id: "team",
    name: "Team",
    price: "$40",
    unit: "user / month",
    blurb: "For operating teams that need one reliable place to search, cite, and track company context.",
    features: [
      "Unlimited connected sources",
      "Socrates answers with source citations",
      "Decision timeline and audit trail",
      "AI suggestions for drift and stalled work",
      "Core integrations for docs, chat, code, tickets, email, and calls",
      "Priority product support",
    ],
    cta: "Start with Team",
    ctaHref: "/waitlist",
    featured: true,
  },
  {
    id: "scale",
    name: "Scale",
    price: "Book a call",
    blurb: "For companies evaluating security, procurement, investor diligence, or a multi-team rollout.",
    features: [
      "Everything in Team",
      "Custom integrations and data mapping",
      "SSO, SAML, and workspace permissions",
      "Dedicated onboarding and success",
      "Security and procurement support",
      "Executive and investor-ready reporting",
    ],
    cta: "Book a call",
    ctaHref: "https://calendly.com/adidogra07/orchestra-demo",
    dark: true,
  },
];

/* Variants */
const headVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};
const headItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};
const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: EASE } },
};
const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: EASE } },
};

/* Comparison rows */
type Row = { feature: string; values: [string | boolean, string | boolean] };
const COMPARE: Row[] = [
  { feature: "Best for",             values: ["Teams building shared context", "Companies rolling out across departments"] },
  { feature: "Teammates",            values: ["Unlimited", "Unlimited"] },
  { feature: "Connected sources",    values: ["Core integrations", "Custom integrations"] },
  { feature: "Socrates answers",     values: ["Cited answers", "Cited answers plus rollout tuning"] },
  { feature: "Decision timeline",    values: [true, true] },
  { feature: "AI suggestions",       values: [true, true] },
  { feature: "Security review",      values: ["Standard", "Supported"] },
  { feature: "SSO + SAML",           values: [false, true] },
  { feature: "Success support",      values: ["Priority support", "Dedicated onboarding"] },
  { feature: "Investor reporting",   values: ["Workspace exports", "Executive-ready reporting"] },
];

function Cell({ v }: { v: string | boolean }) {
  if (v === true)
    return (
      <span className="cell-yes" aria-label="Included">
        <Check size={14} strokeWidth={2.4} />
      </span>
    );
  if (v === false)
    return (
      <span className="cell-no" aria-label="Not included">
        <X size={14} strokeWidth={2} />
      </span>
    );
  return <span className="cell-text">{v}</span>;
}

/* FAQ */
const FAQ: { q: string; a: string }[] = [
  {
    q: "What is included in the $40 plan?",
    a: "Team includes the core company brain: connected sources, cited Socrates answers, decision history, AI suggestions, and priority product support.",
  },
  {
    q: "What counts as a teammate?",
    a: "Anyone with edit or ask access in your workspace. Viewer-only access for shared snapshots can be handled separately.",
  },
  {
    q: "When should we book a call?",
    a: "Book a call if you need security review, SSO, custom integrations, procurement support, or a rollout plan across multiple teams.",
  },
  {
    q: "Can Orchestra support investor or board diligence?",
    a: "Yes. Scale is designed for leadership visibility, decision history, source-backed reporting, and a cleaner operational story for diligence.",
  },
  {
    q: "Can we start small and move to Scale later?",
    a: "Yes. Start with Team, prove the workflow, then move to Scale when security, integrations, or rollout complexity requires it.",
  },
];

function FaqItem({ q, a, idx }: { q: string; a: string; idx: number }) {
  const [open, setOpen] = useState(idx === 0);
  return (
    <motion.div
      className="faq-item"
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.4, delay: idx * 0.05, ease: EASE }}
    >
      <button
        type="button"
        className="faq-q"
        aria-expanded={open}
        aria-controls={`faq-${idx}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{q}</span>
        <span className="faq-plus" aria-hidden="true" />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`faq-${idx}`}
            className="faq-a"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE }}
          >
            <p className="faq-a-inner">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* Page */
export default function PricingPage() {
  const reduce = useReducedMotion();

  return (
    <>
      <SiteHeader />

      <main className="pricing-page">
        {/* HERO */}
        <header className="pricing-page-hero">
          <motion.span
            aria-hidden="true"
            className="pricing-page-hero-glow"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={
              reduce
                ? { opacity: 0.6, scale: 1 }
                : { opacity: [0.5, 0.85, 0.5], scale: [1, 1.06, 1] }
            }
            transition={
              reduce
                ? { duration: 0.6 }
                : { duration: 6.5, repeat: Infinity, ease: "easeInOut" }
            }
          />
          <motion.div
            className="pricing-page-hero-inner"
            variants={headVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.span className="pricing-page-pill" variants={headItem}>
              <span className="pricing-page-pill-dot" aria-hidden="true" />
              Pricing
            </motion.span>
            <motion.h1 className="pricing-page-h1" variants={headItem}>
              Pricing that matches{" "}
              <span className="accent">how teams buy.</span>
            </motion.h1>
            <motion.p className="pricing-page-sub" variants={headItem}>
              One clear team plan for adoption. One guided path for companies that need security, procurement, and scale.
            </motion.p>

          </motion.div>
        </header>

        {/* Pricing cards match the landing page UI language. */}
        <section
          className="pricing-section"
          aria-label="Plans"
          style={{ paddingTop: 24, borderTop: 0 }}
        >
          <motion.div
            className="pricing-grid"
            variants={gridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {PLANS.map((plan) => (
              <motion.div
                key={plan.id}
                variants={cardVariants}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className={[
                  "pricing-card",
                  plan.featured ? "pricing-card--featured" : "",
                  plan.dark ? "pricing-card--dark" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {plan.featured && <span className="pricing-badge">Most popular</span>}

                <p className="pricing-plan-name">{plan.name}</p>

                <div className="pricing-price-row">
                  <motion.span
                    key={plan.id}
                    className="pricing-price"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.32, ease: EASE }}
                  >
                    {plan.price}
                  </motion.span>
                  {plan.unit && <span className="pricing-unit">/{plan.unit}</span>}
                </div>

                <p
                  style={{
                    margin: "10px 0 4px",
                    fontSize: 14,
                    color: plan.dark ? "rgba(255,255,255,0.66)" : "var(--color-muted)",
                  }}
                >
                  {plan.blurb}
                </p>

                <motion.ul
                  className="pricing-features"
                  variants={listVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                >
                  {plan.features.map((f) => (
                    <motion.li key={f} className="pricing-feature" variants={itemVariants}>
                      <Check size={15} className="pricing-check" strokeWidth={2.5} />
                      <span>{f}</span>
                    </motion.li>
                  ))}
                </motion.ul>

                <a
                  href={plan.ctaHref}
                  target={plan.ctaHref.startsWith("http") ? "_blank" : undefined}
                  rel={plan.ctaHref.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={[
                    "pricing-btn",
                    plan.featured ? "pricing-btn--primary" : "",
                    plan.dark ? "pricing-btn--ghost" : "pricing-btn--outline",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {plan.cta}
                </a>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* COMPARISON TABLE */}
        <section className="pricing-compare" aria-labelledby="compare-title">
          <motion.div
            className="pricing-compare-head"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={headVariants}
          >
            <motion.h2 id="compare-title" variants={headItem}>
              Compare plans
            </motion.h2>
            <motion.p variants={headItem}>
              Team gives buyers a clear starting point. Scale gives larger companies the support needed to adopt safely.
            </motion.p>
          </motion.div>

          <div className="pricing-table-shell">
            <table className="pricing-table">
              <thead>
                <tr>
                  <th scope="col">Feature</th>
                  <th scope="col" className="pricing-table-popular">Team</th>
                  <th scope="col">Scale</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row) => (
                  <tr key={row.feature}>
                    <td>{row.feature}</td>
                    {row.values.map((v, i) => (
                      <td key={i}>
                        <Cell v={v} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="pricing-faq" aria-labelledby="faq-title">
          <motion.div
            className="pricing-faq-head"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={headVariants}
          >
            <motion.h2 id="faq-title" variants={headItem}>
              Frequently asked
            </motion.h2>
          </motion.div>

          {FAQ.map((item, i) => (
            <FaqItem key={item.q} q={item.q} a={item.a} idx={i} />
          ))}
        </section>

        {/* CTA */}
        <section id="cta" className="pricing-page-cta" aria-labelledby="pricing-cta-title">
          <motion.div
            className="pricing-page-cta-inner"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <motion.span
              aria-hidden="true"
              className="pricing-page-cta-glow"
              animate={reduce ? undefined : { opacity: [0.5, 1, 0.5] }}
              transition={
                reduce ? undefined : { duration: 5, repeat: Infinity, ease: "easeInOut" }
              }
            />
            <h2 id="pricing-cta-title">Ready to make company knowledge investable?</h2>
            <p>Start with Team at $40 per user, or book a call for security, procurement, and rollout planning.</p>
            <div className="pricing-page-cta-actions">
              <a href="/waitlist" className="pricing-page-btn pricing-page-btn--primary">
                Start with Team
              </a>
              <a
                href="https://calendly.com/adidogra07/orchestra-demo"
                target="_blank"
                rel="noopener noreferrer"
                className="pricing-page-btn pricing-page-btn--ghost"
              >
                Book Demo
              </a>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </>
  );
}
