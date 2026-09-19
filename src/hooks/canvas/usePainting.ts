import { useRef, type RefObject } from "react";
import { useElementEvent } from "@/hooks/useElementEvent";
import { brushSpec } from "@/lib/brushes/painters";
import type { Point } from "@/lib/canvas/bounds";
import { canvasPoint } from "@/lib/canvas/point";
import { ToolName } from "@/lib/tools/names";
import { useColors, useTools } from "@/state";
import type { CanvasHistory } from "./useCanvasHistory";

function scratchCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

// Freehand painting: the brushes, the pencil and the eraser.
export function usePainting(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  eraserSize: number,
  history: CanvasHistory
) {
  const { primary } = useColors();
  const { activeTool, isBrushActive, brushType, brushWidth } = useTools();

  const painting = useRef(false);
  const previous = useRef<Point | null>(null);
  // Held only while a translucent brush is mid-stroke.
  const base = useRef<HTMLCanvasElement | null>(null);
  const layer = useRef<HTMLCanvasElement | null>(null);

  const paint = (event: MouseEvent) => {
    const canvas = canvasRef.current;
    const pen = canvas?.getContext("2d");
    if (!painting.current || !canvas || !pen) return;

    const to = canvasPoint(event, canvas);
    const from = previous.current ?? to;

    if (isBrushActive) {
      const { paint: painter, layerAlpha } = brushSpec(brushType);
      const layerPen = layer.current?.getContext("2d");

      if (layerAlpha && base.current && layerPen) {
        painter({ pen: layerPen, from, to, color: primary, width: brushWidth });
        pen.clearRect(0, 0, canvas.width, canvas.height);
        pen.drawImage(base.current, 0, 0);
        pen.save();
        pen.globalAlpha = layerAlpha;
        pen.drawImage(layer.current!, 0, 0);
        pen.restore();
      } else {
        painter({ pen, from, to, color: primary, width: brushWidth });
      }
    }

    if (activeTool === ToolName.Pencil) {
      pen.save();
      pen.strokeStyle = primary;
      pen.lineWidth = 1;
      pen.lineCap = "square";
      pen.beginPath();
      pen.moveTo(from.x, from.y);
      pen.lineTo(to.x, to.y);
      pen.stroke();
      pen.restore();
    }

    if (activeTool === ToolName.Eraser)
      pen.clearRect(
        to.x - eraserSize / 2,
        to.y - eraserSize / 2,
        eraserSize,
        eraserSize
      );

    previous.current = to;
  };

  const stop = () => {
    painting.current = false;
    previous.current = null;
    base.current = null;
    layer.current = null;
  };

  useElementEvent(canvasRef, "mousedown", (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const marks =
      isBrushActive ||
      activeTool === ToolName.Pencil ||
      activeTool === ToolName.Eraser;
    if (!marks) return;

    history.commit();
    painting.current = true;
    previous.current = null;

    if (isBrushActive && brushSpec(brushType).layerAlpha) {
      base.current = scratchCanvas(canvas.width, canvas.height);
      base.current.getContext("2d")?.drawImage(canvas, 0, 0);
      layer.current = scratchCanvas(canvas.width, canvas.height);
    }

    paint(event);
  });

  useElementEvent(canvasRef, "mousemove", paint);
  useElementEvent(canvasRef, "mouseup", stop);
  useElementEvent(canvasRef, "mouseleave", stop);
}
