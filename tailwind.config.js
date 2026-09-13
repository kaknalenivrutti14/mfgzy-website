/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        // Surfaces — near-black navy, five steps of elevation.
        ink: {
          950: '#06080C',
          900: '#0A0D13',
          850: '#0E131A',
          800: '#131923',
          750: '#19212D',
          700: '#212B39',
          600: '#2D3A4B',
        },
        // Neutral text/hairlines.
        steel: {
          50: '#F6F8FB',
          100: '#E8EDF4',
          200: '#CFD8E5',
          300: '#A7B4C6',
          400: '#7C8BA1',
          500: '#5C6B80',
          600: '#44515F',
        },
        // Accent — used sparingly: primary actions, active nodes, focus.
        accent: {
          50: '#EAF2FF',
          200: '#B9D2FF',
          400: '#6EA3FF',
          500: '#4C8DFF',
          600: '#2E6FE8',
          700: '#1E51B4',
        },
        signal: '#22D3EE',
        ok: '#34D399',
        warn: '#FBBF24',
        crit: '#F87171',
        info: '#60A5FA',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        xxs: ['0.6875rem', { lineHeight: '1rem' }],
      },
      letterSpacing: {
        tightest: '-0.045em',
      },
      maxWidth: {
        shell: '80rem',
      },
      boxShadow: {
        panel: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 24px 60px -24px rgba(0,0,0,0.8)',
        lift: '0 32px 70px -28px rgba(0,0,0,0.85)',
        glow: '0 0 0 1px rgba(76,141,255,0.28), 0 20px 60px -22px rgba(76,141,255,0.45)',
      },
      backgroundImage: {
        'grid-fine':
          'linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-fine': '44px 44px',
      },
      keyframes: {
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.45', transform: 'scale(0.82)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(220%)' },
        },
        'float-y': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-7px)' },
        },
        'dash-flow': {
          to: { strokeDashoffset: '-24' },
        },
      },
      animation: {
        'pulse-dot': 'pulse-dot 2.1s ease-in-out infinite',
        shimmer: 'shimmer 2.6s ease-in-out infinite',
        'float-y': 'float-y 7s ease-in-out infinite',
        'dash-flow': 'dash-flow 1.1s linear infinite',
      },
    },
  },
  plugins: [],
}
