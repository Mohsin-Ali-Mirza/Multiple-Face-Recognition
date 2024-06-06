/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
   // or 'media' or 'class'
  theme: {
    extend: {backgroundColor: {
      'cyan-cornflower-blue': '#2596be',
      'bahama-blue':'#006093',
      'cerulean':'#6acaf4',
      'malibu':'#6ACAF4',
      'elorous':'#2296BE',
      'venetian-red':'#000831'
    },
    animation: {
      gradient: 'gradient 5s linear infinite',
    },
    keyframes: {
      pop: {
        '0%': {
          transform: 'scale(0)',
          opacity: 0,
        },
        '50%': {
          transform: 'scale(1.2)',
          opacity: 1,
        },
        '100%': {
          transform: 'scale(1)',
          opacity: 1,
        },
 
    },
  },

    
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}