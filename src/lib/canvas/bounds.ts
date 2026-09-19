// Rectangle maths shared by the shape, selection and text overlays.

export type Point = { x: number; y: number };

export type Size = { width: number; height: number };

/** An axis-aligned rectangle in canvas pixel coordinates. */
export type Bounds = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

export type ResizeDirection =
  | "n"
  | "s"
  | "e"
  | "w"
  | "ne"
  | "nw"
  | "se"
  | "sw";

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const boundsWidth = (bounds: Bounds) => bounds.endX - bounds.startX;

export const boundsHeight = (bounds: Bounds) => bounds.endY - bounds.startY;

export const boundsSize = (bounds: Bounds): Size => ({
  width: boundsWidth(bounds),
  height: boundsHeight(bounds),
});

export const boundsFromOrigin = (origin: Point, size: Size = { width: 0, height: 0 }): Bounds => ({
  startX: origin.x,
  startY: origin.y,
  endX: origin.x + size.width,
  endY: origin.y + size.height,
});

// Normalised so dragging in any direction yields a valid rectangle.
export const boundsFromDrag = (anchor: Point, point: Point): Bounds => ({
  startX: Math.min(anchor.x, point.x),
  startY: Math.min(anchor.y, point.y),
  endX: Math.max(anchor.x, point.x),
  endY: Math.max(anchor.y, point.y),
});

/** Moves whichever edges the handle direction names, never past `minSize`. */
export function resizeBounds(
  bounds: Bounds,
  direction: ResizeDirection,
  point: Point,
  minSize: number
): Bounds {
  const next = { ...bounds };
  if (direction.includes("n"))
    next.startY = Math.min(point.y, bounds.endY - minSize);
  if (direction.includes("s"))
    next.endY = Math.max(point.y, bounds.startY + minSize);
  if (direction.includes("w"))
    next.startX = Math.min(point.x, bounds.endX - minSize);
  if (direction.includes("e"))
    next.endX = Math.max(point.x, bounds.startX + minSize);
  return next;
}

/** Translates the rectangle, optionally keeping it inside `limit`. */
export function translateBounds(
  bounds: Bounds,
  deltaX: number,
  deltaY: number,
  limit?: Size
): Bounds {
  const { width, height } = boundsSize(bounds);
  let startX = bounds.startX + deltaX;
  let startY = bounds.startY + deltaY;

  if (limit) {
    startX = clamp(startX, 0, Math.max(limit.width - width, 0));
    startY = clamp(startY, 0, Math.max(limit.height - height, 0));
  }

  return {
    startX,
    startY,
    endX: startX + width,
    endY: startY + height,
  };
}
