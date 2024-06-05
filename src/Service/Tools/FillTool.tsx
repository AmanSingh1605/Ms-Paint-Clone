export default function handleFloodPaint(paper, pen, x, y, primaryColor) {
  x = Math.round(x);
  y = Math.round(y);
  const canvasData = pen.getImageData(0, 0, paper.width, paper.height);
  const data = canvasData.data;
  const currentPixel = pen.getImageData(x, y, 1, 1).data;
  const currentColor = {
    r: currentPixel[0],
    g: currentPixel[1],
    b: currentPixel[2],
    a: currentPixel[3],
  };
  const hexCode = hex2rgb(primaryColor);
  if (JSON.stringify(hexCode) !== JSON.stringify(currentColor)) {
    floodPaint(x, y, paper.width, paper.height, data, currentColor, hexCode);
    pen.putImageData(canvasData, 0, 0);
  }
}

function floodPaint(x, y, width, height, data, startColor, fillColor) {
  const stack = [[x, y]];

  while (stack.length > 0) {
    const [nx, ny] = stack.pop();
    const pos = (nx + width * ny) * 4;
    if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
    if (
      data[pos] !== startColor.r ||
      data[pos + 1] !== startColor.g ||
      data[pos + 2] !== startColor.b ||
      data[pos + 3] !== startColor.a
    ) {
      continue;
    }
    data[pos] = fillColor.r;
    data[pos + 1] = fillColor.g;
    data[pos + 2] = fillColor.b;
    data[pos + 3] = fillColor.a;

    stack.push([nx - 1, ny]);
    stack.push([nx, ny + 1]);
    stack.push([nx + 1, ny]);
    stack.push([nx, ny - 1]);
  }
}

const hex2rgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const a = parseInt(hex.slice(7, 9), 16);
  return { r, g, b, a };
};
