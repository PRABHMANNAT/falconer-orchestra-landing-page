"use client";

import { useId, useMemo, useState, type SVGProps } from "react";

import { cn } from "@/lib/utils";

type InteractiveGridPatternProps = SVGProps<SVGSVGElement> & {
  width?: number;
  height?: number;
  squares?: [number, number];
};

export function InteractiveGridPattern({
  className,
  width = 40,
  height = 40,
  squares = [24, 24],
  ...props
}: InteractiveGridPatternProps) {
  const id = useId();
  const patternId = `interactive-grid-${id.replace(/:/g, "")}`;
  const [activeSquare, setActiveSquare] = useState<number | null>(null);
  const [columns, rows] = squares;

  const cells = useMemo(
    () =>
      Array.from({ length: columns * rows }, (_, index) => ({
        index,
        x: (index % columns) * width,
        y: Math.floor(index / columns) * height,
      })),
    [columns, height, rows, width]
  );

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-auto absolute h-full w-full fill-transparent stroke-current text-[rgba(14,29,11,0.12)]",
        className
      )}
      {...props}
    >
      <defs>
        <pattern id={patternId} width={width} height={height} patternUnits="userSpaceOnUse">
          <path d={`M ${width} 0 L 0 0 0 ${height}`} fill="none" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      <svg x="50%" y="50%" className="overflow-visible">
        {cells.map((cell) => (
          <rect
            key={cell.index}
            x={cell.x - (columns * width) / 2}
            y={cell.y - (rows * height) / 2}
            width={width}
            height={height}
            className={cn(
              "transition-colors duration-150",
              activeSquare === cell.index ? "fill-[rgba(217,119,87,0.18)]" : "fill-transparent"
            )}
            onMouseEnter={() => setActiveSquare(cell.index)}
            onMouseLeave={() => setActiveSquare(null)}
          />
        ))}
      </svg>
    </svg>
  );
}
