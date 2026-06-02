"use client";

import { motion, type Variants } from "framer-motion";
import "./styles.css";
import { STEPS, type StepId } from "./StepTabs";
import IntegrationShowcase from "./IntegrationShowcase";
import ContextDemo from "./ContextDemo";
import AiPmSuggestions from "./AiPmSuggestions";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

function StepGraphic({ id }: { id: StepId }) {
  if (id === "connect") return <IntegrationShowcase />;
  if (id === "structure") return <ContextDemo />;
  return <AiPmSuggestions />;
}

export default function GettingStartedSection() {
  return (
    <section id="getstarted" className="gs-section" aria-labelledby="gs-title">
      <div className="gs-grid">
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
            signal into one company brain - and Socrates rides along to answer,
            surface risk, and keep your team in sync.
          </motion.p>

          <motion.a href="#integrations" className="gs-link" variants={fadeUp}>
            {"See all integrations ->"}
          </motion.a>
        </motion.header>

        <div className="gs-scroll-copy" aria-label="Getting started walkthrough">
          {STEPS.map((item) => (
            <article key={item.id} className="gs-scroll-step" data-step={item.id}>
              <motion.div
                className="gs-scroll-step-copy"
                initial={{ opacity: 0.45, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.55 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <span className="gs-scroll-num">{item.n}</span>
                <h3>{item.label}</h3>
                <p>{item.desc}</p>
              </motion.div>

              <motion.div
                className="gs-stage gs-scroll-stage"
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <div className="gs-stage-stack">
                  <div
                    className={`gs-stage-panel gs-stage-panel-${item.id} is-active`}
                    data-gs-panel={item.id}
                    aria-hidden="false"
                  >
                    <StepGraphic id={item.id} />
                  </div>
                </div>
              </motion.div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
