"use client";
import { useRef, type RefObject } from "react";
import { useCommitOnOutsideClick } from "@/hooks/useCommitOnOutsideClick";
import { useDragInteraction } from "@/hooks/useDragInteraction";
import type { Point } from "@/lib/canvas/bounds";
import { shapeGeometry, type ShapeGeometry } from "@/lib/shapes/geometry";
import type { ShapeTypes } from "@/lib/shapes/types";
import { useColors, usePaper, useTools } from "@/state";
import { SvgResizeHandles } from "@/components/ui/ResizeHandles";
import { ShapePreview } from "./ShapePreview";

type Props = {
  shape: ShapeTypes;
  origin: Point;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  onCommit: (geometry: ShapeGeometry) => void;
  onDone: () => void;
};

// Drag-to-draw overlay shared by every shape tool.
export default function ShapeOverlay({
  shape,
  origin,
  canvasRef,
  onCommit,
  onDone,
}: Props) {
  const { size } = usePaper();
  const { primary } = useColors();
  const { brushWidth } = useTools();

  // The overlay spans the whole canvas, so a containment test cannot tell
  // inside from outside. Hovering the drawn parts is what counts.
  const hovering = useRef(false);
  const setHovering = (value: boolean) => {
    hovering.current = value;
  };

  const { bounds, boundsRef, isSizing, startResize, startMove, consumePendingClick } =
    useDragInteraction({ origin, canvasRef, limit: size });

  useCommitOnOutsideClick({
    isInside: () => hovering.current,
    consumePendingClick,
    onCommit: () => {
      const geometry = shapeGeometry[shape]?.(boundsRef.current);
      if (geometry) onCommit(geometry);
      onDone();
    },
  });

  const geometry = shapeGeometry[shape]?.(bounds) ?? null;

  return (
    <div
      className="absolute left-0 top-0 bg-transparent"
      style={{ height: size.height, width: size.width }}
    >
      <svg height={size.height} width={size.width}>
        {/* Dashed bounding box; doubles as the drag-to-move target. */}
        <rect
          x={bounds.startX}
          y={bounds.startY}
          width={Math.max(bounds.endX - bounds.startX, 0)}
          height={Math.max(bounds.endY - bounds.startY, 0)}
          strokeDasharray={5}
          style={{ visibility: isSizing ? "hidden" : "visible" }}
          className="cursor-move fill-transparent stroke-black"
          onMouseDown={startMove}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        />

        <ShapePreview
          geometry={geometry}
          stroke={primary}
          strokeWidth={brushWidth}
          onHoverChange={setHovering}
        />

        <SvgResizeHandles
          bounds={bounds}
          hidden={isSizing}
          onResizeStart={startResize}
          onHoverChange={setHovering}
        />
      </svg>
    </div>
  );
}
