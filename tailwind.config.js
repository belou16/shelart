/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#000000',
        abyss: '#1a1a1a',
        card: 'rgba(15, 15, 15, 0.2)',
        pearl: '#f5f5f7',
        gold: '#ffd60a',
        'gold-hover': '#ffeb3b'
      },
      maxWidth: {
        '8xl': '90rem'
      },
      boxShadow: {
        glow: '0 0 32px rgba(255, 214, 10, 0.10)'
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.65s ease-out both'
      }
    }
  },
  plugins: []
};
