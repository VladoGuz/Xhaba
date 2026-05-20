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
        tiliche: {
          rosa: '#F48FB1', // Rosa mexicano suavizado
          azul: '#81D4FA', // Azul añil suavizado
          amarillo: '#FFF59D', // Amarillo suavizado
          verde: '#A5D6A7', // Verde esmeralda suavizado
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}