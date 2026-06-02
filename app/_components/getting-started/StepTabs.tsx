"use client";

import { memo, useRef } from "react";

export type StepId = "connect" | "structure" | "ask";

const STEPS: { id: StepId; label: string; n: string; desc: string }[] = [
  {
    id: "connect",
    label: "Connect",
    n: "1",
    desc: "Plug in Slack, GitHub, Notion and more in a single click.",
  },
  {
    id: "structure",
    label: "Structure",
    n: "2",
    desc: "Every signal becomes one queryable company brain.",
  },
  {
    id: "ask",
    label: "Ask",
    n: "3",
    desc: "Socrates answers, cites its sources, and flags risk.",
  },
];

interface Props {
  active: StepId;
  onChange: (id: StepId) => void;
}

function StepTabsImpl({ active, onChange }: Props) {
  const tabRefs = useRef<Record<StepId, HTMLButtonElement | null>>({
    connect: null,
    structure: null,
    ask: null,
  });
  const activeIndex = STEPS.findIndex((s) => s.id === active);

  const onKey = (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const dir = e.key === "ArrowDown" ? 1 : -1;
    const next = (idx + dir + STEPS.length) % STEPS.length;
    const id = STEPS[next].id;
    onChange(id);
    tabRefs.current[id]?.focus();
  };

  return (
    <div role="tablist" aria-label="Getting started steps" className="gs-steps">
      {STEPS.map((s, i) => {
        const isActive = s.id === active;
        const isDone = i < activeIndex;
        return (
          <button
            key={s.id}
            ref={(el) => {
              tabRefs.current[s.id] = el;
            }}
            type="button"
            role="tab"
            id={`gs-tab-${s.id}`}
            aria-selected={isActive}
            aria-controls={`gs-panel-${s.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(s.id)}
            onKeyDown={(e) => onKey(e, i)}
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
  );
}

export default memo(StepTabsImpl);
