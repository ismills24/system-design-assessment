/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Ensure Tailwind scans all files in the src folder
  ],
  theme: {
      colors: {
        one: '#212A31',
        two: '#2E3944',
        three: '#124E66',
        four: '#748D92',
        five: '#D3D9D4',
        white: '#ffffff'
      },
  },
  plugins: [],
};