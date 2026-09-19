"use client";
import Image from "next/image";
import { useRef, useState, type RefObject } from "react";
import { useCommitOnOutsideClick } from "@/hooks/useCommitOnOutsideClick";
import { useLatestRef } from "@/hooks/useLatestRef";
import { useDragInteraction } from "@/hooks/useDragInteraction";
import { boundsSize, type Bounds, type Point } from "@/lib/canvas/bounds";
import { cutRegion, pasteRegion } from "@/lib/tools/clipboard";
import { useHistory } from "@/hooks/canvas/useCanvasHistory";
import { usePaper } from "@/state";
import { ResizeHandles } from "@/components/ui/ResizeHandles";

type Props = {
  origin: Point;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  onDone: () => void;
};

// Drag to mark a region. It is lifted off the canvas so it can be moved or
// resized, then stamped back down when the user clicks away.
export default function SelectionOverlay({ origin, canvasRef, onDone }: Props) {
  const { size } = usePaper();
  const history = useHistory();
  const [clipboard, setClipboard] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const clipboardRef = useLatestRef(clipboard);

  const { bounds, boundsRef, isSizing, startResize, startMove, consumePendingClick } =
    useDragInteraction({
      origin,
      canvasRef,
      limit: size,
      // Lift the pixels as soon as the region is defined. The snapshot covers
      // the whole cut, move and paste as one undo step.
      onSizingComplete: (finalBounds: Bounds) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        history.commit();
        setClipboard(cutRegion(canvas, finalBounds));
      },
    });

  useCommitOnOutsideClick({
    isInside: (target) => containerRef.current?.contains(target) ?? false,
    consumePendingClick,
    onCommit: () => {
      const canvas = canvasRef.current;
      if (canvas) pasteRegion(canvas, boundsRef.current, clipboardRef.current);
      onDone();
    },
  });

  const { width, height } = boundsSize(bounds);
  const style = {
    top: bounds.startY,
    left: bounds.startX,
    height: Math.max(height, 0),
    width: Math.max(width, 0),
  };

  if (isSizing)
    return (
      <div
        className="absolute border-2 border-dashed border-black bg-transparent"
        style={style}
      />
    );

  return (
    <div
      ref={containerRef}
      className="absolute m-0 p-0"
      style={style}
      onMouseDown={startMove}
    >
      <div className="relative m-0 h-full w-full cursor-move border-2 border-dashed border-black p-0">
        {clipboard ? (
          <Image
            src={clipboard}
            className="pointer-events-none absolute h-full w-full"
            height={Math.max(height, 1)}
            width={Math.max(width, 1)}
            unoptimized
            alt=""
          />
        ) : null}
        <ResizeHandles onResizeStart={startResize} stopPropagation />
      </div>
    </div>
  );
}
