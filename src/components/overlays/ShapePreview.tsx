"use client";
import type { ShapeGeometry } from "@/lib/shapes/geometry";

type Props = {
  geometry: ShapeGeometry | null;
  stroke: string;
  strokeWidth: number;
  onHoverChange: (hovering: boolean) => void;
};

// SVG counterpart of strokeGeometry. Both read the same geometry object.
export function ShapePreview({
  geometry,
  stroke,
  strokeWidth,
  onHoverChange,
}: Props) {
  if (!geometry) return null;

  const style = { stroke, strokeWidth, fill: "none" };
  const shared = {
    style,
    className: "cursor-move",
    onMouseEnter: () => onHoverChange(true),
    onMouseLeave: () => onHoverChange(false),
  };

  switch (geometry.kind) {
    case "line":
      return (
        <line
          x1={geometry.x1}
          y1={geometry.y1}
          x2={geometry.x2}
          y2={geometry.y2}
          {...shared}
        />
      );
    case "ellipse":
      return (
        <ellipse
          cx={geometry.cx}
          cy={geometry.cy}
          rx={geometry.rx}
          ry={geometry.ry}
          {...shared}
        />
      );
    case "rect":
      return (
        <rect
          x={geometry.x}
          y={geometry.y}
          width={Math.max(geometry.width, 0)}
          height={Math.max(geometry.height, 0)}
          rx={geometry.radius || undefined}
          {...shared}
        />
      );
    case "polygon":
      return (
        <polygon
          points={geometry.points.join(" ")}
          strokeLinejoin="round"
          {...shared}
        />
      );
  }
}
