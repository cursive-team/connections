import { link } from "fs";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      container: {
        padding: "24px",
        center: true,
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        base: "var(--font-base)",
      },
      colors: {
        background: "#FFF",

        primary: "#090909",
        secondary: "rgba(9, 9, 9, 0.60)",
        tertiary: "rgba(9, 9, 9, 0.50)",
        quaternary: "rgba(9, 9, 9, 0.40)",
        cinnamon: "#F74227",

        stroke: {
          primary: "rgba(0, 0, 0, 0.80)",
          secondary: "rgba(0, 0, 0, 0.60)",
          quaternary: "rgba(0, 0, 0, 0.20)",
        },

        surface: {
          primary: "#FFF",
          quaternary: "rgba(0, 0, 0, 0.03",
          notice: {
            primary: "#000000",
            secondary: "rgba(0, 0, 0, 0.15)",
          },
          content: {
            primary: "#FF9DF8",
          },
        },

        icon: {
          primary: "#090909",
          notice: {
            primary: "#F74227",
            secondary: "#7CE514",
          },
        },

        link: {
          primary: "#F429D5",
        },

        button: {
          primary: {
            DEFAULT: "#191A1E",
            label: "#FFF",
            hover: "rgba(25, 26, 30, 0.90)",
          },
          secondary: {
            DEFAULT: "#FF9DF8",
            label: "#191A1E",
            hover: "rgba(255, 157, 248, 0.9)",
          },
          outline: {
            DEFAULT: "#191A1E00",
            label: "#191A1E",
            hover: "#191A1E0F",
          },
          subtle: {
            DEFAULT: "#EDEDED",
            label: "#000",
            hover: "#E1E1E1",
          },
          ghost: {
            DEFAULT: "rgba(25, 26, 30, 0.00)",
            label: "#000",
            hover: "rgba(25, 26, 30, 0.02)",
          },
          link: {
            DEFAULT: "rgba(255, 255, 255, 0.00)",
            label: "#000",
            "label-hover": "#00197E",
            hover: "rgba(255, 255, 255, 0.00)",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
