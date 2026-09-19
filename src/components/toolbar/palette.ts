export type Swatch = { color: string; name: string };

/** The Windows 7 Paint default palette: two rows of ten. */
export const PALETTE: Swatch[] = [
  { color: "#000000FF", name: "Black" },
  { color: "#575757FF", name: "Dark Gray" },
  { color: "#FF0000FF", name: "Red" },
  { color: "#FFA500FF", name: "Orange" },
  { color: "#FFFF00FF", name: "Yellow" },
  { color: "#00FF00FF", name: "Lime Green" },
  { color: "#008000FF", name: "Green" },
  { color: "#008080FF", name: "Teal" },
  { color: "#0000FFFF", name: "Blue" },
  { color: "#000080FF", name: "Navy Blue" },
  { color: "#FFFFFFFF", name: "White" },
  { color: "#800080FF", name: "Purple" },
  { color: "#D3D3D3FF", name: "Light Gray 1" },
  { color: "#C0C0C0FF", name: "Light Gray 2" },
  { color: "#FFC0CBFF", name: "Pink" },
  { color: "#FFE4B5FF", name: "Peach" },
  { color: "#FFFFE0FF", name: "Light Yellow" },
  { color: "#CCFFCCFF", name: "Light Lime Green" },
  { color: "#AFEEEEFF", name: "Light Teal" },
  { color: "#ADD8E6FF", name: "Light Blue" },
];

/** Paint keeps a third row of empty wells for recently mixed colours. */
export const RECENT_SLOTS = 10;
