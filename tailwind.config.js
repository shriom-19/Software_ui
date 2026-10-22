/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f5ff',
          100: '#e0ebff',
          200: '#c7d9fe',
          300: '#9fbeff',
          400: '#7099fe',
          500: '#4670f6',
          600: '#254deb',
          700: '#1d3bc8',
          800: '#1a33a1',
          900: '#1b2f7f',
          950: '#111b4e',
        },
        saffron: {
          50: '#fff8eb',
          100: '#feecc8',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        }
      },
    },
  },
  plugins: [],
}
