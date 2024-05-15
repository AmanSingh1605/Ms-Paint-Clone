import { useEffect, useRef, useState } from "react";

export default function TextBox({
  xAxis,
  yAxis,
  parentHeight,
  printFunction,
  setArray,
}) {
  const [startX, setStartX] = useState(xAxis);
  const [startY, setStartY] = useState(yAxis);
  const [endX, setEndX] = useState(xAxis + 32);
  const [endY, setEndY] = useState(yAxis + 57.6);
  const [data, setData] = useState("");
  const [resize, setResize] = useState({ status: false, direction: "" });

  const textBoxRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      if (textBoxRef.current.scrollHeight >= textBoxRef.current.clientHeight) {
        containerRef.current.style.height = "0px";
        const scrollHeight = textBoxRef.current.scrollHeight;
        containerRef.current.style.height = scrollHeight + "px";
      }
    }
  }, [textBoxRef.current, containerRef.current, data]);

  useEffect(() => {
    function resizeTextbox(e) {
      if (resize.status) {
        if (
          resize.direction === "s" ||
          resize.direction === "se" ||
          resize.direction === "sw"
        ) {
          setEndY(e.clientY - parentHeight);
        }
        if (
          resize.direction === "e" ||
          resize.direction === "se" ||
          resize.direction === "ne"
        )
          setEndX(e.clientX);
        if (
          resize.direction === "n" ||
          resize.direction === "ne" ||
          resize.direction === "nw"
        ) {
          setStartY(e.clientY - parentHeight);
        }
        if (
          resize.direction === "w" ||
          resize.direction === "sw" ||
          resize.direction === "nw"
        )
          setStartX(e.clientX);
      }
    }
    async function cleanUp() {
      setResize({ status: false, direction: "" });
    }

    window.addEventListener("mousemove", resizeTextbox);
    window.addEventListener("mouseup", cleanUp);
    return () => {
      window.removeEventListener("mousemove", resizeTextbox);
      window.removeEventListener("mouseup", cleanUp);
    };
  }, [resize]);

  useEffect(() => {
    function printText(e) {
      const containerArea = containerRef.current.getBoundingClientRect();
      if (
        e.clientX < containerArea.left - 5 ||
        e.clientX > containerArea.right + 5
      ) {
        if (
          e.clientY < containerArea.top - 5 ||
          e.clientY > containerArea.bottom + 5
        ) {
          printFunction(
            data,
            containerArea.left,
            containerArea.top - parentHeight,
            containerArea.right,
            containerArea.bottom - parentHeight
          );
          setArray([]);
        }
      }
    }
    window.addEventListener("click", printText);

    return () => {
      window.removeEventListener("click", printText);
    };
  }, [data]);
  return (
    <div
      className="absolute"
      ref={containerRef}
      style={{
        top: startY.toString() + "px",
        left: startX.toString() + "px",
        height:
          (endY - startY > 0 ? Math.abs(startY - endY) : 0).toString() + "px",
        width:
          (endX - startX > 0 ? Math.abs(startX - endX) : 0).toString() + "px",
      }}
    >
      <div className="relative h-full w-full flex items-center justify-center">
        <textarea
          className={`h-full w-full bg-transparent p-1 border-dashed border-black border outline-none no-scrollbar whitespace-pre-wrap`}
          value={data}
          ref={textBoxRef}
          autoFocus
          style={{ resize: "none" }}
          onChange={(e) => {
            setData(e.target.value);
          }}
        ></textarea>
        <div
          onMouseDown={() => setResize({ status: true, direction: "nw" })}
          className="absolute cursor-nw-resize bg-blue-500 h-2 w-2 rounded-full -top-1 -left-1"
        ></div>
        <div
          onMouseDown={() => setResize({ status: true, direction: "n" })}
          className="absolute cursor-n-resize bg-blue-500 h-2 w-2 rounded-full -top-1 left-1/2"
        ></div>
        <div
          onMouseDown={() => setResize({ status: true, direction: "ne" })}
          className="absolute cursor-ne-resize bg-blue-500 h-2 w-2 rounded-full -top-1 -right-1"
        ></div>
        <div
          onMouseDown={() => setResize({ status: true, direction: "e" })}
          className="absolute cursor-e-resize bg-blue-500 h-2 w-2 rounded-full top-1/2 -right-1"
        ></div>
        <div
          onMouseDown={() => setResize({ status: true, direction: "w" })}
          className="absolute cursor-w-resize bg-blue-500 h-2 w-2 rounded-full top-1/2 -left-1"
        ></div>
        <div
          onMouseDown={() => setResize({ status: true, direction: "sw" })}
          className="absolute cursor-sw-resize bg-blue-500 h-2 w-2 rounded-full -bottom-1 -left-1"
        ></div>
        <div
          onMouseDown={() => setResize({ status: true, direction: "s" })}
          className="absolute cursor-s-resize bg-blue-500 h-2 w-2 rounded-full -bottom-1 left-1/2"
        ></div>
        <div
          onMouseDown={() => setResize({ status: true, direction: "se" })}
          className="absolute cursor-se-resize bg-blue-500 h-2 w-2 rounded-full -bottom-1 -right-1"
        ></div>
      </div>
    </div>
  );
}
