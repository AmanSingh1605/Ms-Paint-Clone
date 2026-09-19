export type Rgba = { r: number; g: number; b: number; a: number };

/** Accepts #rrggbb as well as #rrggbbaa; a missing alpha means fully opaque. */
export const hexToRgba = (hex: string): Rgba => ({
  r: parseInt(hex.slice(1, 3), 16),
  g: parseInt(hex.slice(3, 5), 16),
  b: parseInt(hex.slice(5, 7), 16),
  a: hex.length >= 9 ? parseInt(hex.slice(7, 9), 16) : 255,
});

const toHex = (value: number) => value.toString(16).padStart(2, "0");

/** Always returns the 8-digit form the rest of the app stores. */
export const rgbaToHex = ({ r, g, b, a = 255 }: Partial<Rgba> & Omit<Rgba, "a">) =>
  `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(a)}`;
