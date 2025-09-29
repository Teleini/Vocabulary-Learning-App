/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'cursive'],
      },
      colors: {
        primary: {
          DEFAULT: '#2CE8A2',
          50: '#D7F9EE',
          100: '#C3F6E6',
          200: '#9BF0D5',
          300: '#73EAC4',
          400: '#4BE4B3',
          500: '#2CE8A2',
          600: '#1FD893',
          700: '#18B476',
          800: '#119059',
          900: '#0A6C3C',
        },
        danger: {
          DEFAULT: '#FF4D4D',
          50: '#FFE5E5',
          100: '#FFD1D1',
          200: '#FFA8A8',
          300: '#FF8080',
          400: '#FF6666',
          500: '#FF4D4D',
          600: '#FF1A1A',
          700: '#E60000',
          800: '#B30000',
          900: '#800000',
        },
        background: '#0A0A0A',
        foreground: '#FFFFFF',
        card: '#1A1A1A',
        'card-foreground': '#FFFFFF',
        secondary: '#333333',
        'secondary-foreground': '#FFFFFF',
        muted: '#333333',
        'muted-foreground': '#A3A3A3',
        accent: '#333333',
        'accent-foreground': '#FFFFFF',
        destructive: '#FF4D4D',
        'destructive-foreground': '#FFFFFF',
        border: '#333333',
        input: '#333333',
        ring: '#2CE8A2',
        surface: '#1A1A1A',
      },
      animation: {
        'pixel-flash': 'pixelFlash 0.3s ease-in-out',
        'shake': 'shake 0.5s ease-in-out',
        'combo': 'combo 0.6s ease-out',
      },
      keyframes: {
        pixelFlash: {
          '0%, 100%': { backgroundColor: 'rgba(44, 232, 162, 0)' },
          '50%': { backgroundColor: 'rgba(44, 232, 162, 0.3)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' },
        },
        combo: {
          '0%': { transform: 'scale(1)', opacity: '0' },
          '50%': { transform: 'scale(1.2)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '0' },
        },
      },
      boxShadow: {
        'pixel': '0 0 0 2px #2CE8A2',
        'pixel-danger': '0 0 0 2px #FF4D4D',
      },
    },
  },
  plugins: [],
}