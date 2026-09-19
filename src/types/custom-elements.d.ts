import type { DetailedHTMLProps, HTMLAttributes } from "react";

// color-dialog-box registers a custom element that JSX does not know about.
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "color-picker": DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & { open?: string; hex?: string },
        HTMLElement
      >;
    }
  }
}
