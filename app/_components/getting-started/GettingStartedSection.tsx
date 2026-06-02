"use client";

import { useEffect, useRef, useState } from "react";
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
  const [step, setStep] = useState<StepId>("connect");
  const articleRefs = useRef<Array<HTMLElement | null>>([]);
  // After a click-scroll we briefly ignore observer updates so the click
  // target wins over whatever the user is scrolling past.
  const suppressUntil = useRef(0);

  // Drive the active step from whichever article is closest to the
  // viewport center. Triggers as each section passes through the middle band.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const els = articleRefs.current.filter(Boolean) as HTMLElement[];
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (Date.now() < suppressUntil.current) return;
        let best: { id: StepId; dist: number } | null = null;
        const viewportCenter = window.innerHeight / 2;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const rect = e.target.getBoundingClientRect();
          // Skip zero-size segments — happens during initial layout and in
          // some embedded preview contexts. Picking one would be arbitrary.
          if (rect.height === 0) continue;
          const dist = Math.abs(rect.top + rect.height / 2 - viewportCenter);
          const id = (e.target as HTMLElement).dataset.step as StepId;
          if (!best || dist < best.dist) best = { id, dist };
        }
        if (best) setStep(best.id);
      },
      // A tall band around the middle of the screen — the segment whose
      // center is here is the "active" one.
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const handleStepClick = (id: StepId) => {
    setStep(id);
    suppressUntil.current = Date.now() + 700;
    const idx = STEPS.findIndex((s) => s.id === id);
    const el = articleRefs.current[idx];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const target = window.scrollY + rect.top - (window.innerHeight - rect.height) / 2;
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  const onStepKey = (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const dir = e.key === "ArrowDown" ? 1 : -1;
    const next = (idx + dir + STEPS.length) % STEPS.length;
    handleStepClick(STEPS[next].id);
  };

  const activeIndex = STEPS.findIndex((s) => s.id === step);

  return (
    <section id="getstarted" className="gs-section" aria-labelledby="gs-title">
      <div className="gs-grid">
        {/* Intro column — sticky on desktop, holds the step indicator. */}
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
            <div
              role="tablist"
              aria-label="Getting started steps"
              className="gs-steps"
            >
              {STEPS.map((s, i) => {
                const isActive = s.id === step;
                const isDone = i < activeIndex;
                return (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    id={`gs-tab-${s.id}`}
                    aria-selected={isActive}
                    aria-controls={`gs-panel-${s.id}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => handleStepClick(s.id)}
                    onKeyDown={(e) => onStepKey(e, i)}
                    className={`gs-step${isActive ? " is-active" : ""}${isDone ? " is-done" : ""}`}
                  >
                    <span className="gs-step-num" aria-hidden="true">
                      {s.n}
                    </span>
                    <span className="gs-step-body">
                      <span className="gs-step-label">{s.label}</span>
                      <span className="gs-step-desc">{s.desc}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          <motion.a href="#integrations" className="gs-link" variants={fadeUp}>
            See all integrations →
          </motion.a>
        </motion.header>

        {/* Scrolly column — three tall articles that drive the active step
            as they pass the viewport centre. The stage on the right stays
            sticky and swaps its animation to match. */}
        <div className="gs-scroll-col">
          <div className="gs-stage-sticky">
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
                transition={{ duration: 0.4, ease: EASE }}
              >
                <StepGraphic id={step} />
              </motion.div>
            </motion.div>
          </div>

          {/* Invisible scroll segments — one per step. Their position in the
              viewport is what drives the observer above. */}
          <div className="gs-scroll-track" aria-hidden="true">
            {STEPS.map((s, i) => (
              <article
                key={s.id}
                ref={(el) => {
                  articleRefs.current[i] = el;
                }}
                data-step={s.id}
                className="gs-scroll-step"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
