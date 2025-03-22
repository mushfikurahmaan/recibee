/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: '#FF9500',    // Vibrant Orange
        secondary: '#2C5E2E',   // Earthy Green
        cream: '#FFF6E5',       // Soft Cream
        dark: '#1A1A1A',        // Dark Text
        light: '#FFFFFF',       // Pure White
        gray: '#F5F5F5',        // Light Gray
        accent: '#FFD166',      // Warm Yellow
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-fresh': 'linear-gradient(to right bottom, #FFFFFF, #FFF6E5)',
      }
    }
  },
  plugins: [],
} 