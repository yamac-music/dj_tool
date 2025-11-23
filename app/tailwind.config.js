/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        surface: '#030712',
        cyan: '#06b6d4',
        magenta: '#d946ef',
        danger: '#f43f5e',
        slate: '#111827',
      },
    },
  },
  plugins: [],
};
