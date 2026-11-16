/** @type {import('tailwindcss').Config} */

/**
 * ICCT'27 design tokens — "Matchday"
 *
 *  ink    deep navy backgrounds
 *  gold   brand / primary action (one gold thing per area)
 *  flame  energy colour: LIVE, deadlines, small highlights
 *  pitch  success / confirmed
 *  surface light sections
 *
 * Legacy names (primary, secondary, accent, bg-start, bg-end) are kept and
 * mapped onto the new palette so existing pages inherit the new look.
 */
const ink = {
  DEFAULT: '#0A1F44',
  950: '#040D1F',
  900: '#06142E',
  800: '#0A1F44',
  700: '#12305F',
  600: '#1C427D',
}

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '360px',
      },
      colors: {
        ink,
        gold: {
          DEFAULT: '#FFC21A',
          light: '#FFD45C',
          dark: '#E5A800',
        },
        flame: {
          DEFAULT: '#E63946',
          light: '#FF5A66',
          dark: '#C1121F',
        },
        pitch: {
          DEFAULT: '#1FA463',
          light: '#34C77B',
          dark: '#168550',
        },
        surface: {
          DEFAULT: '#F4F6FA',
          card: '#FFFFFF',
          line: '#E3E8F0',
        },
        muted: {
          DEFAULT: '#C9D3E6', // secondary text on dark
          dark: '#5A6785', // secondary text on light
        },

        // Legacy aliases → new palette
        primary: ink.DEFAULT,
        secondary: ink[900],
        accent: '#FFC21A',
        'bg-start': ink[900],
        'bg-end': ink.DEFAULT,
      },
      fontFamily: {
        heading: ['Bebas Neue', 'Impact', 'Arial Narrow', 'sans-serif'],
        display: ['Bebas Neue', 'Impact', 'Arial Narrow', 'sans-serif'],
        // Quicksand retired — subheading now uses the body family for a cleaner, pro look
        subheading: ['Manrope', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
        body: ['Manrope', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
        bebas: ['Bebas Neue', 'Impact', 'Arial Narrow', 'sans-serif'],
        manrope: ['Manrope', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
        quicksand: ['Manrope', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        eyebrow: ['0.8125rem', { lineHeight: '1.2', letterSpacing: '0.14em', fontWeight: '700' }],
      },
      borderRadius: {
        card: '1rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(4,13,31,0.06), 0 8px 24px rgba(4,13,31,0.08)',
        'card-dark': '0 1px 0 rgba(255,255,255,0.04) inset, 0 12px 32px rgba(0,0,0,0.25)',
        nav: '0 1px 0 rgba(255,255,255,0.06), 0 8px 24px rgba(0,0,0,0.25)',
      },
      animation: {
        // Kept for existing pages; avoid adding new infinite animations
        float: 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        scroll: 'scroll 25s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'live-dot': 'live-dot 1.6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'live-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.35', transform: 'scale(0.8)' },
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(180deg, #06142E 0%, #0A1F44 100%)',
        'gradient-gold': 'linear-gradient(180deg, #FFC21A 0%, #FFC21A 100%)',
        'gradient-glass': 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.03) 100%)',
        'hero-fade': 'linear-gradient(180deg, rgba(4,13,31,0.55) 0%, rgba(6,20,46,0.85) 60%, #06142E 100%)',
        stripes: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.025) 0 2px, transparent 2px 14px)',
      },
    },
  },
  plugins: [],
}
