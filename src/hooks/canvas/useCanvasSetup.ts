import { useEffect, type RefObject } from "react";
import { usePaper } from "@/state";

export function useCanvasSetup(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  boardRef: RefObject<HTMLElement | null>
) {
  const { setSize } = usePaper();

  useEffect(() => {
    const canvas = canvasRef.current;
    const board = boardRef.current;
    if (!canvas || !board) return;

    canvas.width = board.clientWidth / 2;
    canvas.height = board.clientHeight / 2;
    setSize({ width: canvas.width, height: canvas.height });
  }, [canvasRef, boardRef, setSize]);
}
