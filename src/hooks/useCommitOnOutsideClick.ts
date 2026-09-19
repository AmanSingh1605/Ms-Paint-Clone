import { useWindowEvent } from "./useWindowEvent";

type Options = {
  isInside: (target: Node) => boolean;
  onCommit: () => void;
  // Supplied by useDragInteraction, to ignore the click ending a drag.
  consumePendingClick: () => boolean;
};
export function useCommitOnOutsideClick({
  isInside,
  onCommit,
  consumePendingClick,
}: Options) {
  useWindowEvent(
    "click",
    (event) => {
      if (consumePendingClick()) return;
      if (isInside(event.target as Node)) return;
      onCommit();
    },
    // Registered a tick late so the click that opened the overlay does not
    // immediately close it.
    { deferRegistration: true }
  );
}
