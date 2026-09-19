import { useEffect, useRef } from "react";

// Updated after render, never during it, so long-lived handlers can read
// current values without being re-attached.
export function useLatestRef<T>(value: T) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref;
}
