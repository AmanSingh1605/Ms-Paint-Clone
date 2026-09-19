import { boundsSize, type Bounds } from "@/lib/canvas/bounds";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export type TextStyle = {
  color: string;
  background: string;
  fontSize?: number;
};

// Rasterises text through an SVG foreignObject. The body must be escaped and
// the document URI encoded, or any markup character breaks the SVG.
export function renderTextToCanvas(
  canvas: HTMLCanvasElement,
  text: string,
  bounds: Bounds,
  { color, background, fontSize = 20 }: TextStyle
) {
  const { width, height } = boundsSize(bounds);
  if (!text || width <= 0 || height <= 0) return;

  const body = escapeHtml(text).replace(/\n/g, "<br/>");
  const style = [
    `color:${color}`,
    `background-color:${background}`,
    `width:${Math.round(width)}px`,
    `height:${Math.round(height)}px`,
    `font-size:${fontSize}px`,
    "line-height:1.5",
    "margin:0",
    "font-family:sans-serif",
    "word-wrap:break-word",
    "overflow-wrap:break-word",
  ].join(";");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(width)}" height="${Math.round(height)}">
  <foreignObject x="0" y="0" width="${Math.round(width)}" height="${Math.round(height)}">
    <div xmlns="http://www.w3.org/1999/xhtml" style="${style}">${body}</div>
  </foreignObject>
</svg>`;

  const image = new Image();
  image.onload = () => {
    canvas.getContext("2d")?.drawImage(image, bounds.startX, bounds.startY);
  };
  image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
