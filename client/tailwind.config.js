/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        grana: {
          light: '#f26a7e',
          DEFAULT: '#c51b34',
          dark: '#8b0f22',
        },
        barro: {
          DEFAULT: '#2c2c2c',
          dark: '#1a1a1a',
        },
        maiz: '#f4d03f',
        manta: '#f9f6f0',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      }
    },
  },
  plugins: [],
}