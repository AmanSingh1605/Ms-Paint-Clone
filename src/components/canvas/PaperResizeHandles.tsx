"use client";
import type { ResizeEdge } from "@/hooks/canvas/useCanvasResize";

const EDGES: { edge: ResizeEdge; className: string }[] = [
  { edge: "e", className: "cursor-e-resize -right-1 bottom-1/2" },
  { edge: "se", className: "cursor-se-resize -right-1 -bottom-1" },
  { edge: "s", className: "cursor-s-resize right-1/2 -bottom-1" },
];

export function PaperResizeHandles({
  onResizeStart,
}: {
  onResizeStart: (edge: ResizeEdge) => void;
}) {
  return (
    <>
      {EDGES.map(({ edge, className }) => (
        <div
          key={edge}
          className={`absolute h-2 w-2 rounded-full border border-blue-500 bg-white ${className}`}
          onMouseDown={() => onResizeStart(edge)}
        />
      ))}
    </>
  );
}
