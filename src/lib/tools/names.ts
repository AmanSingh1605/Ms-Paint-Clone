export const ToolName = {
  Pencil: "Pencil",
  Fill: "Fill",
  Eraser: "Eraser",
  Text: "Text",
  Picker: "Picker",
  Magnify: "Magnify",
  Select: "Select",
} as const;

export type ToolName = (typeof ToolName)[keyof typeof ToolName];

export const BrushName = {
  Normal: "Normal Brush",
  Square: "Square Brush",
  Smooth: "Smooth Brush",
  Caligraphy: "Caligraphy Pen",
} as const;

export type BrushName = (typeof BrushName)[keyof typeof BrushName];

// Plain canvas strokes, differing only by lineCap.
export const STROKE_BRUSHES: readonly BrushName[] = [
  BrushName.Normal,
  BrushName.Square,
  BrushName.Smooth,
];

export const ERASER_SIZE = { min: 6, max: 50, initial: 12 } as const;
