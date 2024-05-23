import DrawingBoard from "@/Components/drawingBoard/drawingBoard";
import Topbar from "@/Components/topbar/topbar";

export default function Home() {
  return (
    <main
      id="boardContainer"
      className="h-screen overflow-y-hidden w-full bg-gray-400"
    >
      <Topbar />
      <DrawingBoard />
    </main>
  );
}
