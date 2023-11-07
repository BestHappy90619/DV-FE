/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans"],
      },
      width: {
        "calc-full-without-250": "calc(100% - 250px)",
      },
    },
    screens: {
      // customize screen pixel for responsive design
      miniPhone: "360px",
      mobile: "400px",
      tablet: "640px",
      laptop: "1024px",
      desktop: "1280px",
    },
    colors: {
      // define colors
      "custom-white": "#FFFBFB",
      "custom-light-gray": "#DCDCDC",
      "custom-medium-gray": "#C4C4C4",
      "custom-gray": "#757575",
      "custom-black": "#212121",
      "custom-sky": "#4489FE",
      "custom-sky-gray": "#F8FAFF",
      "custom-light-green": "#7adaa8",
      "custom-medium-green": "#20C26D",
      "custom-green": "#0FAA58",
      'custom-light-yellow': "#E9B80C",
      'custom-light-red': '#FF8477'
    },
  },
  plugins: [],
});
