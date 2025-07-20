import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
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
        sans: ['"Space Grotesk"', 'sans-serif'],
        arial: ['Arial', 'sans-serif'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        first: {
          "0%": {
            transform: "translate(0) rotate(0deg)",
          },
          "20%": {
            transform: "translate(-100px, 100px) rotate(-30deg)",
          },
          "40%": {
            transform: "translate(100px, -100px) rotate(30deg)",
          },
          "60%": {
            transform: "translate(-50px, 50px) rotate(-15deg)",
          },
          "80%": {
            transform: "translate(50px, -50px) rotate(15deg)",
          },
          "100%": {
            transform: "translate(0) rotate(0deg)",
          },
        },
        second: {
          "0%": {
            transform: "translate(0) rotate(0deg)",
          },
          "20%": {
            transform: "translate(100px, -100px) rotate(45deg)",
          },
          "40%": {
            transform: "translate(-100px, 100px) rotate(-45deg)",
          },
          "60%": {
            transform: "translate(50px, -50px) rotate(22deg)",
          },
          "80%": {
            transform: "translate(-50px, 50px) rotate(-22deg)",
          },
          "100%": {
            transform: "translate(0) rotate(0deg)",
          },
        },
        third: {
          "0%": {
            transform: "translate(0) rotate(0deg)",
          },
          "20%": {
            transform: "translate(50px, -50px) rotate(-20deg)",
          },
          "40%": {
            transform: "translate(-50px, 50px) rotate(20deg)",
          },
          "60%": {
            transform: "translate(25px, -25px) rotate(-10deg)",
          },
          "80%": {
            transform: "translate(-25px, 25px) rotate(10deg)",
          },
          "100%": {
            transform: "translate(0) rotate(0deg)",
          },
        },
        fourth: {
          "0%": {
            transform: "translate(0) rotate(0deg)",
          },
          "20%": {
            transform: "translate(-150px, 50px) rotate(35deg)",
          },
          "40%": {
            transform: "translate(150px, -50px) rotate(-35deg)",
          },
          "60%": {
            transform: "translate(-75px, 25px) rotate(17deg)",
          },
          "80%": {
            transform: "translate(75px, -25px) rotate(-17deg)",
          },
          "100%": {
            transform: "translate(0) rotate(0deg)",
          },
        },
        fifth: {
          "0%": {
            transform: "translate(0) rotate(0deg)",
          },
          "20%": {
            transform: "translate(120px, 120px) rotate(-50deg)",
          },
          "40%": {
            transform: "translate(-120px, -120px) rotate(50deg)",
          },
          "60%": {
            transform: "translate(60px, 60px) rotate(-25deg)",
          },
          "80%": {
            transform: "translate(-60px, -60px) rotate(25deg)",
          },
          "100%": {
            transform: "translate(0) rotate(0deg)",
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        first: "first 15s ease-in-out infinite",
        second: "second 15s ease-in-out infinite",
        third: "third 15s ease-in-out infinite",
        fourth: "fourth 15s ease-in-out infinite",
        fifth: "fifth 15s ease-in-out infinite",
      },
       backgroundImage: {
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      }
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
