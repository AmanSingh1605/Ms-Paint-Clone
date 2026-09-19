import type { Bounds } from "@/lib/canvas/bounds";
import { ShapeTypes } from "./types";

/** A shape reduced to something both the SVG preview and the canvas can draw. */
export type ShapeGeometry =
  | { kind: "line"; x1: number; y1: number; x2: number; y2: number }
  | { kind: "ellipse"; cx: number; cy: number; rx: number; ry: number }
  | {
      kind: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
      radius: number;
    }
  | { kind: "polygon"; points: number[] };

type GeometryFn = (bounds: Bounds) => ShapeGeometry;

const polygon =
  (points: (bounds: Bounds) => number[]): GeometryFn =>
  (bounds) => ({ kind: "polygon", points: points(bounds) });

// The only per-shape knowledge in the app. Every shape is a function of the
// drag rectangle, so the preview and the committed stroke cannot disagree.
export const shapeGeometry: Partial<Record<ShapeTypes, GeometryFn>> = {
  [ShapeTypes.Line]: ({ startX, startY, endX, endY }) => ({
    kind: "line",
    x1: startX,
    y1: startY,
    x2: endX,
    y2: endY,
  }),

  [ShapeTypes.Circle]: ({ startX, startY, endX, endY }) => ({
    kind: "ellipse",
    cx: (startX + endX) / 2,
    cy: (startY + endY) / 2,
    rx: Math.abs(endX - startX) / 2,
    ry: Math.abs(endY - startY) / 2,
  }),

  [ShapeTypes.Rectangle]: ({ startX, startY, endX, endY }) => ({
    kind: "rect",
    x: startX,
    y: startY,
    width: endX - startX,
    height: endY - startY,
    radius: 0,
  }),

  [ShapeTypes.RoundedRectangle]: ({ startX, startY, endX, endY }) => ({
    kind: "rect",
    x: startX,
    y: startY,
    width: endX - startX,
    height: endY - startY,
    radius: 20,
  }),

  [ShapeTypes.Triangle]: polygon(({ startX, startY, endX, endY }) => [
    startX, endY,
    (startX + endX) / 2, startY,
    endX, endY,
  ]),

  [ShapeTypes.RightTriangle]: polygon(({ startX, startY, endX, endY }) => [
    startX, startY,
    startX, endY,
    endX, endY,
  ]),

  [ShapeTypes.Diamond]: polygon(({ startX, startY, endX, endY }) => [
    startX, (startY + endY) / 2,
    (startX + endX) / 2, startY,
    endX, (startY + endY) / 2,
    (startX + endX) / 2, endY,
  ]),

  [ShapeTypes.Pentagon]: polygon(({ startX, startY, endX, endY }) => {
    const w = endX - startX;
    const h = endY - startY;
    return [
      (startX + endX) / 2, startY,
      endX, startY + h * 0.33,
      startX + w * 0.8, endY,
      startX + w * 0.2, endY,
      startX, startY + h * 0.33,
    ];
  }),

  [ShapeTypes.Hexagon]: polygon(({ startX, startY, endX, endY }) => {
    const h = endY - startY;
    return [
      (startX + endX) / 2, startY,
      endX, startY + h * 0.2,
      endX, startY + h * 0.8,
      (startX + endX) / 2, endY,
      startX, startY + h * 0.8,
      startX, startY + h * 0.2,
    ];
  }),

  [ShapeTypes.RightArrow]: polygon(({ startX, startY, endX, endY }) => {
    const h = endY - startY;
    const midX = (startX + endX) / 2;
    return [
      startX, startY + h * 0.25,
      startX, startY + h * 0.75,
      midX, startY + h * 0.75,
      midX, endY,
      endX, (startY + endY) / 2,
      midX, startY,
      midX, startY + h * 0.25,
    ];
  }),

  [ShapeTypes.LeftArrow]: polygon(({ startX, startY, endX, endY }) => {
    const h = endY - startY;
    const midX = (startX + endX) / 2;
    return [
      endX, startY + h * 0.25,
      endX, startY + h * 0.75,
      midX, startY + h * 0.75,
      midX, endY,
      startX, (startY + endY) / 2,
      midX, startY,
      midX, startY + h * 0.25,
    ];
  }),

  [ShapeTypes.UpArrow]: polygon(({ startX, startY, endX, endY }) => {
    const w = endX - startX;
    const midY = (startY + endY) / 2;
    return [
      startX + w * 0.25, endY,
      startX + w * 0.75, endY,
      startX + w * 0.75, midY,
      endX, midY,
      (startX + endX) / 2, startY,
      startX, midY,
      startX + w * 0.25, midY,
    ];
  }),

  [ShapeTypes.DownArrow]: polygon(({ startX, startY, endX, endY }) => {
    const w = endX - startX;
    const midY = (startY + endY) / 2;
    return [
      startX + w * 0.25, startY,
      startX + w * 0.75, startY,
      startX + w * 0.75, midY,
      endX, midY,
      (startX + endX) / 2, endY,
      startX, midY,
      startX + w * 0.25, midY,
    ];
  }),

  [ShapeTypes.FourPointStar]: polygon(({ startX, startY, endX, endY }) => {
    const w = endX - startX;
    const h = endY - startY;
    return [
      (startX + endX) / 2, startY,
      startX + w * 0.4, startY + h * 0.4,
      startX, (startY + endY) / 2,
      startX + w * 0.4, startY + h * 0.6,
      (startX + endX) / 2, endY,
      startX + w * 0.6, startY + h * 0.6,
      endX, (startY + endY) / 2,
      startX + w * 0.6, startY + h * 0.4,
    ];
  }),

  [ShapeTypes.FivePointStar]: polygon(({ startX, startY, endX, endY }) => {
    const w = endX - startX;
    const h = endY - startY;
    return [
      (startX + endX) / 2, startY,
      startX + w * 0.4, startY + h * 0.4,
      startX, startY + h * 0.4,
      startX + w * 0.3, startY + h * 0.6,
      startX + w * 0.2, endY,
      (startX + endX) / 2, startY + h * 0.75,
      startX + w * 0.8, endY,
      startX + w * 0.7, startY + h * 0.6,
      endX, startY + h * 0.4,
      startX + w * 0.6, startY + h * 0.4,
    ];
  }),

  [ShapeTypes.SixPointStar]: polygon(({ startX, startY, endX, endY }) => {
    const w = endX - startX;
    const h = endY - startY;
    return [
      (startX + endX) / 2, startY,
      startX + w * 0.33, startY + h * 0.25,
      startX, startY + h * 0.25,
      startX + w * 0.17, (startY + endY) / 2,
      startX, startY + h * 0.75,
      startX + w * 0.33, startY + h * 0.75,
      (startX + endX) / 2, endY,
      startX + w * 0.7, startY + h * 0.75,
      endX, startY + h * 0.75,
      startX + w * 0.83, (startY + endY) / 2,
      endX, startY + h * 0.25,
      startX + w * 0.7, startY + h * 0.25,
    ];
  }),
};

// Must mirror ShapePreview exactly.
export function strokeGeometry(
  pen: CanvasRenderingContext2D,
  geometry: ShapeGeometry,
  strokeStyle: string,
  lineWidth: number
) {
  pen.beginPath();
  pen.strokeStyle = strokeStyle;
  pen.lineWidth = lineWidth;
  pen.lineCap = "round";
  pen.lineJoin = "round";

  switch (geometry.kind) {
    case "line":
      pen.moveTo(geometry.x1, geometry.y1);
      pen.lineTo(geometry.x2, geometry.y2);
      break;
    case "ellipse":
      pen.ellipse(
        geometry.cx,
        geometry.cy,
        geometry.rx,
        geometry.ry,
        0,
        0,
        2 * Math.PI
      );
      break;
    case "rect":
      if (geometry.radius > 0)
        pen.roundRect(
          geometry.x,
          geometry.y,
          geometry.width,
          geometry.height,
          geometry.radius
        );
      else pen.rect(geometry.x, geometry.y, geometry.width, geometry.height);
      break;
    case "polygon": {
      const [firstX, firstY, ...rest] = geometry.points;
      pen.moveTo(firstX, firstY);
      for (let i = 0; i < rest.length; i += 2) pen.lineTo(rest[i], rest[i + 1]);
      pen.closePath();
      break;
    }
  }

  pen.stroke();
}
