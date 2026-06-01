"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check } from "lucide-react";

const betaFeatures = [
  "Up to 5 teammates",
  "Unlimited docs",
  "All integrations",
  "Socrates queries",
];

const proFeatures = [
  "Everything in Beta",
  "Suggestions",
  "Custom integrations",
  "Priority support",
  "5-year audit log",
];

const enterpriseFeatures = [
  "SSO + SAML",
  "SOC 2 Type II",
  "Dedicated success",
  "Self-host option",
  "On-prem Socrates",
];

function FeatureItem({
  text,
  dark = false,
}: {
  text: string;
  dark?: boolean;
}) {
  return (
    <li
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
      }}
    >
      <Check
        size={16}
        style={{
          flexShrink: 0,
          marginTop: "2px",
          color: "var(--color-accent)",
        }}
      />
      <span
        style={{
          fontSize: "15px",
          lineHeight: 1.5,
          color: dark ? "rgba(255,255,255,0.6)" : "var(--color-muted)",
        }}
      >
        {text}
      </span>
    </li>
  );
}

export default function PricingSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        delay: i * 0.12,
      },
    }),
  };

  return (
    <section
      ref={ref}
      style={{
        background: "var(--color-cream)",
        paddingTop: "clamp(80px, 10vw, 130px)",
        paddingBottom: "clamp(80px, 10vw, 130px)",
        paddingLeft: "var(--pad)",
        paddingRight: "var(--pad)",
        borderTop: "1px solid var(--color-line)",
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "64px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--color-accent)",
            marginBottom: "16px",
          }}
        >
          PRICING
        </p>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(44px, 5.5vw, 72px)",
            textTransform: "uppercase",
            color: "var(--color-ink)",
            lineHeight: 0.96,
            textAlign: "center",
            margin: 0,
          }}
        >
          START FREE. SCALE WHEN YOU FEEL IT.
        </h2>
        <p
          style={{
            fontSize: "17px",
            color: "var(--color-muted)",
            textAlign: "center",
            marginTop: "16px",
            marginBottom: 0,
          }}
        >
          No credit card. No seat tax during beta.
        </p>
      </div>

      {/* Cards row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
        className="pricing-grid"
      >
        {/* Card 1 — Beta */}
        <motion.div
          custom={0}
          variants={cardVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          style={{
            background: "#fff",
            border: "1px solid var(--color-line)",
            borderRadius: "20px",
            padding: "32px 28px",
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-nav)",
              fontSize: "18px",
              fontWeight: 700,
              color: "var(--color-ink)",
              margin: "0 0 16px",
            }}
          >
            Beta
          </p>
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "56px",
                color: "var(--color-ink)",
                lineHeight: 1,
              }}
            >
              $0
            </span>
            <span
              style={{
                fontSize: "14px",
                color: "var(--color-muted)",
              }}
            >
              /mo during beta
            </span>
          </div>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "24px 0",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              flex: 1,
            }}
          >
            {betaFeatures.map((f) => (
              <FeatureItem key={f} text={f} />
            ))}
          </ul>
          <BetaButton label="Join waitlist" />
        </motion.div>

        {/* Card 2 — Pro (featured) */}
        <motion.div
          custom={1}
          variants={cardVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="pro-card"
          style={{
            background: "#fff",
            border: "2px solid var(--color-accent)",
            borderRadius: "20px",
            padding: "32px 28px",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 32px 64px rgba(217,119,87,0.18)",
            transform: "translateY(-8px)",
          }}
        >
          {/* Most popular pill */}
          <span
            style={{
              position: "absolute",
              top: "-14px",
              right: "24px",
              background: "var(--color-accent)",
              color: "#fff",
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              padding: "5px 12px",
              borderRadius: "999px",
            }}
          >
            MOST POPULAR
          </span>
          <p
            style={{
              fontFamily: "var(--font-nav)",
              fontSize: "18px",
              fontWeight: 700,
              color: "var(--color-ink)",
              margin: "0 0 16px",
            }}
          >
            Pro
          </p>
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "56px",
                color: "var(--color-ink)",
                lineHeight: 1,
              }}
            >
              $24
            </span>
            <span
              style={{
                fontSize: "14px",
                color: "var(--color-muted)",
              }}
            >
              /user / month
            </span>
          </div>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "24px 0",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              flex: 1,
            }}
          >
            {proFeatures.map((f) => (
              <FeatureItem key={f} text={f} />
            ))}
          </ul>
          <ProButton label="Start free trial" />
        </motion.div>

        {/* Card 3 — Enterprise */}
        <motion.div
          custom={2}
          variants={cardVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          style={{
            background: "var(--color-near-black)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "20px",
            padding: "32px 28px",
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-nav)",
              fontSize: "18px",
              fontWeight: 700,
              color: "#fff",
              margin: "0 0 16px",
            }}
          >
            Enterprise
          </p>
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "56px",
                color: "#fff",
                lineHeight: 1,
              }}
            >
              Custom
            </span>
          </div>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "24px 0",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              flex: 1,
            }}
          >
            {enterpriseFeatures.map((f) => (
              <FeatureItem key={f} text={f} dark />
            ))}
          </ul>
          <EnterpriseButton label="Book a call" />
        </motion.div>
      </div>

      {/* Below cards link */}
      <div
        style={{
          textAlign: "center",
          marginTop: "40px",
        }}
      >
        <a
          href="#"
          style={{
            color: "var(--color-accent)",
            fontFamily: "var(--font-mono)",
            fontSize: "13px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          Full pricing →
        </a>
      </div>

      <style>{`
        .pricing-grid {
          grid-template-columns: repeat(3, 1fr);
        }
        @media (max-width: 768px) {
          .pricing-grid {
            grid-template-columns: 1fr !important;
            max-width: 440px !important;
          }
          .pro-card {
            transform: none !important;
          }
        }
        .beta-btn {
          width: 100%;
          padding: 14px;
          border-radius: 999px;
          border: 1.5px solid var(--color-near-black);
          background: transparent;
          font-family: var(--font-mono);
          font-size: 13px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-near-black);
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .beta-btn:hover {
          background: var(--color-near-black);
          color: #fff;
        }
        .pro-btn {
          width: 100%;
          padding: 14px;
          border-radius: 999px;
          border: none;
          background: var(--color-accent);
          font-family: var(--font-mono);
          font-size: 13px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #fff;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .pro-btn:hover {
          background: var(--color-accent-deep);
        }
        .pro-card:hover {
          box-shadow: 0 40px 80px rgba(217,119,87,0.28) !important;
        }
        .enterprise-btn {
          width: 100%;
          padding: 14px;
          border-radius: 999px;
          border: 1.5px solid rgba(255,255,255,0.3);
          background: transparent;
          font-family: var(--font-mono);
          font-size: 13px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #fff;
          cursor: pointer;
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .enterprise-btn:hover {
          border-color: #fff;
          background: rgba(255,255,255,0.08);
        }
      `}</style>
    </section>
  );
}

function BetaButton({ label }: { label: string }) {
  return (
    <button className="beta-btn" type="button">
      {label}
    </button>
  );
}

function ProButton({ label }: { label: string }) {
  return (
    <button className="pro-btn" type="button">
      {label}
    </button>
  );
}

function EnterpriseButton({ label }: { label: string }) {
  return (
    <button className="enterprise-btn" type="button">
      {label}
    </button>
  );
}
