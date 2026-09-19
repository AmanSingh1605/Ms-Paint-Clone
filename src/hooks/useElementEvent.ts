import { useEffect, type RefObject } from "react";
import { useLatestRef } from "./useLatestRef";

export function useElementEvent<
  T extends HTMLElement,
  K extends keyof HTMLElementEventMap,
>(
  ref: RefObject<T | null>,
  type: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  enabled = true
) {
  const handlerRef = useLatestRef(handler);

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;

    const listener = (event: HTMLElementEventMap[K]) =>
      handlerRef.current(event);
    element.addEventListener(type, listener as EventListener);
    return () => element.removeEventListener(type, listener as EventListener);
  }, [ref, type, enabled, handlerRef]);
}
