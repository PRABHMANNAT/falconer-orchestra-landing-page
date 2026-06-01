// Shared constellation SVG art. Used by the writing section in page.tsx and
// (with a different style scope) by the footer intro block.
export default function Constellation({
  muted = false,
  tight = false
}: {
  muted?: boolean;
  tight?: boolean;
}) {
  const nodes = [
    { x: 120, y: 90, r: 7 },
    { x: 250, y: 60, r: 5 },
    { x: 360, y: 140, r: 9 },
    { x: 470, y: 95, r: 5 },
    { x: 175, y: 220, r: 6 },
    { x: 300, y: 250, r: 11 },
    { x: 430, y: 235, r: 6 },
    { x: 110, y: 360, r: 5 },
    { x: 235, y: 400, r: 7 },
    { x: 380, y: 370, r: 8 },
    { x: 500, y: 330, r: 5 }
  ];
  const edges: Array<[number, number]> = [
    [0, 1], [1, 2], [2, 3], [0, 4], [4, 5], [2, 5], [5, 6], [3, 6],
    [4, 7], [5, 8], [8, 9], [6, 9], [9, 10], [7, 8]
  ];

  return (
    <svg
      className={`bird-art ${muted ? "muted" : ""}`}
      viewBox={tight ? "90 40 430 380" : "0 0 600 460"}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1.4" opacity={muted ? 0.5 : 0.32}>
        {edges.map(([a, b], i) => (
          <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} />
        ))}
      </g>
      <g fill="currentColor">
        {nodes.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={n.r} opacity={0.55 + n.r / 24} />
        ))}
      </g>
    </svg>
  );
}
