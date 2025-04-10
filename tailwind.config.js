/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        green: {
          50: "#cde2bd",
          100: "#a7c191",
        },
        white: {
          50: "#dae2e2",
        },
        dark: {
          50: "#491212"
        },
        purple: {
          50: "#eadbdc",
          100: "#e4cbce",
        },
      },
      keyframes: {
        changeColor: {
          from: { filter: "hue-rotate(0deg)" },
          to: { filter: "hue-rotate(-360deg)" },
        },
        wheel: {
          "0%": { transform: "translateY(2px)", opacity: 0 },
          "30%": { opacity: 1 },
          "100%": { transform: "translateY(5px)", opacity: 0 },
        },
        pourTea: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(-50deg) translate(600px,-200px)" },
        }
      },
      animation: {
        "change-color": "changeColor 5s infinite linear",
        wheel: "wheel 1.6s ease infinite",
        "pour-tea": "pourTea 2s ease"
      },
    },
  },
  plugins: [],
};
