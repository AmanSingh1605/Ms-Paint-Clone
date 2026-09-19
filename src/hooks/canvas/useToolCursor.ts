import { useEffect, type RefObject } from "react";
import { useElementEvent } from "@/hooks/useElementEvent";
import { canvasPoint } from "@/lib/canvas/point";
import { ToolName } from "@/lib/tools/names";
import { useColors, useTools } from "@/state";

// Trailing numbers are the hotspot in image pixels. Without them the browser
// uses the image centre, which for the bucket is not the paint drip.
const TOOL_CURSORS: Partial<Record<ToolName, string>> = {
  [ToolName.Pencil]: "url(/pencil-cursor.svg), auto",
  [ToolName.Picker]: "url(/picker-cursor.svg), auto",
  [ToolName.Text]: "url(/text-cursor.svg), auto",
  [ToolName.Fill]: "url(/fill-cursor.svg) 3 20, auto",
};

const BRUSH_CURSOR = "url(/brush-cursor.svg), auto";

// The eraser has no cursor image; a square indicator follows the pointer.
export function useToolCursor(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  eraserRef: RefObject<HTMLElement | null>
) {
  const { secondary } = useColors();
  const { activeTool, isBrushActive } = useTools();
  const isErasing = activeTool === ToolName.Eraser;

  useEffect(() => {
    const canvas = canvasRef.current;
    const eraser = eraserRef.current;
    if (!canvas) return;

    if (isErasing) {
      canvas.style.cursor = "none";
      if (eraser) eraser.style.backgroundColor = secondary;
    } else if (activeTool && TOOL_CURSORS[activeTool]) {
      canvas.style.cursor = TOOL_CURSORS[activeTool]!;
    } else if (isBrushActive) {
      canvas.style.cursor = BRUSH_CURSOR;
    } else {
      canvas.style.cursor = "default";
    }
  }, [canvasRef, eraserRef, activeTool, isBrushActive, isErasing, secondary]);

  useElementEvent(
    canvasRef,
    "mousemove",
    (event) => {
      const canvas = canvasRef.current;
      const eraser = eraserRef.current;
      if (!canvas || !eraser) return;
      const { x, y } = canvasPoint(event, canvas);
      eraser.style.display = "block";
      eraser.style.left = `${x - eraser.clientWidth / 2}px`;
      eraser.style.top = `${y - eraser.clientHeight / 2}px`;
    },
    isErasing
  );

  useElementEvent(
    canvasRef,
    "mouseleave",
    () => {
      const eraser = eraserRef.current;
      if (eraser) eraser.style.display = "none";
    },
    isErasing
  );
}
