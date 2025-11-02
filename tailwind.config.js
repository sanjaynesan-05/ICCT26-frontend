/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#002B5C',
        secondary: '#0D1B2A',
        accent: '#FFCC29',
        'bg-start': '#001C40',
        'bg-end': '#002B5C',
      },
      fontFamily: {
        heading: ['Bebas Neue', 'sans-serif'],
        subheading: ['Quicksand', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
        bebas: ['Bebas Neue', 'sans-serif'],
        quicksand: ['Quicksand', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'scroll': 'scroll 25s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 204, 41, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 204, 41, 0.8)' },
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #001C40 0%, #002B5C 100%)',
        'gradient-gold': 'linear-gradient(135deg, #FFCC29 0%, #FFB700 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      },
    },
  },
  plugins: [],
}
