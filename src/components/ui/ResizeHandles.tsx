"use client";
import type { Bounds, ResizeDirection } from "@/lib/canvas/bounds";

type HandleSpec = {
  direction: ResizeDirection;
  // Spelled out in full: Tailwind scans source text, so a class assembled at
  // runtime would never be emitted.
  cursor: string;
  // Absolute placement for the DOM variant.
  position: string;
  // Centre point for the SVG variant.
  at: (bounds: Bounds) => [number, number];
};

export const RESIZE_HANDLES: readonly HandleSpec[] = [
  {
    direction: "nw",
    cursor: "cursor-nw-resize",
    position: "-top-1 -left-1",
    at: (b) => [b.startX, b.startY],
  },
  {
    direction: "n",
    cursor: "cursor-n-resize",
    position: "-top-1 left-1/2",
    at: (b) => [(b.startX + b.endX) / 2, b.startY],
  },
  {
    direction: "ne",
    cursor: "cursor-ne-resize",
    position: "-top-1 -right-1",
    at: (b) => [b.endX, b.startY],
  },
  {
    direction: "e",
    cursor: "cursor-e-resize",
    position: "top-1/2 -right-1",
    at: (b) => [b.endX, (b.startY + b.endY) / 2],
  },
  {
    direction: "se",
    cursor: "cursor-se-resize",
    position: "-bottom-1 -right-1",
    at: (b) => [b.endX, b.endY],
  },
  {
    direction: "s",
    cursor: "cursor-s-resize",
    position: "-bottom-1 left-1/2",
    at: (b) => [(b.startX + b.endX) / 2, b.endY],
  },
  {
    direction: "sw",
    cursor: "cursor-sw-resize",
    position: "-bottom-1 -left-1",
    at: (b) => [b.startX, b.endY],
  },
  {
    direction: "w",
    cursor: "cursor-w-resize",
    position: "top-1/2 -left-1",
    at: (b) => [b.startX, (b.startY + b.endY) / 2],
  },
];

type Props = {
  onResizeStart: (direction: ResizeDirection) => void;
  // Stops the parent's move-drag from also starting.
  stopPropagation?: boolean;
};

export function ResizeHandles({ onResizeStart, stopPropagation }: Props) {
  return (
    <>
      {RESIZE_HANDLES.map((handle) => (
        <div
          key={handle.direction}
          onMouseDown={(event) => {
            if (stopPropagation) event.stopPropagation();
            onResizeStart(handle.direction);
          }}
          className={`absolute h-2 w-2 rounded-full bg-blue-500 ${handle.position} ${handle.cursor}`}
        />
      ))}
    </>
  );
}

// The same handles drawn as SVG circles, for the shape overlay.
export function SvgResizeHandles({
  bounds,
  onResizeStart,
  hidden,
  onHoverChange,
}: Props & {
  bounds: Bounds;
  hidden?: boolean;
  onHoverChange?: (hovering: boolean) => void;
}) {
  if (hidden) return null;

  return (
    <>
      {RESIZE_HANDLES.map((handle) => {
        const [cx, cy] = handle.at(bounds);
        return (
          <circle
            key={handle.direction}
            cx={cx}
            cy={cy}
            r={4}
            className={`fill-white stroke-sky-300 ${handle.cursor}`}
            onMouseDown={() => onResizeStart(handle.direction)}
            onMouseEnter={() => onHoverChange?.(true)}
            onMouseLeave={() => onHoverChange?.(false)}
          />
        );
      })}
    </>
  );
}
