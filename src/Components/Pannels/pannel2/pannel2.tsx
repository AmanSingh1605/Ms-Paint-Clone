"use client";
import { LuBoxSelect } from "react-icons/lu";
import { FiCrop } from "react-icons/fi";
import { GiResize } from "react-icons/gi";
import { MdRotate90DegreesCw } from "react-icons/md";
import { useContext } from "react";
import { MainContext } from "@/Contexts/mainContext";

export default function Pannel2() {
  const { currentTool, currentBrushType, setCurrentBrushType, setCurrentTool } =
    useContext(MainContext);
  return (
    <div className=" flex px-2 h-full gap-2 w-min items-center justify-center">
      <div
        className={` flex flex-col p-2 rounded cursor-pointer justify-center items-center gap-2 hover:bg-blue-300/25 ${
          currentTool && currentTool.name === "Select" ? "bg-blue-300/25" : ""
        }`}
        onClick={() => {
          setCurrentBrushType({
            name: currentBrushType.name,
            value: currentBrushType.value,
            status: false,
          });
          setCurrentTool(() => {
            return {
              name: "Select",
            };
          });
        }}
      >
        <LuBoxSelect className="text-4xl" />
        <div className="text-sm ">{"Select"}</div>
      </div>
      <div className="flex flex-col items-center">
        <div className="flex gap-2">
          <FiCrop />
          <div>{"Crop"}</div>
        </div>
        <div className="flex gap-2 items-center">
          <GiResize />
          <div>{"Resize"}</div>
        </div>
        <div className="flex gap-2 items-center">
          <MdRotate90DegreesCw />
          <div>{"Rotate"}</div>
        </div>
      </div>
    </div>
  );
}
