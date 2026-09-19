import { canvasPoint } from "@/lib/canvas/point";
import { rgbaToHex } from "@/lib/color/hex";

export function pickColor(
  event: { clientX: number; clientY: number },
  canvas: HTMLCanvasElement
): string | null {
  const pen = canvas.getContext("2d");
  if (!pen) return null;

  const { x, y } = canvasPoint(event, canvas);
  const [r, g, b] = pen.getImageData(Math.round(x), Math.round(y), 1, 1).data;
  return rgbaToHex({ r, g, b, a: 255 });
}
