"use client";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { usePaper } from "@/state";

// Snapshots are full canvas copies, so the depth is a memory budget.
const MAX_STEPS = 20;

export type CanvasHistory = {
  // Records the canvas as it is now, before the caller changes it.
  commit: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

const NOOP: CanvasHistory = {
  commit: () => {},
  undo: () => {},
  redo: () => {},
  canUndo: false,
  canRedo: false,
};

const HistoryContext = createContext<CanvasHistory>(NOOP);

export const useHistory = () => useContext(HistoryContext);

export function HistoryProvider({
  value,
  children,
}: {
  value: CanvasHistory;
  children: ReactNode;
}) {
  return (
    <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
  );
}

// drawImage rather than getImageData, which forces a slow GPU readback.
function snapshot(canvas: HTMLCanvasElement) {
  const copy = document.createElement("canvas");
  copy.width = canvas.width;
  copy.height = canvas.height;
  copy.getContext("2d")?.drawImage(canvas, 0, 0);
  return copy;
}

export function useCanvasHistory(
  canvasRef: RefObject<HTMLCanvasElement | null>
): CanvasHistory {
  const { setSize } = usePaper();
  const past = useRef<HTMLCanvasElement[]>([]);
  const future = useRef<HTMLCanvasElement[]>([]);
  const [depth, setDepth] = useState({ past: 0, future: 0 });

  const sync = useCallback(
    () => setDepth({ past: past.current.length, future: future.current.length }),
    []
  );

  const restore = useCallback(
    (frame: HTMLCanvasElement) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Assigning width or height clears the canvas, so only touch them when
      // the size actually differs.
      if (canvas.width !== frame.width || canvas.height !== frame.height) {
        canvas.width = frame.width;
        canvas.height = frame.height;
        setSize({ width: frame.width, height: frame.height });
      }

      const pen = canvas.getContext("2d");
      if (!pen) return;
      pen.clearRect(0, 0, canvas.width, canvas.height);
      pen.drawImage(frame, 0, 0);
    },
    [canvasRef, setSize]
  );

  const commit = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    past.current.push(snapshot(canvas));
    if (past.current.length > MAX_STEPS) past.current.shift();
    future.current = [];
    sync();
  }, [canvasRef, sync]);

  const undo = useCallback(() => {
    const canvas = canvasRef.current;
    const frame = past.current.pop();
    if (!canvas || !frame) return;
    future.current.push(snapshot(canvas));
    restore(frame);
    sync();
  }, [canvasRef, restore, sync]);

  const redo = useCallback(() => {
    const canvas = canvasRef.current;
    const frame = future.current.pop();
    if (!canvas || !frame) return;
    past.current.push(snapshot(canvas));
    restore(frame);
    sync();
  }, [canvasRef, restore, sync]);

  return useMemo(
    () => ({
      commit,
      undo,
      redo,
      canUndo: depth.past > 0,
      canRedo: depth.future > 0,
    }),
    [commit, undo, redo, depth]
  );
}
