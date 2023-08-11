/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    screens: {
      miniPhone: "360px",
      mobile: "400px",
      tablet: "640px",
      laptop: "1024px",
      desktop: "1280px",
    },
    fontFamily: {
      sans: ['"Roboto"']
    },
    colors: {
      'light-grey-75': '#757575',
      'heavy-grey-21': '#212121',
      'icon-4489FE': '#4489FE'
      },
  },
  plugins: [],
});
