"use client";
import { MainContext } from "@/Contexts/mainContext";
import { printText } from "@/Service/Functions/printText";
import handlePaintFill, { intializeBlankpaper } from "@/Service/Tools/FillTool";
import PickerTool from "@/Service/Tools/PickerTool";
import { TextTool } from "@/Service/Tools/TextTool";
import { useContext, useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

export default function DrawingBoard() {
  const {
    primaryColor,
    secondaryColor,
    setPrimaryColor,
    brushWidth,
    currentTool,
    currentBrushType,
  } = useContext(MainContext);

  const [loading, setLoading] = useState(false); //loading of canvas
  const [resize, setResize] = useState({ status: false, direction: "s" }); //resizing of canvas
  const [textBoxArray, setTextBox] = useState([]);
  const [eraserSize, setEraserSize] = useState(12);

  //Ref declaration
  const canvasRef = useRef(null);
  const boardRef = useRef(null);
  const containerRef = useRef(null);
  const eraserRef = useRef(null);

  //
  useHotkeys("ctrl+i", () => {
    if (currentTool && currentTool.name === "Eraser")
      setEraserSize(() => {
        return eraserSize + 1 > 50 ? 50 : eraserSize + 1;
      });
  });
  useHotkeys("ctrl+y", () => {
    if (currentTool && currentTool.name === "Eraser")
      setEraserSize(() => {
        return eraserSize - 1 < 6 ? 6 : eraserSize - 1;
      });
  });
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
        pen.lineTo(
          e.clientX - bounding.left + 4,
          e.clientY - bounding.top + 20
        );
        pen.stroke();
      }
      if (currentTool && currentTool.name === "Eraser") {
        pen.strokeStyle = secondaryColor;
        pen.lineWidth = eraserSize;
        pen.lineCap = "square";
        pen.lineTo(e.clientX - bounding.left, e.clientY - bounding.top);
        pen.stroke();
      }
      if (currentTool && currentTool.name === "Pencil") {
        pen.strokeStyle = primaryColor;
        pen.lineWidth = 0.1;
        pen.lineCap = "square";
        pen.lineTo(
          e.clientX - bounding.left + 3,
          e.clientY - bounding.top + 18
        );
        pen.stroke();
      }
    };

    let clickDrawTool = (e) => {
      if (currentTool) {
        const bounding = e.target.getBoundingClientRect();
        const x = e.clientX - bounding.left;
        const y = e.clientY - bounding.top;

        if (currentTool.name === "Fill") {
          handlePaintFill(paper, pen, x + 3, y + 24, primaryColor);
        }

        if (currentTool.name === "Text") {
          TextTool(
            canvasRef,
            e,
            setTextBox,
            bounding.top,
            (text, startX, startY, endX, endY) =>
              printText(
                text,
                startX,
                startY,
                endX,
                endY,
                primaryColor,
                secondaryColor,
                canvasRef
              )
          );
        }
        if (currentTool.name === "Picker") {
          const color = PickerTool(e, canvasRef);
          setPrimaryColor(color);
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
  }, [
    primaryColor,
    secondaryColor,
    brushWidth,
    currentBrushType,
    currentTool,
    eraserSize,
  ]);

  //Handle cursor type
  useEffect(() => {
    const paper = canvasRef.current;
    function changeCursor() {
      if (currentTool) {
        if (currentTool.name === "Pencil") {
          paper.style.cursor = "url(/pencil-cursor.svg), auto";
        } else if (currentTool.name === "Picker") {
          paper.style.cursor = "url(/picker-cursor.svg), auto";
        } else if (currentTool.name === "Eraser") {
          eraserRef.current.style.backgroundColor = secondaryColor;
          eraserRef.current.style.display = "block";
          paper.addEventListener("mousemove", eraserPosition);
        } else if (currentTool.name === "Text") {
          paper.style.cursor = "url(/text-cursor.svg), auto";
        } else if (currentTool.name === "Fill") {
          paper.style.cursor = "url(/fill-cursor.svg), auto";
        } else {
          paper.style.cursor = "default";
        }
      } else if (currentBrushType) {
        paper.style.cursor = "url(/brush-cursor.svg), auto";
      } else {
        paper.style.cursor = "default";
      }
    }

    function changeToNormal() {
      paper.style.cursor = "default";
      eraserRef.current.style.display = "none";
    }
    function eraserPosition(e) {
      const boundingArea = canvasRef.current.getBoundingClientRect();
      const eraserHeight = eraserRef.current.clientHeight;
      const eraserWidth = eraserRef.current.clientWidth;
      eraserRef.current.style.top =
        e.clientY - boundingArea.top - eraserHeight / 2 + "px";
      eraserRef.current.style.left =
        e.clientX - boundingArea.left - eraserWidth / 2 + "px";
    }
    paper.addEventListener("mouseenter", changeCursor);
    paper.addEventListener("mouseleave", changeToNormal);
    return () => {
      paper.removeEventListener("mouseenter", changeCursor);
      paper.removeEventListener("mouseleave", changeToNormal);
      if (currentTool && currentTool.name === "Eraser") {
        paper.removeEventListener("mousemove", eraserPosition);
      }
    };
  }, [currentTool, secondaryColor]);

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
          <div
            ref={eraserRef}
            className="absolute border-black border hidden"
            style={{
              height: eraserSize + "px",
              width: eraserSize + "px",
              pointerEvents: "none",
            }}
          ></div>
        </div>
      )}
    </div>
  );
}