type ColorPickerElement = HTMLElement & {
  addEventListener(
    type: "update-color",
    listener: (event: CustomEvent<{ hex: string }>) => void
  ): void;
};

export function openColorDialog(
  currentColor: string,
  onChange: (hex: string) => void
) {
  const picker = document.querySelector<ColorPickerElement>("color-picker");
  if (!picker) return;

  picker.setAttribute("open", "true");
  picker.setAttribute("hex", currentColor);
  picker.addEventListener("update-color", (event) => onChange(event.detail.hex));
}
