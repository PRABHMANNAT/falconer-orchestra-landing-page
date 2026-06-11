"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Check } from "lucide-react";

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
    unit: "/user / month",
    blurb: "For teams ready to make company knowledge searchable, cited, and operational.",
    features: [
      "Unlimited connected sources",
      "Socrates answers with citations",
      "Decision timeline and audit trail",
      "AI suggestions for drift and stalled work",
      "Slack, GitHub, Notion, Linear, email, and calls",
    ],
    cta: "Start with Team",
    ctaHref: "/waitlist",
    featured: true,
  },
  {
    id: "scale",
    name: "Scale",
    price: "Book a call",
    blurb: "For companies that need security reviews, custom rollout, and executive-grade visibility.",
    features: [
      "Everything in Team",
      "Custom integrations and data mapping",
      "SSO, SAML, and permission design",
      "Dedicated onboarding and success",
      "Security, procurement, and investor-ready reporting",
    ],
    cta: "Book a call",
    ctaHref: "https://calendly.com/adidogra07/orchestra-demo",
    dark: true,
  },
];

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const headVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.02 } },
};

const headItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: EASE },
  },
};

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -6 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: EASE } },
};

export default function PricingSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="pricing-section">
      {/* Header */}
      <motion.div
        className="pricing-head"
        variants={headVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.p className="pricing-eyebrow" variants={headItem}>
          Pricing
        </motion.p>
        <motion.h2 className="pricing-title" variants={headItem}>
          Simple pricing for serious teams.
        </motion.h2>
        <motion.p className="pricing-sub" variants={headItem}>
          Start with a company brain your team can use today. Talk to us when you need scale, security, or a custom rollout.
        </motion.p>
      </motion.div>

      {/* Cards */}
      <motion.div
        className="pricing-grid"
        variants={gridVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
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
              <span className="pricing-price">{plan.price}</span>
              {plan.unit && <span className="pricing-unit">{plan.unit}</span>}
            </div>
            <p
              style={{
                margin: "12px 0 4px",
                fontSize: 14,
                lineHeight: 1.55,
                color: plan.dark ? "rgba(255,255,255,0.66)" : "var(--color-muted)",
              }}
            >
              {plan.blurb}
            </p>

            <motion.ul
              className="pricing-features"
              variants={listVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
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

      <motion.div
        className="pricing-footnote"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <a href="/pricing">Compare plans</a>
      </motion.div>
    </section>
  );
}
