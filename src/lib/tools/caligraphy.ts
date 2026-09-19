import type { Point } from "@/lib/canvas/bounds";

const NIB_X = 4;
const NIB_Y = 6;

// Stamps a short slanted nib along the line between the two points.
export function drawCaligraphyStroke(
  pen: CanvasRenderingContext2D,
  from: Point | null,
  to: Point,
  color: string
) {
  if (!from) return;

  pen.strokeStyle = color;
  pen.lineWidth = 1;

  for (const point of interpolate(from, to)) {
    pen.moveTo(point.x, point.y);
    pen.lineTo(point.x + NIB_X, point.y + NIB_Y);
    pen.stroke();
  }
}

/** Samples one point per pixel along the dominant axis of the segment. */
function interpolate(from: Point, to: Point): Point[] {
  const points: Point[] = [];
  const diffX = to.x - from.x;
  const diffY = to.y - from.y;
  const slope = diffX !== 0 ? diffY / diffX : 0;
  const intercept = from.y - slope * from.x;

  if (Math.abs(diffX) >= Math.abs(diffY)) {
    for (let x = Math.min(from.x, to.x); x < Math.max(from.x, to.x); x += 1)
      points.push({ x, y: slope * x + intercept });
  } else {
    for (let y = Math.min(from.y, to.y); y <= Math.max(from.y, to.y); y += 1)
      points.push({
        x: slope !== 0 ? Math.round((y - intercept) / slope) : from.x,
        y,
      });
  }

  return points;
}
