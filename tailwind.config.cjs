const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class', // Enables dark mode based on the class added to the HTML element
  theme: {
    extend: {
      backgroundImage: {
        'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))'
      },
      keyframes: {
        disco: {
          '0%': { transform: 'translateY(-50%) rotate(0deg)' },
          '100%': { transform: 'translateY(-50%) rotate(360deg)' }
        }
      },
      animation: {
        disco: 'disco 1s linear infinite'
      },
    
    }
  },
  daisyui: {
    themes: [
      {
        'mytheme-dark': {
          primary: '#1c1e20',
          secondary: '#1c1e20',
          accent: '#1c1e20',
          neutral: '#2b2f38',
          'base-100': '#1c1e20',
          info: '#2b2f38',
          success: '#FFFFFF',
          warning: '#FFFFFF',
          error: '#FFFFFF'
        }
      }
    ]
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')]
};
