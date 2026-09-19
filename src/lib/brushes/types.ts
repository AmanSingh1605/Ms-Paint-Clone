import type { Point } from "@/lib/canvas/bounds";

// The nine brushes of the Windows 7 Paint brush menu, in menu order.
export const BrushName = {
  Brush: "Brush",
  Calligraphy1: "Calligraphy brush 1",
  Calligraphy2: "Calligraphy brush 2",
  Airbrush: "Airbrush",
  Oil: "Oil brush",
  Crayon: "Crayon",
  Marker: "Marker",
  NaturalPencil: "Natural pencil",
  Watercolor: "Watercolor brush",
} as const;

export type BrushName = (typeof BrushName)[keyof typeof BrushName];

export const BRUSH_ORDER: BrushName[] = [
  BrushName.Brush,
  BrushName.Calligraphy1,
  BrushName.Calligraphy2,
  BrushName.Airbrush,
  BrushName.Oil,
  BrushName.Crayon,
  BrushName.Marker,
  BrushName.NaturalPencil,
  BrushName.Watercolor,
];

export type Stroke = {
  pen: CanvasRenderingContext2D;
  // Equal to `to` on the first event of a gesture.
  from: Point;
  to: Point;
  color: string;
  width: number;
};

// One segment at a time. Nothing accumulates a path, so a textured brush can
// stamp along the segment however it likes.
export type BrushPainter = (stroke: Stroke) => void;

export type BrushSpec = {
  paint: BrushPainter;
  // Translucent brushes paint opaque onto a private layer composited at this
  // alpha. Painting them direct would darken every segment overlap.
  layerAlpha?: number;
};
