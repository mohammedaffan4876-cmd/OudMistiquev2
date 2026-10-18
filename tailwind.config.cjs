/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fefdf8',
          100: '#fdf8e9',
          200: '#fbe9bd',
          300: '#f8d788',
          400: '#f4bd45',
          500: '#d4af37',
          600: '#b8942e',
          700: '#927625',
          800: '#6b581c',
          900: '#453b13',
        },
        cream: {
          50: '#fffefc',
          100: '#fffbf5',
          200: '#fff5e5',
          300: '#ffecd9',
          400: '#ffe0ac',
          500: '#ffd58a',
          600: '#e6b86b',
          700: '#b88e4e',
          800: '#8a6635',
          900: '#5c421c',
        }
      },
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Poppins', 'sans-serif'],
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}