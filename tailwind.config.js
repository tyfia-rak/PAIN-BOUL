const { heroui } = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
    "./styles/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        inter: ['Inter', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        serif: ['Playfair Display', 'ui-serif', 'Georgia'],
      },
      colors: {
        golden: {
          DEFAULT: 'hsl(45, 85%, 65%)',
          dark: 'hsl(35, 75%, 45%)'
        },
        'warm-gray': 'hsl(24, 12%, 18%)',
        charcoal: 'hsl(210, 15%, 12%)',
        cream: 'hsl(45, 30%, 92%)',
        background: 'hsl(210, 15%, 12%)',
        foreground: 'hsl(45, 30%, 92%)',
        card: 'hsl(210, 15%, 14%)',
        'card-foreground': 'hsl(45, 30%, 92%)',
        muted: 'hsl(220, 10%, 30%)',
        'muted-foreground': 'hsl(45, 20%, 70%)',
        accent: 'hsl(35, 75%, 45%)',
        'accent-foreground': 'hsl(45, 30%, 92%)',
        destructive: 'hsl(0, 62%, 30%)',
        'destructive-foreground': 'hsl(45, 30%, 92%)',
        border: 'hsl(215, 10%, 24%)',
        input: 'hsl(215, 10%, 24%)',
        'golden-10': 'hsla(45, 85%, 65%, 0.10)',
        'golden-20': 'hsla(45, 85%, 65%, 0.20)',
      },
      backgroundImage: {
        'gradient-golden': 'linear-gradient(135deg, hsl(45, 85%, 65%), hsl(35, 75%, 45%))',
        'gradient-dark': 'linear-gradient(135deg, hsl(210, 15%, 15%), hsl(20, 15%, 20%))',
      },
      boxShadow: {
        'golden': '0 10px 30px -5px hsla(45, 85%, 65%, 0.3)',
        'card': '0 4px 20px -2px hsla(210, 15%, 15%, 0.1)',
      }
    }
  },
  darkMode: "class",
  plugins: [heroui()]
}