/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neonOrange: '#D4AF37', // Premium Luxury Gold for highlights, active links, gradients, glow
        cyberOrange: '#FF4500', // Intense Orange/Red accent for buttons and hover targets
        neonGreen: '#FFFFFF', // Pure white for primary headers/high-contrast text
        darkBg: '#030303', // OLED Deep Black background
        deepSpace: '#050505', // Alternate section background
        cardBg: 'rgba(20, 20, 20, 0.5)', // For cards overlay
        glassBg: 'rgba(255, 255, 255, 0.02)', // Frosted glass container fill
        glassBorder: 'rgba(255, 255, 255, 0.06)', // Fine light borders
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // For modern, clean body text
        cyber: ['Montserrat', 'sans-serif'], // For high-impact bold headings
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(212, 175, 55, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(212, 175, 55, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%) skewX(-15deg)' },
          '100%': { transform: 'translateX(200%) skewX(-15deg)' },
        },
        'ping-slow': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(1.45)', opacity: '0' },
        }
      },
      animation: {
        glow: 'glow 3s ease-in-out infinite',
        float: 'float 8s ease-in-out infinite',
        orbit: 'orbit 30s linear infinite',
        shimmer: 'shimmer 4s ease-in-out infinite',
        'ping-slow': 'ping-slow 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
}
