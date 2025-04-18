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
          50: "#491212",
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
          "100%": { transform: "rotate(-50deg) translate(33.9vw, -9.87vw)" },
        },
        grow: {
          "0%": { opacity: 0.5, height: 0 },
          "75%": { opacity: 1, height: "60%" },
          "100%": { opacity: 1, height: "65%" },
        },
        pour: {
          "0%": { height: 0, width: "0%" },
          "25%": { height: "90%", width: "2%" },
          "40%": { height: "90%", width: "3%" },
          "60%": { height: "90%", width: "3%" },
          "75%": { height: "90%", width: "2%" },
          "100%": { height: "90%", width: "0%" },
        },
        growText: {
          "0%": { transform: "scale(0.1, 2)", color: "#a7c191" },
          "75%": { transform: "scale(0.1, 2)" },
          "100%": { transform: "none", color: "#491212" },
        },
        words1: {
          "0%": {
            transform: "rotate(90deg) translate(-300px)",
            filter: "blur(10px)",
            opacity: 0,
          },
          "70%": { transform: "rotate(90deg)" },
          "100%": { transform: "none", opacity: 1 },
        },
        words2: {
          "0%": {
            transform: "rotate(90deg) translate(-250px)",
            filter: "blur(10px)",
            opacity: 0,
          },
          "70%": { transform: "rotate(90deg)" },
          "100%": { transform: "none", opacity: 1 },
        },
        words3: {
          "0%": {
            transform: "rotate(-90deg) translate(250px)",
            filter: "blur(10px)",
            opacity: 0,
          },
          "70%": { transform: "rotate(-90deg)" },
          "100%": { transform: "none", opacity: 1 },
        },
        words4: {
          "0%": {
            transform: "rotate(-90deg) translate(200px)",
            filter: "blur(10px)",
            opacity: 0,
          },
          "70%": { transform: "rotate(-90deg)" },
          "100%": { transform: "none", opacity: 1 },
        }
      },
      animation: {
        "change-color": "changeColor 5s infinite linear",
        "move-teapot": "moveTeapot 3s ease forwards",
        grow: "grow 2s linear forwards 4s",
        pour: "pour 4s linear forwards 2.5s",
        words1: "words1 4s linear forwards 2.5s",
        words2: "words2 4s linear forwards 2.5s",
        words3: "words3 4s linear forwards 2.5s",
        words4: "words4 4s linear forwards 2.5s",
        "grow-text": "growText 4s linear forwards 2s"
      },
    },
  },
  plugins: [],
};
