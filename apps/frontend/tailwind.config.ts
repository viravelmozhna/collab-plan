import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        bluish: "#15539b",
        yellowish: "#f1cc78",
        greyish: "#15549b06",
        "greyish-2": "#808080",
        greenish: "#C7DB9C",
        redish: "#FF8989",
        "greyish-3": "#cbd5e0",
      },
    },
    spacing: {
      "0": "0",
      "2": "2px",
      "4": "4px",
      "8": "8px",
      "12": "12px",
      "20": "20px",
      "40": "40px",
      "60": "60px",
      "64": "64px",
      "68": "68px",
      "76": "76px",
      "100": "100px",
      "176": "176px",
      auto: "auto",
      "max-content": "min-content",
      "fit-content": "fit-content",
      "100vh": "100vh",
      "1/4": "25%",
    },
  },
  plugins: [],
};
export default config;
