/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: '#0a0d14',
          900: '#0f141f',
          800: '#182030',
          700: '#232d42',
        },
        warmAmber: {
          50: '#fffbeb',
          100: '#fef3c7',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        warmOrange: {
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
        },
        gold: {
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
        },
        cream: '#faf6f0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'warm-gradient': 'linear-gradient(135deg, #f59e0b 0%, #ea580c 50%, #b45309 100%)',
        'charcoal-gradient': 'radial-gradient(at 0% 0%, rgba(245, 158, 11, 0.15) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(234, 88, 12, 0.15) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(217, 119, 6, 0.12) 0px, transparent 50%)',
      },
    },
  },
  plugins: [],
};
