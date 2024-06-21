"use client";
import { MainContext } from "@/Contexts/mainContext";
import { useContext, useEffect, useRef } from "react";

export default function DropDownBrushTypeMenu({ active, resetState }) {
  const { currentBrushType, setCurrentTool, setCurrentBrushType } =
    useContext(MainContext);
  const brushTypeArray = [
    { name: "Normal Brush", value: "round" },
    { name: "Square Brush", value: "square" },
    { name: "Smooth Brush", value: "butt" },
    { name: "Caligraphy Pen", value: "none" },
  ];

  const menuRef = useRef(null);

  useEffect(() => {
    function closeMenu(e) {
      if (active && !menuRef.current?.contains(e.target)) {
        resetState();
      }
    }
    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  });

  const brushMenuArray = brushTypeArray.map((item, index) => {
    return (
      <div
        className={`p-1 text-sm rounded w-36 hover:bg-blue-100 cursor-pointer transition-colors duration-400 ease-in-out  ${
          currentBrushType.name === item.name ? "bg-blue-200 " : "bg-white"
        }`}
        key={index}
        onClick={() => {
          setCurrentBrushType({
            name: item.name,
            value: item.value,
            status: true,
          });
          resetState();
        }}
      >
        {item.name}
      </div>
    );
  });

  return (
    <div
      className={`absolute z-50 border rounded p-2 h-fit bg-white ${
        !active ? "hidden" : ""
      }`}
      ref={menuRef}
    >
      <div className="w-full h-full flex flex-col ">{brushMenuArray}</div>
    </div>
  );
}
