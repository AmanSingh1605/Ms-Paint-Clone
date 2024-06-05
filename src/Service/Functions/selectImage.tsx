export function copyImageFromSelection(canvasRef, startX, startY, endX, endY) {
  const paper = canvasRef.current;
  const pen = paper.getContext("2d");

  const height = endY - startY;
  const width = endX - startX;

  const tempCanvas = document.createElement("canvas");
  const tempContext = tempCanvas.getContext("2d");

  tempCanvas.height = height;
  tempCanvas.width = width;

  tempContext.drawImage(
    paper,
    startX,
    startY,
    width,
    height,
    0,
    0,
    width,
    height
  );

  pen.clearRect(startX, startY, width, height);
  return tempCanvas.toDataURL("image/png");
}

export function pasteImageFromSelection(
  canvasRef,
  startX,
  startY,
  endX,
  endY,
  imageData
) {
  const paper = canvasRef.current;
  const pen = paper.getContext("2d");

  const height = endY - startY;
  const width = endX - startX;

  const image = new Image();
  image.src = imageData;
  pen.drawImage(
    image,
    0,
    0,
    image.width,
    image.height,
    startX,
    startY,
    width,
    height
  );
}
