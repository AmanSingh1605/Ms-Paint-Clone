"use client";
import { MainContext } from "@/Contexts/mainContext";
import { useContext } from "react";

export default function DropDownBrushWidthMenu({ active, resetState }) {
  const { brushWidth, setBrushWidth } = useContext(MainContext);
  const brushWidthArray = ["2", "4", "6", "8"];
  const brushMenuArray = brushWidthArray.map((item, index) => {
    return (
      <div
        className={`p-1 hover:bg-blue-200 cursor-pointer ${
          brushWidth === item ? "bg-blue-200 " : "bg-white"
        }`}
        key={index}
        onClick={() => {
          setBrushWidth(item);
          resetState();
        }}
      >
        <div
          className={`w-full bg-black`}
          style={{ height: item + "px" }}
        ></div>
      </div>
    );
  });

  return (
    <div
      className={`absolute w-56 z-50 border rounded p-2 bg-white ${
        !active ? "hidden" : ""
      }`}
    >
      <div className="w-full flex flex-col gap-2 ">{brushMenuArray}</div>
    </div>
  );
}
