import { hexToRgba, type Rgba } from "@/lib/color/hex";

// getImageData applies a colour space conversion that shifts scattered pixels
// by a point or two. Matching exactly would leave those pixels as speckles.
const TOLERANCE = 12;

type Matcher = (offset: number) => boolean;

export function floodFill(
  canvas: HTMLCanvasElement,
  pen: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string
) {
  const originX = Math.round(x);
  const originY = Math.round(y);
  if (
    originX < 0 ||
    originY < 0 ||
    originX >= canvas.width ||
    originY >= canvas.height
  )
    return;

  const image = pen.getImageData(0, 0, canvas.width, canvas.height);
  const data = image.data;

  // The seed must come from this same buffer. A separate single pixel read can
  // report a different value for that pixel, and then nothing ever matches.
  const seed = (originY * canvas.width + originX) * 4;
  const startColor: Rgba = {
    r: data[seed],
    g: data[seed + 1],
    b: data[seed + 2],
    a: data[seed + 3],
  };
  const fillColor = hexToRgba(color);

  // Painting must move pixels outside the matcher's range, or filled pixels
  // keep matching and the scan never terminates.
  if (withinTolerance(startColor, fillColor)) return;

  scanlineFill(
    data,
    canvas.width,
    canvas.height,
    originX,
    originY,
    makeMatcher(data, startColor),
    fillColor
  );
  pen.putImageData(image, 0, 0);
}

const withinTolerance = (a: Rgba, b: Rgba) =>
  Math.abs(a.r - b.r) <= TOLERANCE &&
  Math.abs(a.g - b.g) <= TOLERANCE &&
  Math.abs(a.b - b.b) <= TOLERANCE &&
  Math.abs(a.a - b.a) <= TOLERANCE;

function makeMatcher(data: Uint8ClampedArray, startColor: Rgba): Matcher {
  // Where a pixel is transparent its colour channels hold no meaning, so two
  // transparent pixels must compare equal whatever their stored RGB.
  const startIsClear = startColor.a <= TOLERANCE;
  if (startIsClear) return (offset) => data[offset + 3] <= TOLERANCE;

  return (offset) =>
    Math.abs(data[offset] - startColor.r) <= TOLERANCE &&
    Math.abs(data[offset + 1] - startColor.g) <= TOLERANCE &&
    Math.abs(data[offset + 2] - startColor.b) <= TOLERANCE &&
    Math.abs(data[offset + 3] - startColor.a) <= TOLERANCE;
}

function scanlineFill(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  x: number,
  y: number,
  matches: Matcher,
  fillColor: Rgba
) {
  const paint = (offset: number) => {
    data[offset] = fillColor.r;
    data[offset + 1] = fillColor.g;
    data[offset + 2] = fillColor.b;
    data[offset + 3] = fillColor.a;
  };

  const stack: Array<[number, number]> = [[x, y]];

  while (stack.length > 0) {
    const next = stack.pop();
    if (!next) break;
    const [seedX, seedY] = next;
    if (seedY < 0 || seedY >= height) continue;

    // Walk to the left edge of this run, then fill rightwards, queueing the
    // rows above and below once per contiguous span rather than per pixel.
    let left = seedX;
    while (left >= 0 && matches((seedY * width + left) * 4)) left--;
    left++;

    let spanAbove = false;
    let spanBelow = false;

    for (let col = left; col < width; col++) {
      const offset = (seedY * width + col) * 4;
      if (!matches(offset)) break;
      paint(offset);

      const aboveMatches =
        seedY > 0 && matches(((seedY - 1) * width + col) * 4);
      if (aboveMatches && !spanAbove) {
        stack.push([col, seedY - 1]);
        spanAbove = true;
      } else if (!aboveMatches) {
        spanAbove = false;
      }

      const belowMatches =
        seedY < height - 1 && matches(((seedY + 1) * width + col) * 4);
      if (belowMatches && !spanBelow) {
        stack.push([col, seedY + 1]);
        spanBelow = true;
      } else if (!belowMatches) {
        spanBelow = false;
      }
    }
  }
}
