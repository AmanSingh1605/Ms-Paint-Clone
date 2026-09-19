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

export const ERASER_SIZE = { min: 6, max: 50, initial: 12 } as const;
