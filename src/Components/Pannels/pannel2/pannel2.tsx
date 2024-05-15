import { LuBoxSelect } from "react-icons/lu";
import { FiCrop } from "react-icons/fi";
import { GiResize } from "react-icons/gi";
import { MdRotate90DegreesCw } from "react-icons/md";

export default function Pannel2() {


    return <div className=" flex gap-2 px-2">
        <div className="flex flex-col justify-center items-center gap-2">
            <LuBoxSelect className="text-4xl" />
            <div className="text-sm">{"Select"}</div>
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
}