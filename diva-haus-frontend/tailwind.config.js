/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(222 47% 6%)',
        foreground: 'hsl(210 40% 98%)',
        card: 'hsl(222 47% 8%)',
        'card-foreground': 'hsl(210 40% 98%)',
        muted: 'hsl(217 33% 17%)',
        'muted-foreground': 'hsl(215 20% 65%)',
        border: 'hsl(217 33% 20%)',
        gold: 'hsl(43 74% 53%)',
        'gold-light': 'hsl(43 74% 65%)',
        'gold-dark': 'hsl(43 74% 40%)',
        'neon-cyan': 'hsl(185 100% 50%)',
        'neon-pink': 'hsl(330 100% 60%)',
        'neon-purple': 'hsl(280 100% 60%)',
        'glass-bg': 'hsl(222 47% 12%)',
        'glass-border': 'hsl(217 33% 25%)',
      },
      boxShadow: {
        'luxury': '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'luxury-hover': '0 12px 48px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1), 0 0 40px rgba(185, 100%, 50%, 0.1)',
        'neon-gold': '0 4px 15px hsl(43 74% 53% / 0.3), inset 0 1px 0 hsl(43 74% 65% / 0.5)',
        'neon-pink': '0 0 20px hsl(330 100% 60% / 0.3), 0 0 40px hsl(330 100% 60% / 0.15)',
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
      },
    },
  },
  plugins: [],
}