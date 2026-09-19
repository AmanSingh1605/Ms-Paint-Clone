import { useCallback, useRef, useState, type RefObject } from "react";
import {
  boundsFromDrag,
  boundsFromOrigin,
  resizeBounds,
  translateBounds,
  type Bounds,
  type Point,
  type ResizeDirection,
  type Size,
} from "@/lib/canvas/bounds";
import { canvasPoint } from "@/lib/canvas/point";
import { useLatestRef } from "./useLatestRef";
import { useWindowEvent } from "./useWindowEvent";

const DEFAULT_MIN_SIZE = 10;

type Interaction =
  | { mode: "sizing" }
  | { mode: "idle" }
  | { mode: "resize"; direction: ResizeDirection }
  | { mode: "move"; lastX: number; lastY: number };

export type DragInteractionOptions = {
  origin: Point;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  // Setting a size skips the drag-to-size phase, as the text box needs.
  initialSize?: Size;
  minSize?: number;
  // Keeps moves inside this box, normally the paper dimensions.
  limit?: Size;
  onSizingComplete?: (bounds: Bounds) => void;
};

export type DragInteraction = {
  bounds: Bounds;
  boundsRef: RefObject<Bounds>;
  isSizing: boolean;
  startResize: (direction: ResizeDirection) => void;
  startMove: (event: { clientX: number; clientY: number }) => void;
  // A drag ends with mouseup then click. Overlays that commit on an outside
  // click must ignore that trailing click or the drag destroys them.
  consumePendingClick: () => boolean;
};

// Drag-to-size, resize and move, shared by all three overlays.
export function useDragInteraction({
  origin,
  canvasRef,
  initialSize,
  minSize = DEFAULT_MIN_SIZE,
  limit,
  onSizingComplete,
}: DragInteractionOptions): DragInteraction {
  const [bounds, setBounds] = useState<Bounds>(() =>
    boundsFromOrigin(origin, initialSize)
  );
  const [isSizing, setIsSizing] = useState(!initialSize);

  const anchor = useRef(origin);
  const interaction = useRef<Interaction>({
    mode: initialSize ? "idle" : "sizing",
  });
  const pendingClick = useRef(!initialSize);

  const boundsRef = useLatestRef(bounds);
  const limitRef = useLatestRef(limit);
  const sizingDoneRef = useLatestRef(onSizingComplete);

  const toCanvas = useCallback(
    (event: MouseEvent) => {
      const canvas = canvasRef.current;
      return canvas ? canvasPoint(event, canvas) : null;
    },
    [canvasRef]
  );

  useWindowEvent("mousemove", (event) => {
    const state = interaction.current;
    if (state.mode === "idle") return;

    if (state.mode === "move") {
      const deltaX = event.clientX - state.lastX;
      const deltaY = event.clientY - state.lastY;
      state.lastX = event.clientX;
      state.lastY = event.clientY;
      setBounds((current) =>
        translateBounds(current, deltaX, deltaY, limitRef.current)
      );
      return;
    }

    const point = toCanvas(event);
    if (!point) return;

    if (state.mode === "sizing") {
      setBounds(boundsFromDrag(anchor.current, point));
      return;
    }

    setBounds((current) =>
      resizeBounds(current, state.direction, point, minSize)
    );
  });

  useWindowEvent("mouseup", () => {
    const state = interaction.current;
    if (state.mode === "idle") return;

    if (state.mode === "sizing") {
      setIsSizing(false);
      sizingDoneRef.current?.(boundsRef.current);
    }

    interaction.current = { mode: "idle" };
    pendingClick.current = true;
  });

  const startResize = useCallback((direction: ResizeDirection) => {
    interaction.current = { mode: "resize", direction };
  }, []);

  const startMove = useCallback(
    (event: { clientX: number; clientY: number }) => {
      interaction.current = {
        mode: "move",
        lastX: event.clientX,
        lastY: event.clientY,
      };
    },
    []
  );

  const consumePendingClick = useCallback(() => {
    if (!pendingClick.current) return false;
    pendingClick.current = false;
    return true;
  }, []);

  return {
    bounds,
    boundsRef,
    isSizing,
    startResize,
    startMove,
    consumePendingClick,
  };
}
