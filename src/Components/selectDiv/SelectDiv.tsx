import { MainContext } from "@/Contexts/mainContext";
import { pasteImageFromSelection } from "@/Service/Functions/selectImage";
import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";

export default function SelectDiv({
  xAxis,
  yAxis,
  parentHeight,
  setSelectBox,
  getImageData,
  putImageData,
}) {
  const { paperDimensions } = useContext(MainContext);

  const containerRef = useRef(null);

  const [selected, setSelect] = useState(true);
  const [startX, setStartX] = useState(xAxis);
  const [startY, setStartY] = useState(yAxis);
  const [endX, setEndX] = useState(xAxis);
  const [endY, setEndY] = useState(yAxis);
  const [resize, setResize] = useState({ status: false, direction: "" });
  const [preventDeletion, setPreventDeletion] = useState(false);
  const [imageURL, setImageURL] = useState("");
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

  //Used to resize the textbox
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

  //remove the selectBox if clicked outside
  useEffect(() => {
    function removeSelectBox(e) {
      const containerArea = containerRef.current.getBoundingClientRect();
      if (
        e.clientX < containerArea.left - 5 ||
        e.clientX > containerArea.right + 5 ||
        e.clientY < containerArea.top - 5 ||
        e.clientY > containerArea.bottom + 5
      ) {
        if (!preventDeletion) {
          putImageData(startX, startY, endX, endY, imageURL);
          setSelectBox();
        } else setPreventDeletion(false);
      }
    }
    window.addEventListener("click", removeSelectBox);
    return () => {
      window.removeEventListener("click", removeSelectBox);
    };
  }, [preventDeletion, imageURL]);

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

    if (containerRef.current) {
      containerRef.current.addEventListener("mousedown", (e) => {
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
      if (containerRef.current) {
        containerRef.current.removeEventListener("mousedown", (e) =>
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

  //print Picture in selectBox
  useEffect(() => {
    if (!selected && containerRef.current) {
      setImageURL(getImageData(startX, startY, endX, endY));
    }
  }, [selected]);

  return selected ? (
    <div
      className="absolute border-2 border-black border-dashed bg-transparent"
      style={{
        top: startY + "px",
        left: startX + "px",
        height: Math.abs(endY - startY) + "px",
        width: Math.abs(endX - startX) + "px",
      }}
    ></div>
  ) : (
    <div
      ref={containerRef}
      className="absolute m-0 p-0"
      style={{
        top: startY + "px",
        left: startX + "px",
        height: endY - startY + "px",
        width: endX - startX + "px",
      }}
    >
      <div className="relative m-0 p-0 h-full w-full border-2 border-black border-dashed cursor-move object-fill">
        {imageURL ? (
          <Image
            src={imageURL}
            className="absolute h-full w-full pointer-events-none"
            height={endY - startY}
            width={endX - startX}
            alt=""
          />
        ) : (
          <></>
        )}
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
