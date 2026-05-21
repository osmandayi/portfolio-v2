import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)", panel: "var(--panel)", "panel-2": "var(--panel-2)",
        border: "var(--border)", fg: "var(--fg)", "fg-muted": "var(--fg-muted)",
        accent: "var(--accent)", "accent-2": "var(--accent-2)",
        success: "var(--success)", danger: "var(--danger)", warning: "var(--warning)",
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
      },
      keyframes: {
        "caret-blink": { "0%,70%,100%": { opacity: "1" }, "20%,50%": { opacity: "0" } },
      },
      animation: { "caret-blink": "caret-blink 1.1s ease-in-out infinite" },
    },
  },
  plugins: [animate],
};
export default config;
