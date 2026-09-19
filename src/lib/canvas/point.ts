import type { Point } from "./bounds";

// Read the rect per call so the result stays correct after scroll or resize.
export function canvasPoint(
  event: { clientX: number; clientY: number },
  canvas: HTMLCanvasElement
): Point {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}
