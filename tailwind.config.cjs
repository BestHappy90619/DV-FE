/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    screens: {                // customize screen pixel for responsive design
      miniPhone: "360px",
      mobile: "400px",
      tablet: "640px",
      laptop: "1024px",
      desktop: "1280px",
    },
    fontFamily: {             // define font family
      sans: ['"Roboto"']      /// default font family
    },
    colors: {                 // define colors
      'custom-white': '#FFFBFB',
      'custom-light-gray': '#DCDCDC',
      'custom-medium-gray': '#C4C4C4',
      'custom-gray': '#757575',
      'custom-black': '#212121',
      'custom-sky': '#4489FE',
      'custom-sky-gray': '#F8FAFF'
    },
  },
  plugins: [],
});
