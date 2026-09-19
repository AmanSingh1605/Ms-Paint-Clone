import { useRef, type RefObject } from "react";
import { useElementEvent } from "@/hooks/useElementEvent";
import type { Point } from "@/lib/canvas/bounds";
import { canvasPoint } from "@/lib/canvas/point";
import { drawCaligraphyStroke } from "@/lib/tools/caligraphy";
import { BrushName, STROKE_BRUSHES, ToolName } from "@/lib/tools/names";
import { useColors, useTools } from "@/state";

// Brush name to lineCap.
const LINE_CAP: Record<string, CanvasLineCap> = {
  [BrushName.Normal]: "round",
  [BrushName.Square]: "square",
  [BrushName.Smooth]: "butt",
};

// Freehand painting: stroke brushes, calligraphy pen, pencil and eraser.
export function usePainting(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  eraserSize: number
) {
  const { primary } = useColors();
  const { activeTool, isBrushActive, brushType, brushWidth } = useTools();

  const painting = useRef(false);
  const previous = useRef<Point | null>(null);

  const paint = (event: MouseEvent) => {
    const canvas = canvasRef.current;
    const pen = canvas?.getContext("2d");
    if (!painting.current || !canvas || !pen) return;

    const point = canvasPoint(event, canvas);

    if (isBrushActive) {
      if (STROKE_BRUSHES.includes(brushType)) {
        pen.strokeStyle = primary;
        pen.lineWidth = brushWidth;
        pen.lineCap = LINE_CAP[brushType] ?? "round";
        pen.lineTo(point.x, point.y);
        pen.stroke();
      } else if (brushType === BrushName.Caligraphy) {
        drawCaligraphyStroke(pen, previous.current, point, primary);
      }
    }

    if (activeTool === ToolName.Pencil) {
      pen.strokeStyle = primary;
      pen.lineWidth = 1;
      pen.lineCap = "square";
      pen.lineTo(point.x, point.y);
      pen.stroke();
    }

    if (activeTool === ToolName.Eraser) {
      pen.clearRect(
        point.x - eraserSize / 2,
        point.y - eraserSize / 2,
        eraserSize,
        eraserSize
      );
    }

    previous.current = point;
  };

  useElementEvent(canvasRef, "mousedown", (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    painting.current = true;
    canvas.getContext("2d")?.beginPath();
    previous.current = canvasPoint(event, canvas);
    paint(event);
  });

  useElementEvent(canvasRef, "mousemove", paint);

  useElementEvent(canvasRef, "mouseup", () => {
    painting.current = false;
    previous.current = null;
  });

  useElementEvent(canvasRef, "mouseleave", () => {
    painting.current = false;
    previous.current = null;
  });
}
