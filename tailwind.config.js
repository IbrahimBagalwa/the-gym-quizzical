/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js, jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#F5F7FB",
          200: "#D6DBF5",
          300: "#4D5B9E",
          500: "#293264",
        },
      },
      fontFamily: {
        karla: ["karla", "sans"],
      },
    },
  },
  plugins: [],
};
