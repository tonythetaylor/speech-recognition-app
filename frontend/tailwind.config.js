/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      animation: {
        'bubble': 'bubble-grow-burst 1.5s ease-in-out forwards',
      },
      keyframes: {
        'bubble-grow-burst': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.2)', opacity: '1' },
          '80%': { transform: 'scale(1.5)', opacity: '0.8' },
          '100%': { transform: 'scale(0)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}

