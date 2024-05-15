"use client";
import DropDownBrushWidthMenu from "@/Components/DropDownMenu/dropDownBrushWidthMenu";
import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";

export default function Pannel4() {
  const [menuVisible, setMenuVisible] = useState(false);
  return (
    <div className="group relative px-2 py-2">
      <div className="flex flex-col justify-center items-center">
        <div className="flex flex-col w-full">
          <div className="mt-[3px] border border-black w-full bg-black "></div>
          <div className="mt-[3px] h-[4px] w-full bg-black "></div>
          <div className="mt-[3px] h-[6px] w-full bg-black "></div>
          <div className="mt-[3px] h-[8px] w-full bg-black "></div>
        </div>
        <div className="text-sm ">{"Size"}</div>
        <FaCaretDown onClick={() => setMenuVisible(!menuVisible)} />
        <div className="relative flex justify-center">
          <DropDownBrushWidthMenu
            active={menuVisible}
            resetState={() => setMenuVisible(false)}
          />
        </div>
      </div>
    </div>
  );
}
