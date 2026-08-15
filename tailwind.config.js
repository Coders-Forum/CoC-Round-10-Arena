/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Clash', 'Clash Display', 'sans-serif'],
        clash: ['Clash', 'Clash Display', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
