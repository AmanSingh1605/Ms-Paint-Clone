export function CaligraphyPen(e, pen, bounding, primaryColor) {
  if (pen.x && pen.y) {
    const pixelValues = generatePoints(
      pen.x - bounding.left + 4,
      pen.y - bounding.top + 20,
      e.clientX - bounding.left + 4,
      e.clientY - bounding.top + 20
    );
    // console.log(pixelValues);
    pixelValues.forEach((element) => {
      pen.strokeStyle = primaryColor;
      pen.lineWidth = 1;
      pen.moveTo(element.x, element.y);
      pen.lineTo(element.x + 4, element.y + 6);
      pen.stroke();
    });
  }
}

function generatePoints(x1, y1, x2, y2) {
  const interval = 1;
  const points = [];
  const slope = (y2 - y1) / (x2 - x1 !== 0 ? x2 - x1 : 1);
  const c = y1 - slope * x1;
  const diffX = x2 - x1;
  const diffY = y2 - y1;
  if (Math.abs(diffX) >= Math.abs(diffY)) {
    for (let x = Math.min(x1, x2); x < Math.max(x1, x2); x += interval) {
      const y = slope * x + c;
      points.push({ x, y });
    }
  } else {
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y += interval) {
      let x: number;
      if (slope !== 0) x = Math.round((y - c) / slope);
      else x = x1;
      points.push({ x, y });
    }
  }
  return points;
}
