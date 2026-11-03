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
          50: '#f4f6fc',
          100: '#e8edf9',
          200: '#d1ddf4',
          300: '#a7bfea',
          400: '#759bdd',
          500: '#4e7acc',
          600: '#2554a8', // Refined regal navy blue
          700: '#1b4188',
          800: '#17366f',
          900: '#152e5a',
          950: '#0c1a34',
        },
        slate: {
          850: '#151f32',
          900: '#0f172a',
          950: '#080d1a',
        },
        saffron: {
          50: '#fffaf0',
          100: '#feeed1',
          500: '#ea8b0d',
          600: '#c86e06',
          700: '#9f5307',
        }
      },
      boxShadow: {
        'premium-xs': '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
        'premium-sm': '0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
        'premium-md': '0 4px 12px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -2px rgba(15, 23, 42, 0.03)',
        'premium-lg': '0 10px 25px -3px rgba(15, 23, 42, 0.08), 0 4px 10px -4px rgba(15, 23, 42, 0.03)',
        'premium-card': '0 0 0 1px rgba(226, 232, 240, 0.8), 0 2px 8px 0 rgba(15, 23, 42, 0.03)',
      }
    },
  },
  plugins: [],
}
