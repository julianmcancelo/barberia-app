/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-charcoal': '#222831',
        'brand-grey': '#393E46',
        'brand-gold': '#D4AF37',
        'brand-light': '#EEEEEE',
      },
      fontFamily: {
        'serif-display': ['"EB Garamond"', 'serif'],
        'sans-body': ['"Lato"', 'sans-serif'],
      },
      keyframes: {
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-down': 'fade-in-down 0.8s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.8s ease-out 0.4s forwards',
      }
    },
  },
  plugins: [],
}

