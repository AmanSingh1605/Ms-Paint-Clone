import { MainContext } from "@/Contexts/mainContext";
import { useContext, useEffect, useRef, useState } from "react";

export default function DrawCircle({
  xAxis,
  yAxis,
  parentHeight,
  resetLine,
  drawCircleOnCanvas,
}) {
  const { paperDimensions, primaryColor, brushWidth } = useContext(MainContext);

  const circleRef = useRef(null);

  const [selected, setSelect] = useState(true);
  const [startX, setStartX] = useState(xAxis);
  const [startY, setStartY] = useState(yAxis);
  const [endX, setEndX] = useState(xAxis);
  const [endY, setEndY] = useState(yAxis);
  const [resize, setResize] = useState({ status: false, direction: "" });
  const [preventDeletion, setPreventDeletion] = useState(true);
  const [hoverActive, setHoverActive] = useState(false);
  const [moveSelectBox, setMoveSelectBox] = useState({
    status: false,
    x: 0,
    y: 0,
  });

  //change the component after the selecting the area
  useEffect(() => {
    function trackCursor(e) {
      if (selected) {
        if (e.clientX > startX) setEndX(() => e.clientX);
        else setStartX(() => e.clientX);
        if (e.clientY - parentHeight > startY)
          setEndY(() => e.clientY - parentHeight);
        else setStartY(() => e.clientY - parentHeight);
      }
    }
    window.addEventListener("mousemove", trackCursor);
    window.addEventListener("mouseup", () => setSelect(false));
    return () => {
      window.removeEventListener("mousemove", trackCursor);
      window.removeEventListener("mouseup", () => setSelect(false));
    };
  }, [selected]);

  // Used to resize the textbox
  useEffect(() => {
    function resizeTextbox(e) {
      if (resize.status) {
        setMoveSelectBox(() => {
          return { status: false, x: 0, y: 0 };
        });
        if (
          resize.direction === "s" ||
          resize.direction === "se" ||
          resize.direction === "sw"
        ) {
          setEndY(() =>
            e.clientY - parentHeight > startY + 10
              ? e.clientY - parentHeight
              : startY + 10
          );
        }
        if (
          resize.direction === "e" ||
          resize.direction === "se" ||
          resize.direction === "ne"
        )
          setEndX(() => (e.clientX > startX + 10 ? e.clientX : startX + 10));
        if (
          resize.direction === "n" ||
          resize.direction === "ne" ||
          resize.direction === "nw"
        ) {
          setStartY(() =>
            e.clientY - parentHeight < endY - 10
              ? e.clientY - parentHeight
              : endY - 10
          );
        }
        if (
          resize.direction === "w" ||
          resize.direction === "sw" ||
          resize.direction === "nw"
        )
          setStartX(() => (e.clientX < endX - 10 ? e.clientX : endX - 10));
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
  }, [resize.status]);

  //move the selected Box
  useEffect(() => {
    const selectHeight = endY - startY;
    const selectWidth = endX - startX;
    const moveSelectBoxFunction = (event) => {
      if (moveSelectBox.status && !resize.status) {
        const diffX = moveSelectBox.x - event.clientX;
        const diffY = moveSelectBox.y - event.clientY;
        setStartX(() =>
          startX - diffX > 0
            ? startX - diffX < paperDimensions.width - selectWidth
              ? startX - diffX
              : paperDimensions.width - selectWidth
            : 0
        );
        setEndX(() =>
          endX - diffX < paperDimensions.width
            ? endX - diffX > selectWidth
              ? endX - diffX
              : selectWidth
            : paperDimensions.width
        );
        setStartY(() =>
          startY - diffY > 0
            ? startY - diffY < paperDimensions.height - selectHeight
              ? startY - diffY
              : paperDimensions.height - selectHeight
            : 0
        );
        setEndY(() =>
          endY - diffY < paperDimensions.height
            ? endY - diffY > selectHeight
              ? endY - diffY
              : selectHeight
            : paperDimensions.height
        );

        setMoveSelectBox(() => {
          return { status: true, x: event.clientX, y: event.clientY };
        });
      }
    };

    if (circleRef.current) {
      circleRef.current.addEventListener("mousedown", (e) => {
        setPreventDeletion(true);
        setMoveSelectBox(() => {
          return { status: true, x: e.clientX, y: e.clientY };
        });
      });
      window.addEventListener("mousemove", moveSelectBoxFunction);
      window.addEventListener("mouseup", () => {
        setMoveSelectBox(() => {
          return { status: false, x: 0, y: 0 };
        });
      });
    }
    return () => {
      if (circleRef.current) {
        circleRef.current.removeEventListener("mousedown", (e) =>
          setMoveSelectBox(() => {
            return { status: true, x: e.clientX, y: e.clientY };
          })
        );
        window.removeEventListener("mousemove", moveSelectBoxFunction);
        window.removeEventListener("mouseup", () =>
          setMoveSelectBox(() => {
            return { status: false, x: 0, y: 0 };
          })
        );
      }
    };
  }, [moveSelectBox.status, selected, startX, startY]);

  useEffect(() => {
    function removeSelectBox(e) {
      if (!hoverActive && !resize.status && !preventDeletion) {
        drawCircleOnCanvas(startX, startY, endX, endY);
        resetLine();
      } else setPreventDeletion(false);
    }
    window.addEventListener("click", removeSelectBox);
    return () => {
      window.removeEventListener("click", removeSelectBox);
    };
  }, [preventDeletion, hoverActive]);

  return (
    <div
      className="absolute bg-transparent "
      style={{
        top: 0,
        left: 0,
        height: paperDimensions.height,
        width: paperDimensions.width,
      }}
    >
      <svg height={paperDimensions.height} width={paperDimensions.width}>
        <rect
          ref={circleRef}
          x={startX}
          y={startY}
          width={endX - startX}
          height={endY - startY}
          strokeDasharray={5}
          style={{ visibility: selected ? "hidden" : "visible" }}
          className=" fill-transparent stroke-black cursor-move"
          onMouseEnter={() => setHoverActive(true)}
          onMouseLeave={() => setHoverActive(false)}
        ></rect>
        <ellipse
          cx={startX + Math.round((endX - startX) / 2)}
          cy={startY + Math.round((endY - startY) / 2)}
          rx={(endX - startX) / 2}
          ry={(endY - startY) / 2}
          style={{
            stroke: primaryColor,
            strokeWidth: brushWidth,
            fill: "none",
          }}
          className="cursor-move"
          onMouseEnter={() => setHoverActive(true)}
          onMouseLeave={() => setHoverActive(false)}
        ></ellipse>
        <circle
          cx={startX}
          cy={startY}
          r={4}
          onMouseEnter={() => setHoverActive(true)}
          onMouseLeave={() => setHoverActive(false)}
          onMouseDown={() => setResize({ status: true, direction: "nw" })}
          className=" stroke-sky-300 fill-white cursor-nw-resize"
          style={{ visibility: selected ? "hidden" : "visible" }}
        ></circle>
        <circle
          cx={(endX + startX) / 2}
          cy={startY}
          r={4}
          onMouseEnter={() => setHoverActive(true)}
          onMouseLeave={() => setHoverActive(false)}
          onMouseDown={() => setResize({ status: true, direction: "n" })}
          className=" stroke-sky-300 fill-white cursor-n-resize"
          style={{ visibility: selected ? "hidden" : "visible" }}
        ></circle>
        <circle
          cx={endX}
          cy={startY}
          r={4}
          onMouseEnter={() => setHoverActive(true)}
          onMouseLeave={() => setHoverActive(false)}
          onMouseDown={() => setResize({ status: true, direction: "ne" })}
          className=" stroke-sky-300 fill-white cursor-ne-resize"
          style={{ visibility: selected ? "hidden" : "visible" }}
        ></circle>
        <circle
          cx={endX}
          cy={(endY + startY) / 2}
          r={4}
          onMouseEnter={() => setHoverActive(true)}
          onMouseLeave={() => setHoverActive(false)}
          onMouseDown={() => setResize({ status: true, direction: "e" })}
          className=" stroke-sky-300 fill-white cursor-e-resize"
          style={{ visibility: selected ? "hidden" : "visible" }}
        ></circle>
        <circle
          cx={endX}
          cy={endY}
          r={4}
          onMouseEnter={() => setHoverActive(true)}
          onMouseLeave={() => setHoverActive(false)}
          onMouseDown={() => setResize({ status: true, direction: "se" })}
          className=" stroke-sky-300 fill-white cursor-se-resize"
          style={{ visibility: selected ? "hidden" : "visible" }}
        ></circle>
        <circle
          cx={(startX + endX) / 2}
          cy={endY}
          r={4}
          onMouseEnter={() => setHoverActive(true)}
          onMouseLeave={() => setHoverActive(false)}
          onMouseDown={() => setResize({ status: true, direction: "s" })}
          className=" stroke-sky-300 fill-white cursor-s-resize"
          style={{ visibility: selected ? "hidden" : "visible" }}
        ></circle>
        <circle
          cx={startX}
          cy={endY}
          r={4}
          onMouseEnter={() => setHoverActive(true)}
          onMouseLeave={() => setHoverActive(false)}
          onMouseDown={() => setResize({ status: true, direction: "sw" })}
          className=" stroke-sky-300 fill-white cursor-sw-resize"
          style={{ visibility: selected ? "hidden" : "visible" }}
        ></circle>
        <circle
          cx={startX}
          cy={(startY + endY) / 2}
          r={4}
          className=" stroke-sky-300 fill-white cursor-w-resize"
          onMouseEnter={() => setHoverActive(true)}
          onMouseLeave={() => setHoverActive(false)}
          onMouseDown={() => setResize({ status: true, direction: "w" })}
          style={{ visibility: selected ? "hidden" : "visible" }}
        ></circle>
      </svg>
    </div>
  );
}
