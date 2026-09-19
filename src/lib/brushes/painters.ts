import type { Point } from "@/lib/canvas/bounds";
import {
  BrushName,
  type BrushPainter,
  type BrushSpec,
  type Stroke,
} from "./types";

const distance = (from: Point, to: Point) =>
  Math.hypot(to.x - from.x, to.y - from.y);

// Includes both ends, so a single click still puts paint down.
function samples(from: Point, to: Point, step: number): Point[] {
  const count = Math.max(1, Math.ceil(distance(from, to) / step));
  const points: Point[] = [];
  for (let i = 0; i <= count; i++) {
    const t = i / count;
    points.push({
      x: from.x + (to.x - from.x) * t,
      y: from.y + (to.y - from.y) * t,
    });
  }
  return points;
}

function segment(
  { pen, from, to, color }: Stroke,
  width: number,
  cap: CanvasLineCap,
  alpha = 1
) {
  pen.save();
  pen.globalAlpha = alpha;
  pen.strokeStyle = color;
  pen.lineWidth = Math.max(width, 0.5);
  pen.lineCap = cap;
  pen.lineJoin = "round";
  pen.beginPath();
  pen.moveTo(from.x, from.y);
  pen.lineTo(to.x, to.y);
  pen.stroke();
  pen.restore();
}

// A fixed-angle nib stamped along the segment, so the stroke reads thick
// across the nib and thin along it.
function nib(stroke: Stroke, angle: number, lengthScale: number) {
  const { pen, from, to, color, width } = stroke;
  const half = (width * lengthScale) / 2;
  const dx = Math.cos(angle) * half;
  const dy = Math.sin(angle) * half;

  pen.save();
  pen.strokeStyle = color;
  pen.lineWidth = Math.max(width * 0.35, 1);
  pen.lineCap = "round";
  pen.beginPath();
  for (const point of samples(from, to, 1)) {
    pen.moveTo(point.x - dx, point.y - dy);
    pen.lineTo(point.x + dx, point.y + dy);
  }
  pen.stroke();
  pen.restore();
}

function dot(
  pen: CanvasRenderingContext2D,
  point: Point,
  radius: number,
  color: string,
  alpha: number
) {
  pen.save();
  pen.globalAlpha = alpha;
  pen.fillStyle = color;
  pen.beginPath();
  pen.arc(point.x, point.y, radius, 0, Math.PI * 2);
  pen.fill();
  pen.restore();
}

const brush: BrushPainter = (stroke) =>
  segment(stroke, stroke.width, "round");

const calligraphy1: BrushPainter = (stroke) => nib(stroke, -Math.PI / 4, 2.2);

const calligraphy2: BrushPainter = (stroke) => nib(stroke, Math.PI / 4, 2.2);

// Dots scattered in a disc. Density follows distance travelled, so a slow
// stroke lays down more paint.
const airbrush: BrushPainter = ({ pen, from, to, color, width }) => {
  const radius = width * 1.6;
  const count = Math.max(10, Math.round(distance(from, to) * 3));
  for (let i = 0; i < count; i++) {
    const t = Math.random();
    const angle = Math.random() * Math.PI * 2;
    // Square root keeps the scatter even rather than clustered at the centre.
    const spread = Math.sqrt(Math.random()) * radius;
    dot(
      pen,
      {
        x: from.x + (to.x - from.x) * t + Math.cos(angle) * spread,
        y: from.y + (to.y - from.y) * t + Math.sin(angle) * spread,
      },
      0.7,
      color,
      0.28
    );
  }
};

const offset = (point: Point, amount: number): Point => ({
  x: point.x + amount,
  y: point.y + amount * 0.6,
});

// A wide body with two offset passes, for a loaded bristle edge.
const oil: BrushPainter = (stroke) => {
  const { width } = stroke;
  segment(stroke, width * 1.7, "round", 0.85);
  segment(
    { ...stroke, from: offset(stroke.from, width * 0.3), to: offset(stroke.to, width * 0.3) },
    width * 0.8,
    "round",
    0.5
  );
  segment(
    { ...stroke, from: offset(stroke.from, -width * 0.35), to: offset(stroke.to, -width * 0.35) },
    width * 0.5,
    "round",
    0.35
  );
};

// Grain: opaque specks scattered across the stroke width, leaving paper gaps.
const crayon: BrushPainter = ({ pen, from, to, color, width }) => {
  const radius = width * 0.8;
  for (const point of samples(from, to, 0.8)) {
    const specks = Math.max(3, Math.round(width));
    for (let i = 0; i < specks; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spread = Math.sqrt(Math.random()) * radius;
      dot(
        pen,
        {
          x: point.x + Math.cos(angle) * spread,
          y: point.y + Math.sin(angle) * spread,
        },
        0.6,
        color,
        0.5 + Math.random() * 0.3
      );
    }
  }
};

// Flat ended and wide. Translucency comes from the layer composite.
const marker: BrushPainter = (stroke) =>
  segment(stroke, stroke.width * 1.6, "square");

// Thin and slightly unsteady, with the tooth of paper.
const naturalPencil: BrushPainter = (stroke) => {
  const jitter = () => (Math.random() - 0.5) * 0.9;
  segment(
    {
      ...stroke,
      from: { x: stroke.from.x + jitter(), y: stroke.from.y + jitter() },
      to: { x: stroke.to.x + jitter(), y: stroke.to.y + jitter() },
    },
    Math.max(stroke.width * 0.55, 1),
    "round"
  );
};

// Wide, with offset passes so the edge wanders like a wet wash.
const watercolor: BrushPainter = (stroke) => {
  const { width } = stroke;
  segment(stroke, width * 2.4, "round");
  for (let i = 0; i < 2; i++) {
    const shift = (Math.random() - 0.5) * width;
    segment(
      {
        ...stroke,
        from: { x: stroke.from.x + shift, y: stroke.from.y + shift },
        to: { x: stroke.to.x + shift, y: stroke.to.y + shift },
      },
      width * 1.7,
      "round"
    );
  }
};

export const BRUSHES: Record<BrushName, BrushSpec> = {
  [BrushName.Brush]: { paint: brush },
  [BrushName.Calligraphy1]: { paint: calligraphy1 },
  [BrushName.Calligraphy2]: { paint: calligraphy2 },
  [BrushName.Airbrush]: { paint: airbrush },
  [BrushName.Oil]: { paint: oil },
  [BrushName.Crayon]: { paint: crayon },
  [BrushName.Marker]: { paint: marker, layerAlpha: 0.4 },
  [BrushName.NaturalPencil]: { paint: naturalPencil, layerAlpha: 0.65 },
  [BrushName.Watercolor]: { paint: watercolor, layerAlpha: 0.22 },
};

export const brushSpec = (name: BrushName): BrushSpec =>
  BRUSHES[name] ?? BRUSHES[BrushName.Brush];
