/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0b0e14",
        surface: "#131a23",
        accent: "#60a5fa",
        muted: "#94a3b8"
      },
      boxShadow: {
        'soft': '0 10px 30px rgba(0,0,0,0.35)'
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Apple Color Emoji", "Segoe UI Emoji"]
      }
    },
  },
  plugins: [],
};
