// import "color-dialog-box";
export default function handleColorPicker(primaryColor, setPrimaryColor) {
  const picker = document.querySelector("color-picker");
  picker.setAttribute("open", "true");
  picker.setAttribute("hex", primaryColor);

  const updateColor = (e) => {
    const hex = e.detail.hex;
    setPrimaryColor(hex);
  };
  picker.addEventListener("update-color", updateColor);
}

