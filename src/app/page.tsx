import DrawingBoard from "@/components/canvas/DrawingBoard";
import Toolbar from "@/components/toolbar/Toolbar";

export default function Home() {
  return (
    <main
      id="boardContainer"
      className="h-screen w-full overflow-y-hidden bg-gray-400"
    >
      <Toolbar />
      <DrawingBoard />
    </main>
  );
}
