import { boundsSize, type Bounds } from "@/lib/canvas/bounds";

export function cutRegion(
  canvas: HTMLCanvasElement,
  bounds: Bounds
): string {
  const pen = canvas.getContext("2d");
  const { width, height } = boundsSize(bounds);
  if (!pen || width <= 0 || height <= 0) return "";

  const buffer = document.createElement("canvas");
  const bufferPen = buffer.getContext("2d");
  if (!bufferPen) return "";

  buffer.width = width;
  buffer.height = height;
  bufferPen.drawImage(
    canvas,
    bounds.startX,
    bounds.startY,
    width,
    height,
    0,
    0,
    width,
    height
  );

  pen.clearRect(bounds.startX, bounds.startY, width, height);
  return buffer.toDataURL("image/png");
}

export function pasteRegion(
  canvas: HTMLCanvasElement,
  bounds: Bounds,
  dataUrl: string
) {
  const pen = canvas.getContext("2d");
  const { width, height } = boundsSize(bounds);
  if (!pen || !dataUrl || width <= 0 || height <= 0) return;

  // Decoding is async even for a data URL, so the draw must wait for load.
  const image = new Image();
  image.onload = () => {
    pen.drawImage(
      image,
      0,
      0,
      image.width,
      image.height,
      bounds.startX,
      bounds.startY,
      width,
      height
    );
  };
  image.src = dataUrl;
}
