import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Card stock colors - The Ken Sugimori painted paper feel
        card: {
          white: '#F8F5F0',
          cream: '#FFF8E7',
          grey: '#E8E4DC',
          texture: '#D8D4CC',
        },
        // Gold border - Classic Pokemon card frame
        gold: {
          DEFAULT: '#D4A017',
          light: '#E8C547',
          dark: '#B8860B',
        },
        // Seeker blue - Our brand color
        seeker: {
          DEFAULT: '#5B9BD5',
          light: '#7CB3E8',
          dark: '#4080C0',
        },
        // Pokemon energy type colors
        pokemon: {
          fire: '#F08030',
          water: '#6890F0',
          grass: '#78C850',
          electric: '#F8D030',
          psychic: '#F85888',
          fighting: '#C03028',
          dark: '#705848',
          steel: '#B8B8D0',
          fairy: '#EE99AC',
          dragon: '#7038F8',
          colorless: '#A8A878',
          normal: '#A8A090',
        },
        // Status colors
        success: '#78C850',
        warning: '#F8D030',
        error: '#C03028',
        info: '#6890F0',
      },
      fontFamily: {
        display: ["'Gill Sans'", "'Gill Sans MT'", 'var(--font-display)', 'Futura', 'Trebuchet MS', 'sans-serif'],
        body: ['var(--font-body)', 'Nunito', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        card: '12px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
        'card-hover':
          '0 20px 40px rgba(0, 0, 0, 0.15), 0 0 60px rgba(212, 160, 23, 0.2)',
        gold: '0 0 0 1px #B8860B, 0 4px 24px rgba(0, 0, 0, 0.1)',
        glass:
          '0 4px 24px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
      },
      backgroundImage: {
        'paper-grain': "url('/textures/paper-grain.png')",
        'gold-gradient':
          'linear-gradient(180deg, #E8C547 0%, #D4A017 100%)',
        'seeker-gradient':
          'linear-gradient(180deg, #7CB3E8 0%, #5B9BD5 100%)',
      },
      animation: {
        'seeker-wiggle': 'seeker-wiggle 0.5s ease-in-out',
        shimmer: 'shimmer 1.5s infinite',
        watercolor: 'watercolor-drift 20s ease-in-out infinite',
        'holo-shimmer': 'holo-shimmer 1.5s ease infinite',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
      },
      keyframes: {
        'seeker-wiggle': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-5deg)' },
          '75%': { transform: 'rotate(5deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'watercolor-drift': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '33%': { transform: 'translate(2%, 1%) rotate(1deg)' },
          '66%': { transform: 'translate(-1%, 2%) rotate(-1deg)' },
        },
        'holo-shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
      },
    },
  },
  plugins: [],
};

export default config;
