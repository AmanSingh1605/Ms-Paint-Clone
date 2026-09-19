"use client";
import { useEffect, useRef, useState, type RefObject } from "react";
import { useCommitOnOutsideClick } from "@/hooks/useCommitOnOutsideClick";
import { useDragInteraction } from "@/hooks/useDragInteraction";
import { useLatestRef } from "@/hooks/useLatestRef";
import { boundsSize, type Point } from "@/lib/canvas/bounds";
import { renderTextToCanvas } from "@/lib/text/renderText";
import { useColors } from "@/state";
import { ResizeHandles } from "@/components/ui/ResizeHandles";

const DEFAULT_SIZE = { width: 200, height: 60 };
const MIN_SIZE = 20;

type Props = {
  origin: Point;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  onDone: () => void;
};

// Rasterises onto the canvas when the user clicks away. Opens at a fixed
// size, so it skips the drag-to-size phase the other overlays use.
export default function TextBox({ origin, canvasRef, onDone }: Props) {
  const { primary, secondary } = useColors();
  const [text, setText] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const textRef = useLatestRef(text);

  const { bounds, boundsRef, startResize, consumePendingClick } =
    useDragInteraction({
      origin,
      canvasRef,
      initialSize: DEFAULT_SIZE,
      minSize: MIN_SIZE,
    });

  useCommitOnOutsideClick({
    isInside: (target) => containerRef.current?.contains(target) ?? false,
    consumePendingClick,
    onCommit: () => {
      const canvas = canvasRef.current;
      if (canvas)
        renderTextToCanvas(canvas, textRef.current, boundsRef.current, {
          color: primary,
          background: secondary,
        });
      onDone();
    },
  });

  // Grow the box downwards as the text outgrows it.
  useEffect(() => {
    const textArea = textAreaRef.current;
    if (textArea && textArea.scrollHeight > textArea.clientHeight)
      textArea.style.height = `${textArea.scrollHeight}px`;
  }, [text]);

  const { width, height } = boundsSize(bounds);

  return (
    <div
      ref={containerRef}
      className="absolute"
      style={{
        top: bounds.startY,
        left: bounds.startX,
        height: Math.max(height, 0),
        width: Math.max(width, 0),
      }}
    >
      <div className="relative flex h-full w-full items-center justify-center">
        <textarea
          ref={textAreaRef}
          className="no-scrollbar h-full w-full whitespace-pre-wrap border border-dashed border-black bg-transparent p-1 outline-none"
          value={text}
          autoFocus
          style={{ resize: "none" }}
          onChange={(event) => setText(event.target.value)}
        />
        <ResizeHandles onResizeStart={startResize} />
      </div>
    </div>
  );
}
