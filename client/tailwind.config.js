/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
      },
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "oklch(var(--primary-lch) / <alpha-value>)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "oklch(var(--accent-lch) / <alpha-value>)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        // Luxury palette
        gold: {
          DEFAULT: "oklch(var(--gold-lch) / <alpha-value>)",
          light: "var(--gold-light)",
          dark: "var(--gold-dark)",
        },
        neon: {
          cyan: "oklch(var(--neon-cyan-lch) / <alpha-value>)",
          pink: "oklch(var(--neon-pink-lch) / <alpha-value>)",
          purple: "var(--neon-purple)",
        },
        navy: {
          deep: "oklch(var(--navy-deep-lch) / <alpha-value>)",
          mid: "var(--navy-mid)",
          light: "var(--navy-light)",
        },
        glass: {
          bg: "var(--glass-bg)",
          border: "var(--glass-border)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        'neon-cyan': '0 0 20px oklch(var(--neon-cyan-lch) / 0.3), 0 0 40px oklch(var(--neon-cyan-lch) / 0.15)',
        'neon-pink': '0 0 20px oklch(var(--neon-pink-lch) / 0.3), 0 0 40px oklch(var(--neon-pink-lch) / 0.15)',
        'neon-gold': '0 0 20px oklch(var(--gold-lch) / 0.3), 0 0 40px oklch(var(--gold-lch) / 0.15)',
        'luxury': '0 25px 50px -12px rgba(0,0,0,0.5)',
        'luxury-hover': '0 35px 60px -15px rgba(0,0,0,0.6)',
      },
      backgroundImage: {
        'gradient-luxury': 'linear-gradient(135deg, var(--navy-mid) 0%, var(--navy-deep) 100%)',
        'gradient-neon': 'linear-gradient(135deg, oklch(var(--neon-cyan-lch) / 0.15) 0%, oklch(var(--neon-pink-lch) / 0.15) 100%)',
        'gradient-gold': 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)',
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px oklch(var(--gold-lch) / 0.3)" },
          "50%": { boxShadow: "0 0 40px oklch(var(--gold-lch) / 0.5)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "shimmer": "shimmer 3s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "spin-slow": "spin-slow 3s linear infinite",
      },
    },
  },
  plugins: [],
}