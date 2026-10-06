/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        espresso: {
          950: '#140605',
          900: '#1C0B0A',
          850: '#230E0C',
          800: '#2B120F',
          750: '#341613',
          700: '#3F1C18',
          600: '#4D241E',
          500: '#64312A',
        },
        cream: {
          50: '#FAF8F5',
          100: '#F5EFE6',
          200: '#EDE3D8',
          300: '#DFD2C4',
          400: '#C7B5A3',
          500: '#AFA090',
        },
        terracotta: {
          50: '#FDF4F3',
          100: '#FCE7E4',
          200: '#F8CECA',
          300: '#F1A9A2',
          400: '#E57365',
          500: '#CE5A4D',
          600: '#B84E43',
          700: '#9E4238',
          800: '#843932',
          900: '#6E2F29',
        },
        champagne: {
          100: '#FAF3E7',
          200: '#F3E5CB',
          300: '#E8D2A7',
          400: '#DAB87F',
          500: '#C59B5D',
          600: '#A88047',
        },
        canvas: {
          light: '#F5EFE6',
          dark: '#1C0B0A',
        },
        surface: {
          light: '#FAF8F5',
          dark: '#240E0C',
          elevated: '#2D1310',
          card: '#28110E',
        },
        border: {
          light: '#E2D6C7',
          dark: '#451F1B',
          glow: '#68312B',
        },
        brand: {
          50: '#FAF4F3',
          100: '#F5E3E0',
          200: '#ECC4BD',
          400: '#D86E61',
          500: '#B84E43',
          600: '#9E4238',
          700: '#843932',
        },
        misleading: {
          50: '#fff1f2',
          100: '#ffe4e6',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'input': '12px',
        'card': '16px',
        'section': '24px',
        'pill': '9999px',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.2)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.35), 0 2px 6px -1px rgba(0, 0, 0, 0.2)',
        'luxury': '0 12px 36px -4px rgba(20, 6, 5, 0.5), 0 4px 12px -2px rgba(20, 6, 5, 0.3)',
        'glow-terracotta': '0 0 30px -5px rgba(184, 78, 67, 0.25)',
        'glow-champagne': '0 0 35px -5px rgba(218, 184, 127, 0.2)',
      }
    },
  },
  plugins: [],
}
