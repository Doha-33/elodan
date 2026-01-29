import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors from Figma
        brand: {
          DEFAULT: '#8B2E3D',
          50: '#FDF2F4',
          100: '#FCE8EB',
          200: '#F9D1D7',
          300: '#F0A8B4',
          400: '#E57A8E',
          500: '#D44D66',
          600: '#8B2E3D', // Primary
          700: '#7A2635',
          800: '#66202D',
          900: '#551C27',
        },
        // Figma exact colors
        accent: {
          red: '#ED2024',
          dark: '#110C0C',
        },
        surface: {
          gray: '#F5F5F5',
          light: '#E9E7E7',
        },
        // Hero gradient colors
        hero: {
          start: '#F0C8D8',
          mid: '#E8B8D0',
          end: '#F0C8D8',
        },
        // Design tokens - to be updated from Figma specs
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
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
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      fontFamily: {
        sans: ['Inter', 'var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['3rem', { lineHeight: '1.1', fontWeight: '700' }],
        'h1': ['1.875rem', { lineHeight: '1.25', fontWeight: '700' }],
        'h2': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'h3': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['1.25rem', { lineHeight: '1.6' }],
        'section-title': ['1.5rem', { lineHeight: '1.2', fontWeight: '700' }],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #F0C8D8 0%, #E8B8D0 50%, #F0C8D8 100%)',
        'text-accent': 'linear-gradient(280deg, #ED2024 6.7%, #000000 95.6%)',
      },
      spacing: {
        'sidebar': '16rem',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        'xl': '0.75rem',    // 12px
        '2xl': '1rem',      // 16px
        '3xl': '1.5rem',    // 24px
      },
      boxShadow: {
        // Custom shadow tokens - update from Figma
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      },
      screens: {
        // Responsive breakpoints - update to match Figma breakpoints
        xs: '320px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      transitionDuration: {
        DEFAULT: '150ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
export default config

