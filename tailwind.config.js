/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        green: {
          50: "#98a565",
          100: "#414d08",
        },
        white: {
          50: "#dae2e2",
        },
        purple: {
          50: "#665a6a",
          100: "#402e37",
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
      },
      animation: {
        "change-color": "changeColor 5s infinite linear",
        wheel: "wheel 1.6s ease infinite"
      },
    },
  },
  plugins: [],
};
