import { useEffect, type RefObject } from "react";
import { useLatestRef } from "./useLatestRef";

export function useOutsideClick(
  ref: RefObject<HTMLElement | null>,
  onOutside: () => void,
  enabled = true
) {
  const callbackRef = useLatestRef(onOutside);

  useEffect(() => {
    if (!enabled) return;

    const onMouseDown = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) callbackRef.current();
    };

    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [ref, enabled, callbackRef]);
}
