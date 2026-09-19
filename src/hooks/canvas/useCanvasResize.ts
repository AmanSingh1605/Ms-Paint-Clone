import { useCallback, useRef, useState, type RefObject } from "react";
import { useWindowEvent } from "@/hooks/useWindowEvent";
import { usePaper } from "@/state";

export type ResizeEdge = "e" | "s" | "se";

// Changing a canvas width or height clears it, so the pixels are snapshotted
// when the drag starts and painted back when it ends.
export function useCanvasResize(canvasRef: RefObject<HTMLCanvasElement | null>) {
  const { setSize } = usePaper();
  const [edge, setEdge] = useState<ResizeEdge | null>(null);
  const snapshot = useRef<ImageData | null>(null);

  const startResize = useCallback(
    (direction: ResizeEdge) => {
      const canvas = canvasRef.current;
      const pen = canvas?.getContext("2d");
      if (canvas && pen)
        snapshot.current = pen.getImageData(0, 0, canvas.width, canvas.height);
      setEdge(direction);
    },
    [canvasRef]
  );

  useWindowEvent("mousemove", (event) => {
    const canvas = canvasRef.current;
    if (!edge || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    if (edge === "s" || edge === "se")
      canvas.height = Math.max(event.clientY - rect.top, 1);
    if (edge === "e" || edge === "se")
      canvas.width = Math.max(event.clientX - rect.left, 1);

    setSize({ width: canvas.width, height: canvas.height });
  });

  useWindowEvent("mouseup", () => {
    if (!edge) return;
    const pen = canvasRef.current?.getContext("2d");
    if (pen && snapshot.current) pen.putImageData(snapshot.current, 0, 0);
    snapshot.current = null;
    setEdge(null);
  });

  return { startResize, isResizing: edge !== null };
}
