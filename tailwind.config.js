/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fffdf7',
          100: '#fffbf0',
          200: '#fff5d6',
          300: '#ffefbc',
          400: '#ffe899',
          500: '#ffd700',
          600: '#d4af37',
          700: '#b8941f',
          800: '#9c7a0d',
          900: '#6b5409',
        },
        gold: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#d4af37',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        saffron: {
          500: '#ff9933',
          600: '#ff8800',
        },
        indianGreen: {
          500: '#138808',
          600: '#0f6b06',
        },
        indianBlue: {
          500: '#000080',
          600: '#000066',
        }
      },
      animation: {
        'gentle-float': 'gentleFloat 6s ease-in-out infinite',
        'aura-pulse': 'auraPulse 4s ease-in-out infinite',
        'particle-drift': 'particleDrift 8s linear infinite',
      },
      keyframes: {
        gentleFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        auraPulse: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.05)' },
        },
        particleDrift: {
          '0%': { transform: 'translateX(-100px) translateY(100px)' },
          '100%': { transform: 'translateX(100vw) translateY(-100px)' },
        }
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      }
    },
  },
  plugins: [],
};