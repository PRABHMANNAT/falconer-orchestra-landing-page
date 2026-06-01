"use client";

export type TimelineItem = {
  id: string;
  label: string;
  brandColor: string;
};

export default function TimelineNav({
  items,
  activeId,
  onJump,
}: {
  items: TimelineItem[];
  activeId: string;
  onJump: (id: string) => void;
}) {
  return (
    <nav className="timeline-nav" aria-label="Feature sections">
      <p className="timeline-nav-title">Sources</p>
      <ol className="timeline-nav-list">
        {items.map((item, i) => {
          const active = item.id === activeId;
          return (
            <li key={item.id}>
              <button
                type="button"
                className={`timeline-nav-item${active ? " is-active" : ""}`}
                aria-current={active ? "true" : undefined}
                aria-label={`Jump to ${item.label}`}
                onClick={() => onJump(item.id)}
                style={{ ["--dot" as string]: item.brandColor }}
              >
                <span className="timeline-nav-dot" aria-hidden="true" />
                <span className="timeline-nav-num" aria-hidden="true">
                  {i < 9 ? `0${i + 1}` : i + 1}
                </span>
                <span className="timeline-nav-label">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
