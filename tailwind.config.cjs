/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF5F5',
          100: '#FFE5E5',
          200: '#FFCCCC',
          300: '#FF9999',
          400: '#FF4D4D',
          500: '#FF0000', // Base red
          600: '#E60000',
          700: '#CC0000',
          800: '#990000',
          900: '#660000',
        },
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#0A0A0A', // Pure black
        },
        white: '#FFFFFF',
        black: '#0A0A0A',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      backgroundColor: {
        body: '#FFFFFF',
        'body-alt': '#FAFAFA',
      },
      textColor: (theme) => ({
        ...theme('colors'),
        primary: theme('colors.neutral.900'),
        secondary: theme('colors.neutral.600'),
        inverse: theme('colors.white'),
      }),
      borderColor: (theme) => ({
        ...theme('colors'),
        DEFAULT: theme('colors.neutral.200'),
      }),
    },
  },
  plugins: [],
};
