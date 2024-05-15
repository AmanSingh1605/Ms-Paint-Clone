import Pannel1 from "../Pannels/pannel1/pannel1";
import Pannel2 from "../Pannels/pannel2/pannel2";
import Pannel4 from "../Pannels/pannel4/pannel4";
import Pannel5 from "../Pannels/pannel5/pannel5";
import Pannel3 from "../Pannels/pannel3/pannel3";
import Pannel6 from "../Pannels/pannel6/pannel6";

export default function Topbar() {
  return (
    <div className="h-fit w-full  bg-blue-200 flex items-center justify-start">
      <div className="min-w-[1300px] flex divide-x-2 items-center">
        <Pannel1 />
        <Pannel2 />
        <Pannel3 />
        <Pannel6 />
        <Pannel4 />
        <Pannel5 />
      </div>
    </div>
  );
}
