import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          green: "#39ff14",
          pink: "#ff6ec7",
          blue: "#00f0ff",
          purple: "#bf00ff",
          yellow: "#fff01f",
          orange: "#ff6600",
        },
      },
      boxShadow: {
        neon: "0 0 20px rgba(0, 240, 255, 0.3), 0 0 60px rgba(0, 240, 255, 0.1)",
        "neon-pink": "0 0 20px rgba(255, 110, 199, 0.3), 0 0 60px rgba(255, 110, 199, 0.1)",
        "neon-green": "0 0 20px rgba(57, 255, 20, 0.3), 0 0 60px rgba(57, 255, 20, 0.1)",
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
