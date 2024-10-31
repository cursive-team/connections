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
      keyframes: {
        "pulse-scale": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.15)" },
        },
      },
      animation: {
        "pulse-scale": "pulse-scale 1s ease-in-out infinite",
      },
      container: {
        padding: "24px",
        center: true,
      },
      backgroundImage: {
        "gradient-banner":
          "linear-gradient(0deg, rgba(255, 255, 255, 0.80) 0%, rgba(255, 255, 255, 0.80) 100%), linear-gradient(90deg, #FF9DF8 0%, #938AFF 100%)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "active-progress": "linear-gradient(90deg, #FF9DF8 0%, #FF70E9 100%)",
        "community-progress":
          "linear-gradient(90deg, #C5C5C5 0%, #767676 100%)",
      },
      fontFamily: {
        base: "var(--font-base)",
        sans: "var(--font-dm-sans)",
      },
      colors: {
        main: "var(--color-bg-main)",
        background: "var(--color-background)",
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        tertiary: "var(--color-tertiary)",
        quaternary: "var(--color-quaternary)",
        cinnamon: "var(--color-cinnamon)",

        tag: {
          gray: "var(--color-tag-gray)",
          active: "var(--color-tag-active)",
          border: "var(--color-tag-border)",
        },

        stroke: {
          primary: "var(--color-stroke-primary)",
          secondary: "var(--color-stroke-secondary)",
          quaternary: "var(--color-stroke-quaternary)",
        },

        surface: {
          primary: {
            DEFAULT: "var(--color-surface-primary)",
            hover: "var(--color-surface-primary-hover)",
          },
          quaternary: "var(--color-surface-quaternary)",
          notice: {
            primary: "var(--color-surface-notice-primary)",
            secondary: "var(--color-surface-notice-secondary)",
          },
          content: {
            primary: "var(--color-surface-content-primary)",
          },
        },

        icon: {
          primary: "var(--color-icon-primary)",
          notice: {
            primary: "var(--color-icon-notice-primary)",
            secondary: "var(--color-icon-notice-secondary)",
          },
        },

        link: {
          primary: "var(--color-link-primary)",
        },

        card: {
          primary: {
            bg: "var(--color-card-primary)",
            border: "var(--color-card-primary-border)",
          },
          secondary: {
            bg: "var(--color-card-secondary)",
            border: "var(--color-card-secondary-border)",
          },
          tertiary: {
            bg: "var(--color-card-tertiary)",
            border: "var(--color-card-tertiary-border)",
          },
          gray: "var(--color-card-gray)",
        },

        button: {
          primary: {
            DEFAULT: "var(--color-button-primary)",
            label: "var(--color-button-primary-label)",
            hover: "var(--color-button-primary-hover)",
          },
          secondary: {
            DEFAULT: "var(--color-button-secondary)",
            label: "var(--color-button-secondary-label)",
            hover: "var(--color-button-secondary-hover)",
          },
          outline: {
            DEFAULT: "var(--color-button-outline)",
            label: "var(--color-button-outline-label)",
            hover: "var(--color-button-outline-hover)",
          },
          subtle: {
            DEFAULT: "var(--color-button-subtle)",
            label: "var(--color-button-subtle-label)",
            hover: "var(--color-button-subtle-hover)",
          },
          ghost: {
            DEFAULT: "var(--color-button-ghost)",
            label: "var(--color-button-ghost-label)",
            hover: "var(--color-button-ghost-hover)",
          },
          link: {
            DEFAULT: "var(--color-button-link)",
            label: "var(--color-button-link-label)",
            "label-hover": "var(--color-button-link-label-hover)",
            hover: "var(--color-button-link-hover)",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
