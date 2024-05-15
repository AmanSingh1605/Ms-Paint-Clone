"use client";
import { MainContext } from "@/Contexts/mainContext";
import handlePaintFill, { intializeBlankpaper } from "@/Service/Tools/FillTool";
import { TextTool } from "@/Service/Tools/TextTool";
import { useContext, useEffect, useRef, useState } from "react";

export default function DrawingBoard() {
  const {
    primaryColor,
    secondaryColor,
    brushWidth,
    currentTool,
    currentBrushType,
  } = useContext(MainContext);

  const [loading, setLoading] = useState(false); //loading of canvas
  const [resize, setResize] = useState({ status: false, direction: "s" }); //resizing of canvas
  const [textBoxArray, setTextBox] = useState([]);

  //Ref declaration
  const canvasRef = useRef(null);
  const boardRef = useRef(null);
  const containerRef = useRef(null);

  function printText(text, startX, startY, endX, endY) {
    const addLineBreaks = (paragraph) => paragraph.replace(/\n/g, "<br/>");

    const brText = addLineBreaks(text);
    const svgCode = `
    <svg width="${Math.round(endX - startX)}" height="${Math.round(
      endY - startY
    )}" xmlns="http://www.w3.org/2000/svg">
        <foreignObject x="0" y="0" width="${Math.round(
          endX - startX
        )}" height="${Math.round(endY - startY)}">
            <style>
            p{  
                color: ${"%23" + primaryColor.substring(1)};
                background-color: ${"%23" + secondaryColor.substring(1)};
                height: ${endY - startY};
                width: ${endX - startX};
                font-size: 20px;
                line-height: 1.5;
                margin:0;
                word-wrap: break-word;
                word-break: break;
            }
            </style>
            <p xmlns="http://www.w3.org/1999/xhtml"> 
            ${brText}
            </p>
        </foreignObject>
    </svg>`;

    const svgCodeEncoded = svgCode.replace(/\n/g, "").replace(/"/g, "'");
    console.log(svgCodeEncoded);
    const img = document.createElement("img");
    img.onload = () => {
      const ctx = canvasRef.current.getContext("2d");
      ctx.drawImage(img, startX, startY);
    };
    img.src = `data:image/svg+xml,${svgCodeEncoded}`;
  }

  //handle resizing of canvas
  useEffect(() => {
    const paper = canvasRef.current;
    const pen = paper.getContext("2d");
    let currentCanvasData = saveData();

    function resizeCanvas(e) {
      const boundingArea = paper.getBoundingClientRect();
      if (resize.status) {
        if (resize.direction === "s" || resize.direction === "se")
          paper.height = e.clientY - boundingArea.top;
        if (resize.direction === "e" || resize.direction === "se")
          paper.width = e.clientX - boundingArea.left;
      }
    }

    //save canvas before resizing
    function saveData() {
      const canvasData = pen.getImageData(0, 0, paper.width, paper.height);
      return canvasData;
    }

    //paint the canvas using previous data after resizing
    function paintPrevious() {
      if (resize.status) {
        intializeBlankpaper(paper, pen);
        pen.putImageData(currentCanvasData, 0, 0);
      }
      setResize({ status: false, direction: "" });
    }

    window.addEventListener("mousemove", resizeCanvas);
    window.addEventListener("mouseup", paintPrevious);
    return () => {
      window.removeEventListener("mousemove", resizeCanvas);
      window.removeEventListener("mouseup", paintPrevious);
    };
  }, [resize]);

  //Intialize blank paper
  useEffect(() => {
    setLoading(true);
    const paper = canvasRef.current;
    const pen = paper.getContext("2d");
    paper.height = boardRef.current.clientHeight / 2;
    paper.width = boardRef.current.clientWidth / 2;
    intializeBlankpaper(paper, pen);
    setLoading(false);
  }, []);

  //handle Drawing on canvas
  useEffect(() => {
    const paper = canvasRef.current;
    const pen = paper.getContext("2d");

    let activeBrush = false;

    let startDrawing = (e) => {
      activeBrush = true;
      pen.beginPath();
      streamDrawTool(e);
    };

    let stopDrawing = (e) => {
      activeBrush = false;
      setResize({ status: false, direction: "" });
    };

    let streamDrawTool = (e) => {
      if (!activeBrush) return;

      let bounding = e.target.getBoundingClientRect();
      if (currentBrushType) {
        pen.strokeStyle = primaryColor;
        pen.lineWidth = brushWidth;
        pen.lineCap = currentBrushType.value;
        pen.lineTo(e.clientX - bounding.left, e.clientY - bounding.top);
        pen.stroke();
      }
      if (currentTool && currentTool.name === "Eraser") {
        pen.strokeStyle = secondaryColor;
        pen.lineWidth = 32;
        pen.lineCap = "square";
        pen.lineTo(e.clientX - bounding.left, e.clientY - bounding.top);
        pen.stroke();
      }
      if (currentTool && currentTool.name === "Pencil") {
        pen.strokeStyle = primaryColor;
        pen.lineWidth = 0.1;
        pen.lineCap = "square";
        pen.lineTo(e.clientX - bounding.left, e.clientY - bounding.top);
        pen.stroke();
      }
    };

    let clickDrawTool = (e) => {
      if (currentTool) {
        const bounding = e.target.getBoundingClientRect();
        const x = e.clientX - bounding.left;
        const y = e.clientY - bounding.top;

        if (currentTool.name === "Fill") {
          handlePaintFill(paper, pen, x, y, primaryColor);
        }

        if (currentTool.name === "Text") {
          TextTool(canvasRef, e, setTextBox, bounding.top, printText);
        }
      }
    };

    paper.addEventListener("mousedown", startDrawing);
    paper.addEventListener("mouseup", stopDrawing);
    paper.addEventListener("mousemove", streamDrawTool);
    if (currentTool) paper.addEventListener("click", clickDrawTool);

    return () => {
      paper.removeEventListener("mousedown", startDrawing);
      paper.removeEventListener("mouseup", stopDrawing);
      paper.removeEventListener("mousemove", streamDrawTool);
      if (currentTool) paper.removeEventListener("click", clickDrawTool);
    };
  }, [primaryColor, secondaryColor, brushWidth, currentBrushType, currentTool]);

  return (
    <div className="h-full w-full" ref={boardRef}>
      {loading ? (
        <div className="text-2xl font-bold ">Drawing Page is Loading...</div>
      ) : (
        <div ref={containerRef} className="relative w-fit h-fit">
          <canvas ref={canvasRef} className="bg-white"></canvas>
          <div
            className="absolute cursor-e-resize rounded-full h-2 w-2 bg-white border border-blue-500 -right-1 bottom-1/2"
            onMouseDown={() => {
              setResize({ status: true, direction: "e" });
            }}
          ></div>
          <div
            className="absolute cursor-se-resize rounded-full h-2 w-2 bg-white border border-blue-500 -right-1 -bottom-1"
            onMouseDown={() => {
              setResize({ status: true, direction: "se" });
            }}
          ></div>
          <div
            className="absolute cursor-s-resize rounded-full h-2 w-2 bg-white border border-blue-500 right-1/2 -bottom-1"
            onMouseDown={() => {
              setResize({ status: true, direction: "s" });
            }}
          ></div>
          {textBoxArray.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </div>
      )}
    </div>
  );
}
