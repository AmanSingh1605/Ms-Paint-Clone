import TextBox from "@/Components/textBox/textBox";

export function TextTool(canvasRef, e, setArray, parentHeight, printText) {
  const paper = canvasRef.current;
  const pen = paper.getContext("2d");

  const boundingArea = paper.getBoundingClientRect();
  const x = e.clientX - boundingArea.left;
  const y = e.clientY - boundingArea.top;

  setArray([
    <TextBox
      xAxis={x}
      yAxis={y}
      parentHeight={parentHeight}
      printFunction={printText}
      setArray={setArray}
    />,
  ]);
}
