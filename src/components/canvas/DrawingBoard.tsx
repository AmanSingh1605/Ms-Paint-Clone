"use client";
import { useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useCanvasResize } from "@/hooks/canvas/useCanvasResize";
import { useCanvasSetup } from "@/hooks/canvas/useCanvasSetup";
import { usePainting } from "@/hooks/canvas/usePainting";
import { useToolCursor } from "@/hooks/canvas/useToolCursor";
import { useElementEvent } from "@/hooks/useElementEvent";
import type { Point } from "@/lib/canvas/bounds";
import { canvasPoint } from "@/lib/canvas/point";
import { strokeGeometry, type ShapeGeometry } from "@/lib/shapes/geometry";
import type { ShapeTypes } from "@/lib/shapes/types";
import { floodFill } from "@/lib/tools/fill";
import { ERASER_SIZE, ToolName } from "@/lib/tools/names";
import { pickColor } from "@/lib/tools/picker";
import { useColors, useTools } from "@/state";
import SelectionOverlay from "@/components/overlays/SelectionOverlay";
import ShapeOverlay from "@/components/overlays/ShapeOverlay";
import TextBox from "@/components/overlays/TextBox";
import { EraserCursor } from "./EraserCursor";
import { PaperResizeHandles } from "./PaperResizeHandles";

type Overlay =
  | { kind: "shape"; shape: ShapeTypes; origin: Point }
  | { kind: "selection"; origin: Point }
  | { kind: "text"; origin: Point }
  | null;

export default function DrawingBoard() {
  const { primary, setPrimary } = useColors();
  const { activeTool, activeShape, brushWidth } = useTools();

  const [overlay, setOverlay] = useState<Overlay>(null);
  const [eraserSize, setEraserSize] = useState<number>(ERASER_SIZE.initial);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const eraserRef = useRef<HTMLDivElement>(null);

  useCanvasSetup(canvasRef, boardRef);
  usePainting(canvasRef, eraserSize);
  useToolCursor(canvasRef, eraserRef);
  const { startResize } = useCanvasResize(canvasRef);

  // Shift rather than Ctrl, which would collide with the browser's redo.
  useHotkeys("shift+i", () => {
    if (activeTool === ToolName.Eraser)
      setEraserSize((size) => Math.min(size + 1, ERASER_SIZE.max));
  });
  useHotkeys("shift+y", () => {
    if (activeTool === ToolName.Eraser)
      setEraserSize((size) => Math.max(size - 1, ERASER_SIZE.min));
  });

  // Overlays open on press so the same gesture can drag them out to size.
  useElementEvent(canvasRef, "mousedown", (event) => {
    const canvas = canvasRef.current;
    if (!canvas || overlay) return;
    const origin = canvasPoint(event, canvas);

    if (activeShape) setOverlay({ kind: "shape", shape: activeShape, origin });
    else if (activeTool === ToolName.Select)
      setOverlay({ kind: "selection", origin });
  });

  // Tools that act on a single point.
  useElementEvent(canvasRef, "click", (event) => {
    const canvas = canvasRef.current;
    const pen = canvas?.getContext("2d");
    if (!canvas || !pen || overlay) return;
    const { x, y } = canvasPoint(event, canvas);

    if (activeTool === ToolName.Fill) floodFill(canvas, pen, x, y, primary);
    if (activeTool === ToolName.Text) setOverlay({ kind: "text", origin: { x, y } });
    if (activeTool === ToolName.Picker) {
      const color = pickColor(event, canvas);
      if (color) setPrimary(color);
    }
  });

  const commitShape = (geometry: ShapeGeometry) => {
    const pen = canvasRef.current?.getContext("2d");
    if (pen) strokeGeometry(pen, geometry, primary, brushWidth);
  };

  const closeOverlay = () => setOverlay(null);

  return (
    <div className="h-full w-full" ref={boardRef}>
      <div className="relative h-fit w-fit">
        <canvas ref={canvasRef} className="bg-white" />

        <PaperResizeHandles onResizeStart={startResize} />

        {overlay?.kind === "shape" && (
          <ShapeOverlay
            shape={overlay.shape}
            origin={overlay.origin}
            canvasRef={canvasRef}
            onCommit={commitShape}
            onDone={closeOverlay}
          />
        )}

        {overlay?.kind === "selection" && (
          <SelectionOverlay
            origin={overlay.origin}
            canvasRef={canvasRef}
            onDone={closeOverlay}
          />
        )}

        {overlay?.kind === "text" && (
          <TextBox
            origin={overlay.origin}
            canvasRef={canvasRef}
            onDone={closeOverlay}
          />
        )}

        <EraserCursor ref={eraserRef} size={eraserSize} />
      </div>
    </div>
  );
}
