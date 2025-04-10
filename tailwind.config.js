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
        moveTeapot: {
          "100%": { transform: "rotate(-50deg) translate(600px,-200px)" },
        },
        grow: {
          "0%": { opacity: 0.5, height: 0 },
          "100%": { opacity: 1, height: "65%" }
        },
        pour: {
          "0%": { height: 0 },
          "100%": { height: "100%", opacity: 0 }
        }
      },
      animation: {
        "change-color": "changeColor 5s infinite linear",
        "move-teapot": "moveTeapot 3s ease forwards",
        grow: "grow 3s ease forwards 2s",
        pour: "pour 2s linear forwards 2s"
      },
    },
  },
  plugins: [],
};
