import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        "tool-icon-color": "transparent", 
        "tool-icon-color-active": "rgb(244,212,177)"
      },
      backgroundImage: {
        "navbar": "linear-gradient(180deg, rgba(246,251,255,1) 0%, rgba(223,233,246,1) 26%, rgba(223,233,246,1) 94%, rgba(220,231,245,1) 100%)",
        "tool-icon":"linear-gradient(180deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.75) 100%);",
        "tool-icon-active": "linear-gradient(180deg, rgba(244,212,177,1) 32%, rgba(250,204,130,1) 51%, rgba(255,197,94,1) 61%, rgba(255,186,94,1) 91%, rgba(255,238,193,1) 100%)",
        "icon-hover": "linear-gradient(180deg, rgba(201,224,248,0.5) 52%, rgba(201,224,248,1) 100%);"
      },
    },
  },
  plugins: [],
};
export default config;
