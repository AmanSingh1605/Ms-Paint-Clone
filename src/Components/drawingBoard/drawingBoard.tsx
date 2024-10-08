"use client";
import { MainContext } from "@/Contexts/mainContext";
import { ShapeTypes } from "@/Service/Data/shapeToolArray";
import { CaligraphyPen } from "@/Service/Functions/caligraphyPen";
import { printText } from "@/Service/Functions/printText";
import {
  copyImageFromSelection,
  pasteImageFromSelection,
} from "@/Service/Functions/selectImage";
import handlePaintFill from "@/Service/Tools/FillTool";
import PickerTool from "@/Service/Tools/PickerTool";
import { TextTool } from "@/Service/Tools/TextTool";
import { useContext, useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import SelectDiv from "../selectDiv/SelectDiv";
import DrawCircle from "../shapeTools/drawCircle";
import DrawDiamond from "../shapeTools/drawDiamond";
import DrawHexagon from "../shapeTools/drawHexagon";
import DrawLine from "../shapeTools/drawLine";
import DrawPentagon from "../shapeTools/drawPentagon";
import DrawRectangle from "../shapeTools/drawRectangle";
import DrawRightTriangle from "../shapeTools/drawRightTriangle";
import DrawRoundRectangle from "../shapeTools/drawRoundRectangle";
import DrawTriangle from "../shapeTools/drawTriangle";
import DrawRightArrow from "../shapeTools/drawRightArrow";
import DrawLeftArrow from "../shapeTools/drawLeftArrow";
import DrawUpArrow from "../shapeTools/drawUpArrow";
import DrawDownArrow from "../shapeTools/drawDownArrow";
import DrawFivePointStar from "../shapeTools/drawFivePointStar";
import DrawFourPointStar from "../shapeTools/drawFourPointStar";
import DrawSixPointStar from "../shapeTools/drawSixPointStar";

export default function DrawingBoard() {
  const {
    primaryColor,
    secondaryColor,
    setPrimaryColor,
    brushWidth,
    currentTool,
    currentBrushType,
    setPaperDimensions,
    currentShapeTool,
  } = useContext(MainContext);

  const [loading, setLoading] = useState(false); //loading of canvas
  const [resize, setResize] = useState({ status: false, direction: "s" }); //resizing of canvas
  const [textBoxArray, setTextBox] = useState([]);
  const [selectBoxArray, setSelectBox] = useState([]);
  const [eraserSize, setEraserSize] = useState(12);
  const [shapeSVG, setShapeSVG] = useState([]);

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
    paper.height = boardRef.current.clientHeight / 2;
    paper.width = boardRef.current.clientWidth / 2;
    const boundingArea = paper.getBoundingClientRect();
    setPaperDimensions(() => {
      return {
        height: paper.height,
        width: paper.width,
        boundingArea: { top: boundingArea.top, left: boundingArea.left },
      };
    });
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
      setPaperDimensions(() => {
        return {
          height: paper.height,
          width: paper.width,
          boundingArea: { top: boundingArea.top, left: boundingArea.left },
        };
      });
    }

    //save canvas before resizing
    function saveData() {
      const canvasData = pen.getImageData(0, 0, paper.width, paper.height);
      return canvasData;
    }

    //paint the canvas using previous data after resizing
    function paintPrevious() {
      if (resize.status) {
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
      pen.x = e.clientX;
      pen.y = e.clientY;
    };

    let stopDrawing = () => {
      activeBrush = false;
      setResize({ status: false, direction: "" });
      if (pen.x || pen.y) {
        delete pen.x;
        delete pen.y;
      }
    };

    let streamDrawTool = (e) => {
      if (!activeBrush) return;

      let bounding = e.target.getBoundingClientRect();
      if (currentBrushType.status) {
        if (
          ["Normal Brush", "Square Brush", "Smooth Brush"].includes(
            currentBrushType.name
          )
        ) {
          pen.strokeStyle = primaryColor;
          pen.lineWidth = brushWidth;
          pen.lineCap = currentBrushType.value;
          pen.lineTo(
            e.clientX - bounding.left + 4,
            e.clientY - bounding.top + 20
          );
          pen.stroke();
        } else if (currentBrushType.name === "Caligraphy Pen") {
          pen.strokeStyle = primaryColor;
          pen.lineWidth = 1;
          CaligraphyPen(e, pen, bounding, primaryColor);
          pen.x = e.clientX;
          pen.y = e.clientY;
        }
      }
      if (currentTool && currentTool.name === "Eraser") {
        pen.fillStyle = secondaryColor;
        pen.clearRect(
          e.clientX - bounding.left - eraserSize / 2,
          e.clientY - bounding.top - eraserSize / 2,
          eraserSize,
          eraserSize
        );
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

  //handle selection, copy and crop methods
  useEffect(() => {
    const paper = canvasRef.current;
    const boundingArea = paper.getBoundingClientRect();
    function pictureTools(e) {
      if (currentTool && currentTool.name === "Select") {
        setSelectBox(() => [
          <SelectDiv
            xAxis={e.clientX}
            yAxis={e.clientY - boundingArea.top}
            parentHeight={boundingArea.top}
            setSelectBox={() => {
              setSelectBox([]);
            }}
            getImageData={(x1, y1, x2, y2) =>
              copyImageFromSelection(canvasRef, x1, y1, x2, y2)
            }
            putImageData={(x1, y1, x2, y2, imageData) =>
              pasteImageFromSelection(canvasRef, x1, y1, x2, y2, imageData)
            }
          />,
        ]);
      }
    }
    paper.addEventListener("mousedown", pictureTools);
    return () => {
      paper.removeEventListener("mousedown", pictureTools);
    };
  }, [currentTool, selectBoxArray]);

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
      } else if (currentBrushType.status) {
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
  }, [currentTool, currentBrushType, secondaryColor]);

  //handle Shape Tools
  useEffect(() => {
    const paper = canvasRef.current;
    const boundingArea = paper.getBoundingClientRect();
    const pen = paper.getContext("2d");
    function drawLineOnCanvas(startX, startY, endX, endY) {
      pen.moveTo(startX, startY);
      pen.lineTo(endX, endY);
      pen.strokeStyle = primaryColor;
      pen.lineWidth = brushWidth;
      pen.stroke();
    }
    function drawCircleOnCanvas(startX, startY, endX, endY) {
      pen.beginPath();
      pen.strokeStyle = primaryColor;
      pen.lineWidth = brushWidth;
      const radX = (endX - startX) / 2;
      const radY = (endY - startY) / 2;
      pen.ellipse(startX + radX, startY + radY, radX, radY, 0, 0, 2 * Math.PI); //adding radius in X and y because we are subtracting the radius in component.
      pen.stroke();
    }
    function drawRectangleOnCanvas(startX, startY, endX, endY) {
      pen.beginPath();
      pen.strokeStyle = primaryColor;
      pen.lineWidth = brushWidth;
      pen.rect(startX, startY, endX - startX, endY - startY);
      pen.stroke();
    }
    function drawRoundRectangleOnCanvas(startX, startY, endX, endY) {
      pen.beginPath();
      pen.strokeStyle = primaryColor;
      pen.lineWidth = brushWidth;
      pen.roundRect(startX, startY, endX - startX, endY - startY, 20);
      pen.stroke();
    }
    function drawTriangleOnCanvas(startX, startY, endX, endY) {
      pen.beginPath();
      pen.strokeStyle = primaryColor;
      pen.lineWidth = brushWidth;
      pen.lineCap = "round";
      pen.moveTo(startX, endY);
      pen.lineTo((startX + endX) / 2, startY);
      pen.lineTo(endX, endY);
      pen.closePath();
      pen.stroke();
    }
    function drawRightTriangleOnCanvas(startX, startY, endX, endY) {
      pen.beginPath();
      pen.strokeStyle = primaryColor;
      pen.lineWidth = brushWidth;
      pen.lineCap = "round";
      pen.moveTo(startX, startY);
      pen.lineTo(startX, endY);
      pen.lineTo(endX, endY);
      pen.closePath();
      pen.stroke();
    }
    function drawDiamondOnCanvas(startX, startY, endX, endY) {
      pen.beginPath();
      pen.strokeStyle = primaryColor;
      pen.lineWidth = brushWidth;
      pen.lineCap = "round";
      pen.moveTo(startX, (startY + endY) / 2);
      pen.lineTo((startX + endX) / 2, startY);
      pen.lineTo(endX, (startY + endY) / 2);
      pen.lineTo((startX + endX) / 2, endY);
      pen.closePath();
      pen.stroke();
    }
    function drawPentagonOnCanvas(startX, startY, endX, endY) {
      pen.beginPath();
      pen.strokeStyle = primaryColor;
      pen.lineWidth = brushWidth;
      pen.lineCap = "round";
      pen.moveTo((startX + endX) / 2, startY);
      pen.lineTo(endX, startY + (endY - startY) * 0.33);
      pen.lineTo(startX + (endX - startX) * 0.8, endY);
      pen.lineTo(startX + (endX - startX) * 0.2, endY);
      pen.lineTo(startX, startY + (endY - startY) * 0.33);
      pen.closePath();
      pen.stroke();
    }
    function drawHexagonOnCanvas(startX, startY, endX, endY) {
      pen.beginPath();
      pen.strokeStyle = primaryColor;
      pen.lineWidth = brushWidth;
      pen.lineCap = "round";
      pen.moveTo((startX + endX) / 2, startY);
      pen.lineTo(endX, startY + (endY - startY) * 0.2);
      pen.lineTo(endX, startY + (endY - startY) * 0.8);
      pen.lineTo((startX + endX) / 2, endY);
      pen.lineTo(startX, startY + (endY - startY) * 0.8);
      pen.lineTo(startX, startY + (endY - startY) * 0.2);
      pen.closePath();
      pen.stroke();
    }
    function drawArrowOnCanvas(polygonPoints) {
      pen.beginPath();
      pen.strokeStyle = primaryColor;
      pen.lineWidth = brushWidth;
      pen.lineCap = "round";
      pen.moveTo(polygonPoints[0], polygonPoints[1]);
      for (let i = 2; i < polygonPoints.length; i += 2)
        pen.lineTo(polygonPoints[i], polygonPoints[i + 1]);
      pen.closePath();
      pen.stroke();
    }
    function shapeTool(e) {
      if (currentShapeTool.status) {
        if (currentShapeTool.name === ShapeTypes.Line) {
          setShapeSVG(() => [
            <DrawLine
              xAxis={e.clientX}
              yAxis={e.clientY - boundingArea.top}
              parentHeight={boundingArea.top}
              resetLine={() => {
                setShapeSVG([]);
              }}
              drawLineOnCanvas={drawLineOnCanvas}
            />,
          ]);
        } else if (currentShapeTool.name === ShapeTypes.Circle) {
          setShapeSVG(() => [
            <DrawCircle
              xAxis={e.clientX}
              yAxis={e.clientY - boundingArea.top}
              parentHeight={boundingArea.top}
              resetLine={() => {
                setShapeSVG([]);
              }}
              drawCircleOnCanvas={drawCircleOnCanvas}
            />,
          ]);
        } else if (currentShapeTool.name === ShapeTypes.Rectangle) {
          setShapeSVG(() => [
            <DrawRectangle
              xAxis={e.clientX}
              yAxis={e.clientY - boundingArea.top}
              parentHeight={boundingArea.top}
              resetLine={() => {
                setShapeSVG([]);
              }}
              drawRectangleOnCanvas={drawRectangleOnCanvas}
            />,
          ]);
        } else if (currentShapeTool.name === ShapeTypes.RoundedRectangle) {
          setShapeSVG(() => [
            <DrawRoundRectangle
              xAxis={e.clientX}
              yAxis={e.clientY - boundingArea.top}
              parentHeight={boundingArea.top}
              resetLine={() => {
                setShapeSVG([]);
              }}
              drawRoundRectangleOnCanvas={drawRoundRectangleOnCanvas}
            />,
          ]);
        } else if (currentShapeTool.name === ShapeTypes.Triangle) {
          setShapeSVG(() => [
            <DrawTriangle
              xAxis={e.clientX}
              yAxis={e.clientY - boundingArea.top}
              parentHeight={boundingArea.top}
              resetLine={() => {
                setShapeSVG([]);
              }}
              drawTriangleOnCanvas={drawTriangleOnCanvas}
            />,
          ]);
        } else if (currentShapeTool.name === ShapeTypes.RightTriangle) {
          setShapeSVG(() => [
            <DrawRightTriangle
              xAxis={e.clientX}
              yAxis={e.clientY - boundingArea.top}
              parentHeight={boundingArea.top}
              resetLine={() => {
                setShapeSVG([]);
              }}
              drawRightTriangleOnCanvas={drawRightTriangleOnCanvas}
            />,
          ]);
        } else if (currentShapeTool.name === ShapeTypes.Diamond) {
          setShapeSVG(() => [
            <DrawDiamond
              xAxis={e.clientX}
              yAxis={e.clientY - boundingArea.top}
              parentHeight={boundingArea.top}
              resetLine={() => {
                setShapeSVG([]);
              }}
              drawDiamondOnCanvas={drawDiamondOnCanvas}
            />,
          ]);
        } else if (currentShapeTool.name === ShapeTypes.Pentagon) {
          setShapeSVG(() => [
            <DrawPentagon
              xAxis={e.clientX}
              yAxis={e.clientY - boundingArea.top}
              parentHeight={boundingArea.top}
              resetLine={() => {
                setShapeSVG([]);
              }}
              drawPentagonOnCanvas={drawPentagonOnCanvas}
            />,
          ]);
        } else if (currentShapeTool.name === ShapeTypes.Hexagon) {
          setShapeSVG(() => [
            <DrawHexagon
              xAxis={e.clientX}
              yAxis={e.clientY - boundingArea.top}
              parentHeight={boundingArea.top}
              resetLine={() => {
                setShapeSVG([]);
              }}
              drawHexagonOnCanvas={drawHexagonOnCanvas}
            />,
          ]);
        } else if (currentShapeTool.name === ShapeTypes.RightArrow) {
          setShapeSVG(() => [
            <DrawRightArrow
              xAxis={e.clientX}
              yAxis={e.clientY - boundingArea.top}
              parentHeight={boundingArea.top}
              resetLine={() => {
                setShapeSVG([]);
              }}
              drawRightArrowOnCanvas={drawArrowOnCanvas}
            />,
          ]);
        } else if (currentShapeTool.name === ShapeTypes.LeftArrow) {
          setShapeSVG(() => [
            <DrawLeftArrow
              xAxis={e.clientX}
              yAxis={e.clientY - boundingArea.top}
              parentHeight={boundingArea.top}
              resetLine={() => {
                setShapeSVG([]);
              }}
              drawLeftArrowOnCanvas={drawArrowOnCanvas}
            />,
          ]);
        } else if (currentShapeTool.name === ShapeTypes.UpArrow) {
          setShapeSVG(() => [
            <DrawUpArrow
              xAxis={e.clientX}
              yAxis={e.clientY - boundingArea.top}
              parentHeight={boundingArea.top}
              resetLine={() => {
                setShapeSVG([]);
              }}
              drawUpArrowOnCanvas={drawArrowOnCanvas}
            />,
          ]);
        } else if (currentShapeTool.name === ShapeTypes.DownArrow) {
          setShapeSVG(() => [
            <DrawDownArrow
              xAxis={e.clientX}
              yAxis={e.clientY - boundingArea.top}
              parentHeight={boundingArea.top}
              resetLine={() => {
                setShapeSVG([]);
              }}
              drawDownArrowOnCanvas={drawArrowOnCanvas}
            />,
          ]);
        }else if (currentShapeTool.name === ShapeTypes.FourPointStar) {
          setShapeSVG(() => [
            <DrawFourPointStar
              xAxis={e.clientX}
              yAxis={e.clientY - boundingArea.top}
              parentHeight={boundingArea.top}
              resetLine={() => {
                setShapeSVG([]);
              }}
              drawFourPointStarOnCanvas={drawArrowOnCanvas}
            />,
          ]);
        }
         else if (currentShapeTool.name === ShapeTypes.FivePointStar) {
          setShapeSVG(() => [
            <DrawFivePointStar
              xAxis={e.clientX}
              yAxis={e.clientY - boundingArea.top}
              parentHeight={boundingArea.top}
              resetLine={() => {
                setShapeSVG([]);
              }}
              drawFivePointStarOnCanvas={drawArrowOnCanvas}
            />,
          ]);
        }
        else if (currentShapeTool.name === ShapeTypes.SixPointStar) {
          setShapeSVG(() => [
            <DrawSixPointStar
              xAxis={e.clientX}
              yAxis={e.clientY - boundingArea.top}
              parentHeight={boundingArea.top}
              resetLine={() => {
                setShapeSVG([]);
              }}
              drawSixPointStarOnCanvas={drawArrowOnCanvas}
            />,
          ]);
        }
      }
    }
    paper.addEventListener("mousedown", shapeTool);
    return () => {
      paper.removeEventListener("mousedown", shapeTool);
    };
  }, [currentShapeTool, shapeSVG, primaryColor, brushWidth]);

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
          {selectBoxArray.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
          {shapeSVG.map((item, index) => (
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
