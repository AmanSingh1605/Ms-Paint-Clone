import { MainContext } from "@/Contexts/mainContext";
import { useContext, useEffect, useRef, useState } from "react";

export default function DrawLine({
  xAxis,
  yAxis,
  parentHeight,
  resetLine,
  drawLineOnCanvas,
}) {
  const { paperDimensions, primaryColor, brushWidth } = useContext(MainContext);

  const lineRef = useRef(null);

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
        setEndX(() => Math.min(Math.max(e.clientX, 0), paperDimensions.width));
        setEndY(() =>
          Math.min(
            Math.max(e.clientY - parentHeight, 0),
            paperDimensions.height
          )
        );
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
        if (resize.direction === "right") {
          setEndY(() =>
            Math.min(
              Math.max(e.clientY - parentHeight, 5),
              paperDimensions.height - 5
            )
          );
          setEndX(() =>
            Math.min(Math.max(e.clientX, 5), paperDimensions.width - 5)
          );
        }
        if (resize.direction === "left") {
          setStartY(() =>
            Math.min(
              Math.max(e.clientY - parentHeight, 5),
              paperDimensions.height - 5
            )
          );
          setStartX(() =>
            Math.min(Math.max(e.clientX, 5), paperDimensions.width - 5)
          );
        }
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

    if (lineRef.current) {
      lineRef.current.addEventListener("mousedown", (e) => {
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
      if (lineRef.current) {
        lineRef.current.removeEventListener("mousedown", (e) =>
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
        drawLineOnCanvas(startX, startY, endX, endY);
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
        <line
          ref={lineRef}
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          style={{
            stroke: primaryColor,
            strokeWidth: brushWidth,
          }}
          className="cursor-move"
          onMouseEnter={() => setHoverActive(true)}
          onMouseLeave={() => setHoverActive(false)}
        ></line>
        <circle
          cx={startX}
          cy={startY}
          r={4}
          onMouseEnter={() => setHoverActive(true)}
          onMouseLeave={() => setHoverActive(false)}
          onMouseDown={() => setResize({ status: true, direction: "left" })}
          className=" stroke-sky-300 fill-white cursor-n-resize"
        ></circle>
        <circle
          cx={endX}
          cy={endY}
          r={4}
          className=" stroke-sky-300 fill-white cursor-n-resize"
          onMouseEnter={() => setHoverActive(true)}
          onMouseLeave={() => setHoverActive(false)}
          onMouseDown={() => setResize({ status: true, direction: "right" })}
        ></circle>
      </svg>
    </div>
  );
}
