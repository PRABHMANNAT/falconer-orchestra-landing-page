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

/* ──────────────── Plans (annual prices precomputed @ 2-month free) ──────────────── */
type Plan = {
  id: "beta" | "pro" | "enterprise";
  name: string;
  monthly: number | null; // null = custom
  annual: number | null;
  unit?: string;
  blurb: string;
  features: string[];
  cta: string;
  featured?: boolean;
  dark?: boolean;
};

const PLANS: Plan[] = [
  {
    id: "beta",
    name: "Beta",
    monthly: 0,
    annual: 0,
    unit: "during beta",
    blurb: "For founders prototyping with their first 5 people.",
    features: ["Up to 5 teammates", "Unlimited docs", "All integrations", "Socrates queries"],
    cta: "Join waitlist",
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 24,
    annual: 20,
    unit: "user / month",
    blurb: "Everything your team needs to ship in sync.",
    features: [
      "Everything in Beta",
      "Suggestions",
      "Custom integrations",
      "Priority support",
      "5-year audit log",
    ],
    cta: "Start free trial",
    featured: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthly: null,
    annual: null,
    blurb: "When you need controls, residency, and a name to call.",
    features: ["SSO + SAML", "SOC 2 Type II", "Dedicated success", "Self-host option", "On-prem Socrates"],
    cta: "Book a call",
    dark: true,
  },
];

/* ──────────────── Variants ──────────────── */
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

/* ──────────────── Comparison rows ──────────────── */
type Row = { feature: string; values: [string | boolean, string | boolean, string | boolean] };
const COMPARE: Row[] = [
  { feature: "Teammates",            values: ["Up to 5", "Unlimited", "Unlimited"] },
  { feature: "Integrations",         values: [true,       true,         true] },
  { feature: "Socrates queries",     values: ["Daily cap","Unlimited",  "Unlimited"] },
  { feature: "Suggestions",          values: [false,      true,         true] },
  { feature: "Custom integrations",  values: [false,      true,         true] },
  { feature: "Audit log retention",  values: ["30 days",  "5 years",    "Unlimited"] },
  { feature: "SSO + SAML",           values: [false,      false,        true] },
  { feature: "SOC 2 Type II",        values: [false,      false,        true] },
  { feature: "Self-host / On-prem",  values: [false,      false,        true] },
  { feature: "Dedicated success",    values: [false,      "Priority",   "Named CSM"] },
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

/* ──────────────── FAQ ──────────────── */
const FAQ: { q: string; a: string }[] = [
  {
    q: "Is there a free trial on Pro?",
    a: "Yes — every Pro subscription includes a 14-day trial with full access. You can cancel at any time inside settings.",
  },
  {
    q: "What counts as a teammate?",
    a: "Anyone with edit or ask access in your workspace. Read-only viewers (e.g. customers you share a snapshot with) are free.",
  },
  {
    q: "Do you charge for integrations?",
    a: "No. Every plan can connect every integration. Enterprise unlocks self-hosted runners and on-prem Socrates for sensitive data.",
  },
  {
    q: "Can we pay annually?",
    a: "Yes — toggle Annual above for 2 months free per seat. Enterprise contracts are negotiated separately.",
  },
  {
    q: "How does Beta pricing work?",
    a: "Beta is free for up to 5 teammates while we are in private launch. You'll get 30 days' notice before any plan change.",
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

/* ──────────────── Page ──────────────── */
export default function PricingPage() {
  const reduce = useReducedMotion();
  const [billing, setBilling] = useState<"monthly" | "annual">("annual");

  const priceFor = (plan: Plan) => {
    if (plan.monthly === null) return "Custom";
    const n = billing === "annual" ? plan.annual : plan.monthly;
    return n === 0 ? "$0" : `$${n}`;
  };

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
              Start free.{" "}
              <span className="accent">Scale when you feel it.</span>
            </motion.h1>
            <motion.p className="pricing-page-sub" variants={headItem}>
              No credit card. No seat tax during beta. Switch any time — and bring everyone with you.
            </motion.p>

            {/* Billing toggle */}
            <motion.div
              className="billing-toggle"
              role="tablist"
              aria-label="Billing period"
              variants={headItem}
            >
              {(["monthly", "annual"] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  role="tab"
                  aria-selected={billing === opt}
                  className={`billing-opt${billing === opt ? " is-active" : ""}`}
                  onClick={() => setBilling(opt)}
                >
                  {opt === "monthly" ? "Monthly" : "Annual"}
                  {opt === "annual" && <span className="billing-save">−2mo</span>}
                </button>
              ))}
            </motion.div>
          </motion.div>
        </header>

        {/* PRICING CARDS — same UI language as landing page */}
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

                <div className="pricing-price-row" data-billing={billing}>
                  <motion.span
                    key={`${plan.id}-${billing}`}
                    className="pricing-price"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.32, ease: EASE }}
                  >
                    {priceFor(plan)}
                  </motion.span>
                  {plan.unit && (
                    <span className="pricing-unit">
                      {plan.id === "beta"
                        ? `/mo ${plan.unit}`
                        : `/${plan.unit}${billing === "annual" ? " · billed yearly" : ""}`}
                    </span>
                  )}
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

                <button
                  type="button"
                  className={[
                    "pricing-btn",
                    plan.featured ? "pricing-btn--primary" : "",
                    plan.dark ? "pricing-btn--ghost" : "pricing-btn--outline",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {plan.cta}
                </button>
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
              Everything Pro and up — Beta is for getting your team in fast.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <table className="pricing-table">
              <thead>
                <tr>
                  <th scope="col">Feature</th>
                  <th scope="col">Beta</th>
                  <th scope="col" className="pricing-table-popular">Pro</th>
                  <th scope="col">Enterprise</th>
                </tr>
              </thead>
              <motion.tbody
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.2 } },
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
              >
                {COMPARE.map((row) => (
                  <motion.tr
                    key={row.feature}
                    variants={{
                      hidden: { opacity: 0, y: 8 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
                    }}
                  >
                    <td>{row.feature}</td>
                    {row.values.map((v, i) => (
                      <td key={i}>
                        <Cell v={v} />
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </motion.div>
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
            <h2 id="pricing-cta-title">Ready to put it all in one brain?</h2>
            <p>Join the waitlist and we&apos;ll reach out the moment your spot opens.</p>
            <div className="pricing-page-cta-actions">
              <a href="/waitlist" className="pricing-page-btn pricing-page-btn--primary">
                Join Waitlist
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
