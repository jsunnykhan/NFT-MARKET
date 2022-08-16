const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/features/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Lato", ...defaultTheme.fontFamily.sans],
        serif: ["Poppins", ...defaultTheme.fontFamily.serif],
        mono: ["Space Mono", ...defaultTheme.fontFamily.mono],
      },
      colors: {
        primary: "#000002",
        "primary-100": "#313139",
        secondary: "#8F8BFF",
        "white-100": "#B4B7BF",
        "white-200": "#D1D3D7",
      },
    },
  },
  plugins: [],
};
