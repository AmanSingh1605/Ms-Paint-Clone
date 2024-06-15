import { LuClipboardList } from "react-icons/lu";
import { TfiCut } from "react-icons/tfi";
import { ImCopy } from "react-icons/im";

export default function Pannel1() {
  return (
    <div className=" h-full w-min flex justify-center items-center">
      <div className="flex gap-2 px-2">
        <div className="flex flex-col justify-center items-center gap-2 text-slate-400">
          <LuClipboardList className="text-4xl" />
          <div className="text-sm">{"Paste"}</div>
        </div>
        <div className="flex flex-col items-center text-slate-400">
          <div className="flex gap-2">
            <TfiCut />
            <div>{"Cut"}</div>
          </div>
          <div className="flex gap-2 items-center">
            <ImCopy />
            <div>{"Copy"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
