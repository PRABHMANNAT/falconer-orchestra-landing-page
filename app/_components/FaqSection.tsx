"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How is this different from Notion or Confluence?",
    answer:
      "Notion stores docs. Orchestra captures decisions, links them to threads and commits, and surfaces drift. Socrates is the difference — your docs talk back.",
  },
  {
    question: "What data do you ingest?",
    answer:
      "Slack channels you connect, GitHub repos you authorize, Google Calendar events, and uploaded docs (PDF, DOCX). Everything is read-only by default. We never write back without explicit permission.",
  },
  {
    question: "Is Socrates trained on my data?",
    answer:
      "No. We use retrieval, not fine-tuning. Your data stays your data and is never used to train external models.",
  },
  {
    question: "Can I self-host?",
    answer: "Enterprise customers can self-host. Beta is cloud-only.",
  },
  {
    question: "How does pricing work after beta?",
    answer:
      "Per seat per month. Free tier for up to 5 teammates remains forever.",
  },
  {
    question: "What's the SOC 2 status?",
    answer:
      "Type II in progress, expected Q3 2026. Type I report available on request.",
  },
  {
    question: "Do you have a Slack/MS Teams integration?",
    answer: "Slack is live. Teams is in beta.",
  },
  {
    question: "What's your data retention policy?",
    answer: "You own and control all data. Export or delete at any time.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function handleToggle(index: number) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <section
      style={{
        background: "var(--color-cream)",
        paddingTop: "clamp(80px,10vw,130px)",
        paddingBottom: "clamp(80px,10vw,130px)",
        paddingLeft: "var(--pad)",
        paddingRight: "var(--pad)",
        borderTop: "1px solid var(--color-line)",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "56px" }}>
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
          FAQ
        </p>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(44px,5.5vw,72px)",
            color: "var(--color-ink)",
            textTransform: "uppercase",
            textAlign: "center",
            margin: 0,
            lineHeight: 1,
          }}
        >
          COMMON QUESTIONS.
        </h2>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {faqs.map((faq, index) => (
          <div
            key={index}
            style={{
              borderBottom: "1px solid var(--color-line)",
              ...(index === 0
                ? { borderTop: "1px solid var(--color-line)" }
                : {}),
            }}
          >
            <button
              onClick={() => handleToggle(index)}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "22px 0",
                background: "transparent",
                border: 0,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "17px",
                  fontWeight: 500,
                  color: "var(--color-ink)",
                  flex: 1,
                  paddingRight: "16px",
                }}
              >
                {faq.question}
              </span>
              <ChevronDown
                size={20}
                color="var(--color-muted)"
                style={{
                  transform:
                    openIndex === index ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                  flexShrink: 0,
                }}
              />
            </button>

            <AnimatePresence initial={false}>
              {openIndex === index && (
                <motion.div
                  key="answer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: 0.28,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{ overflow: "hidden" }}
                >
                  <p
                    style={{
                      fontSize: "16px",
                      color: "var(--color-muted)",
                      lineHeight: 1.65,
                      paddingBottom: "22px",
                      maxWidth: "68ch",
                      margin: 0,
                    }}
                  >
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
