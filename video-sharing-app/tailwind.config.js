/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Ensure Tailwind scans all files in the src folder
  ],
  theme: {
    extend: {
      colors: {
        softRed: '#f08080',
        softPeach: '#f4978e',
        softOrange: '#f8ad9d',
        softPink: '#fbc4ab',
        pastelPeach: '#ffdab9',
      },
    },
  },
  plugins: [],
};