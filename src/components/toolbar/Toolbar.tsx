import { BrushPanel } from "./panels/BrushPanel";
import { ClipboardPanel } from "./panels/ClipboardPanel";
import { ColorPanel } from "./panels/ColorPanel";
import { ImagePanel } from "./panels/ImagePanel";
import { ShapesPanel } from "./panels/ShapesPanel";
import { SizePanel } from "./panels/SizePanel";
import { ToolsPanel } from "./panels/ToolsPanel";

/** Group order follows the Home tab of the Windows 7 Paint ribbon. */
export default function Toolbar() {
  return (
    <div className="w-full border-b border-slate-400 bg-navbar">
      <div className="flex h-[92px] min-w-max items-stretch divide-x divide-slate-300 px-1 py-1">
        <ClipboardPanel />
        <ImagePanel />
        <ToolsPanel />
        <BrushPanel />
        <ShapesPanel />
        <SizePanel />
        <ColorPanel />
      </div>
    </div>
  );
}
