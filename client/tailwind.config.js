/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Semántica: Rústica y Artesanal Oaxaqueña
        hueso: '#FAF7F2',          // Hueso / manta natural base
        manta: '#FAF7F2',          // Alias para bg-manta
        
        barro: {
          DEFAULT: '#232323',      // Barro negro de San Bartolo Coyotepec
          dark: '#161616',
        },
        
        // Tintes Tradicionales
        cochinilla: {
          light: '#c73c4a',
          DEFAULT: '#A21C26',      // Rojo cochinilla (acento)
          dark: '#7e1018',
        },
        anil: {
          light: '#366e85',
          DEFAULT: '#1E4E60',      // Azul añil (acento)
          dark: '#123340',
        },
        maguey: {
          light: '#427e5e',
          DEFAULT: '#2D593E',      // Verde maguey (acento)
          dark: '#1b3b27',
        },
        cempasuchil: {
          light: '#eb9b50',
          DEFAULT: '#D57C2B',      // Ocre cempasúchil (acento)
          dark: '#ac5d18',
        },
        
        // Mapeo de compatibilidad de nombres anteriores de la app
        grana: {
          light: '#c73c4a',
          DEFAULT: '#A21C26',
          dark: '#7e1018',
        },
        maiz: '#D57C2B',
        mostaza: {
          light: '#eb9b50',
          DEFAULT: '#D57C2B',
          dark: '#ac5d18',
        },
        
        // Sobreescritura de colores estándar de Tailwind para skinning completo
        red: {
          50: '#FDF7F7',
          100: '#FBEBEB',
          200: '#F5CDCD',
          500: '#A21C26', // Rojo cochinilla
          600: '#A21C26',
          700: '#8C1820',
          800: '#73131A',
          900: '#5A0F14',
        },
        blue: {
          50: '#F4F7F8',
          100: '#E9EFF2',
          200: '#CADBE1',
          500: '#1E4E60', // Azul añil
          600: '#1E4E60',
          800: '#153643',
          900: '#0E242D',
        },
        green: {
          50: '#F5F8F6',
          100: '#EBF1ED',
          200: '#CDDED3',
          500: '#2D593E', // Verde maguey
          600: '#2D593E',
          700: '#254A33',
          800: '#1D3B29',
          900: '#152C1E',
        },
        yellow: {
          50: '#FCF9F5',
          100: '#FAF0E6',
          300: '#F6DFBF',
          400: '#D57C2B', // Ocre cempasúchil
          500: '#D57C2B',
          600: '#B3641F',
        },
        fuchsia: {
          500: '#1E4E60', // Azul añil
          600: '#123340',
        },
        pink: {
          50: '#FAF7F2',
          100: '#EBE5D8',  // Borde manta suave
          200: '#DECFAF',
          400: '#D57C2B',  // Ocre cempasúchil
          500: '#D57C2B',
        },
        rose: {
          500: '#A21C26',  // Rojo cochinilla
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      }
    },
  },
  plugins: [],
}