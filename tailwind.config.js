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
      height: {
        '2screen': '200vh',
      },
      keyframes: {
        moveSection: {
          "100%": { transform: "translateY(-90vh)" },
        },
        moveTeapot: {
          "100%": { transform: "rotate(-50deg)" },
        },
        pour: {
          "0%": { height: 0, width: "0%" },
          "25%": { height: "100%", width: "2%" },
          "40%": { height: "100%", width: "3%" },
          "60%": { height: "100%", width: "3%" },
          "75%": { height: "100%", width: "2%" },
          "100%": { height: "100%", width: "0%" },
        },
        growText: {
          "0%": { transform: "scale(0.1, 2)", filter: "blur(10px)" },
          "75%": { transform: "scale(0.1, 2)", filter: "blur(10px)" },
          "100%": { transform: "none", filter: "none" },
        },
        words1: {
          "0%": {
            transform: "rotate(90deg) translate(-300px)",
            opacity: 0,
          },
          "70%": { transform: "rotate(90deg)" },
          "100%": { transform: "none", opacity: 1 },
        },
        words2: {
          "0%": {
            transform: "rotate(90deg) translate(-250px)",
            opacity: 0,
          },
          "70%": { transform: "rotate(90deg)" },
          "100%": { transform: "none", opacity: 1 },
        },
        words3: {
          "0%": {
            transform: "rotate(-90deg) translate(250px)",
            opacity: 0,
          },
          "70%": { transform: "rotate(-90deg)" },
          "100%": { transform: "none", opacity: 1 },
        },
        words4: {
          "0%": {
            transform: "rotate(-90deg) translate(200px)",
            opacity: 0,
          },
          "70%": { transform: "rotate(-90deg)" },
          "100%": { transform: "none", opacity: 1 },
        },
      },
      animation: {
        "move-teapot": "moveTeapot 3s ease forwards",
        pour: "pour 4s linear forwards 2.5s",
        words1: "words1 4s linear forwards 2.5s",
        words2: "words2 4s linear forwards 2.5s",
        words3: "words3 4s linear forwards 2.5s",
        words4: "words4 4s linear forwards 2.5s",
        "grow-text": "growText 4s linear forwards 2s",
        "move-section": "moveSection 4s forwards 4s",
      },
    },
  },
  plugins: [],
};
