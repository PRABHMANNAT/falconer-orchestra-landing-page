"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import "./styles.css";
import StepTabs, { type StepId } from "./StepTabs";
import IntegrationShowcase from "./IntegrationShowcase";
import ContextDemo from "./ContextDemo";
import AiPmSuggestions from "./AiPmSuggestions";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export default function GettingStartedSection() {
  const [step, setStep] = useState<StepId>("connect");

  return (
    <section className="getstarted gs-section" aria-labelledby="gs-title">
      <div className="gs-grid">
        {/* Copy column */}
        <motion.header
          className="gs-copy"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
          }}
        >
          <motion.p className="gs-kicker" variants={fadeUp}>
            Getting Started
          </motion.p>
          <motion.h2 id="gs-title" variants={fadeUp}>
            Connect.{" "}
            <span style={{ color: "var(--color-accent)" }}>Structure.</span>{" "}
            Ask.
          </motion.h2>
          <motion.p variants={fadeUp}>
            Plug Orchestra into the tools you already live in. We turn every
            signal into one company brain — and Socrates rides along to answer,
            surface risk, and keep your team in sync.
          </motion.p>

          <motion.div variants={fadeUp}>
            <StepTabs active={step} onChange={setStep} />
          </motion.div>

          <motion.a href="#integrations" className="gs-link" variants={fadeUp}>
            See all integrations →
          </motion.a>
        </motion.header>

        {/* Stage column */}
        <motion.div
          className="gs-stage"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 12, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            {step === "connect"   && <IntegrationShowcase />}
            {step === "structure" && <ContextDemo />}
            {step === "ask"       && <AiPmSuggestions />}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
