import { useEffect } from "react";
import { useLatestRef } from "./useLatestRef";

// The handler is read through a ref so callers may pass an inline arrow, and
// removeEventListener always receives the exact function that was registered.
export function useWindowEvent<K extends keyof WindowEventMap>(
  type: K,
  handler: (event: WindowEventMap[K]) => void,
  options?: { enabled?: boolean; deferRegistration?: boolean }
) {
  const handlerRef = useLatestRef(handler);
  const { enabled = true, deferRegistration = false } = options ?? {};

  useEffect(() => {
    if (!enabled) return;

    const listener = (event: WindowEventMap[K]) => handlerRef.current(event);

    // Deferring by a tick lets a component register a click handler without
    // catching the very click that created it.
    let timer = 0;
    if (deferRegistration) {
      timer = window.setTimeout(
        () => window.addEventListener(type, listener as EventListener),
        0
      );
    } else {
      window.addEventListener(type, listener as EventListener);
    }

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(type, listener as EventListener);
    };
  }, [type, enabled, deferRegistration, handlerRef]);
}
