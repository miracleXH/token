import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        brown: ["var(--font-brown)"],
        "brown-light": ["var(--font-brown-light)"],
        "brown-bold": ["var(--font-brown-bold)"],
      },
      colors: {
        "primary-color": "#00e5ff",
      },
    },
  },
  plugins: [],
};
export default config;
