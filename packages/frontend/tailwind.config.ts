/* eslint-disable @typescript-eslint/no-require-imports */
import plugin from 'tailwindcss/plugin'

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './common/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    fontFamily: {
      langfarm: [
        'var(--font-langfarm, -apple-system)',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'Noto Sans',
        'sans-serif',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji',
      ],
      beVietnamPro: [
        'var(--font-be-vietnam-pro, -apple-system)',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'Noto Sans',
        'sans-serif',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji',
      ],
      iCiel_Tungsten: [
        'var(--font-iCiel_Tungsten, -apple-system)',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'Noto Sans',
        'sans-serif',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji',
      ],
    },
    // fontWeight: {
    // thin: "100",
    // extralight: "200",
    // light: "300",
    // normal: "300",
    // medium: "400",
    // semibold: "500",
    // bold: "600",
    // extrabold: "700",
    // black: "800",
    // },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      padding: {
        15: '3.75rem',
      },
      margin: {
        15: '3.75rem',
      },
      spacing: {
        13: '3.25rem',
        15: '3.75rem',
        25: '6.25rem',
      },
      screens: {
        sm: '640px',
        // => @media (min-width: 640px) { ... }

        md: '768px',
        // => @media (min-width: 768px) { ... }

        lg: '1024px',
        // => @media (min-width: 1024px) { ... }

        '1.5lg': '1140px',
        // => @media (min-width: 1140px) { ... }

        xl: '1280px',
        // => @media (min-width: 1280px) { ... }

        '1.5xl': 'calc(1440px)',
        // => @media (min-width: 1440px) { ... }

        '2xl': '1536px',
        // => @media (min-width: 1536px) { ... },

        '2.5xl': '1600px',
        // => @media (min-width: 1640px) { ... },

        '3xl': '1690px',
        // => @media (min-width: 1690px) { ... },

        '3.5xl': 'calc(1760px)',
        // => @media (min-width: 1760px) { ... },

        '4xl': '1920px',
        // => @media (min-width: 1920px) { ... },
      },
      colors: {
        // ui.shadcn.ui
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },

        sidebar: {
          DEFAULT: '#1F1F1F',
          foreground: '#FFFFFF',
          accent: '#373737',
        },

        low: '#EAEAEA',

        primary: {
          DEFAULT: '#388d3d',
          foreground: '#28642b',
          orange: {
            10: '#FFFAF2',
            50: '#FFE9DD',
            100: '#FFD3AA',
            200: '#FAB380',
            300: '#F68342',
            400: '#FF4D00',
            500: '#CC3505',
            600: '#A42D08',
            700: '#822609',
          },
        },
        secondary: {
          DEFAULT: '#F8DF8D',
          foreground: '#616161',
          background: '#F5F5F5',
          forest: {
            100: '#E2FCF3',
            200: '#C5F5E5',
            300: '#80C7BC',
            400: '#54B7A7',
            500: '#3C9D8E',
          },
          lake: {
            100: '#D1F5FE',
            200: '#BBE9F4',
            300: '#A2D9E7',
            400: '#62B4C9',
            500: '#218199',
          },
          strawberry: {
            300: '#E73C3E',
            400: '#D32426',
          },
          persimmon: {
            100: '#FFE6E5',
            200: '#F69E9F',
            300: '#F2827F',
          },
          mango: {
            200: '#FED4C1',
            300: '#FFBE9F',
            400: '#F8A882',
            500: '#DF8D65',
          },
          banana: {
            100: '#FAEFCA',
            200: '#FEECB3',
            300: '#F8DF8D',
            400: '#ECCD67',
            500: '#D8B74B',
          },
          sweetpotato: {
            100: '#F5E2F9',
            200: '#E0BEE5',
            300: '#C7A0CE',
            400: '#BB86C5',
            500: '#9F67A9',
          },
          mushroom: {
            100: '#E2DCD4',
            200: '#CCC3B9',
            300: '#9D958C',
            400: '#887C6F',
            500: '#736657',
          },
          artichoke: {
            100: '#809C92',
            200: '#628478',
            300: '#41695B',
            400: '#2C5446',
            500: '#1A4536',
          },
        },
        neutral: {
          black: '#000000',
          white: '#ffffff',
          grey: {
            600: '#1F1F1F',
            500: '#373737',
            400: '#616161',
            300: '#A7A7A7',
            200: '#DBDBDB',
            100: '#EAEAEA',
            50: '#F5F5F5',
          },
        },
        semantic: {
          info: {
            100: '#AED3FE',
            200: '#6BA6FE',
            300: '#2970FF',
            400: '#175BE4',
            500: '#0E45B5',
          },
          danger: {
            100: '#F17070',
            200: '#E9585A',
            300: '#E73C3E',
            400: '#D32426',
            500: '#B61313',
          },
          success: {
            100: '#D5FCEA',
            200: '#3FCC8A',
            300: '#12B76A',
            400: '#0DA05C',
            500: '#07874B',
          },
          warning: {
            100: '#FFCA85',
            200: '#F9AE56',
            300: '#F79009',
            400: '#D46D0D',
            500: '#B85208',
          },
          error: {
            100: '#FECACA',
          },
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        brown: {
          600: '#732E1D',
          800: '#451C12',
          900: '#35150D',
        },
        green: {
          50: '#EBF4EC',
          100: '#C1DCC3',
          200: '#A3CBA6',
          300: '#7AB37D',
          400: '#60A464',
          500: '#388D3D',
          600: '#338038',
          700: '#28642B',
          900: '#183B1A',
        },
        yellow: {
          50: '#FBFAEB',
          200: '#EEE8A4',
          500: '#E8D94F',
        },
      },
      borderRadius: {
        sm: '0.25rem',
        base: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',

        // lg: "var(--radius)",
        // md: "calc(var(--radius) - 2px)",
        // sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'sticky-column': 'inset 10px 0 8px -8px rgba(5, 5, 5, 0.06);',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      gridTemplateColumns: {
        dynamicGrid: 'repeat(var(--tw-dynamic-grid-column), minmax(0, var(--tw-dynamic-grid-column-width,1fr)))',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    plugin(({ addUtilities }) => {
      addUtilities({
        '.order-unset': {
          order: 'unset',
        },
      })

      addUtilities({
        // ".lf-text-xs": {
        //   "@apply text-xs leading-[1.125rem]": {},
        // },
        // ".lf-text-sm": {
        //   "@apply text-sm leading-5": {},
        // },
        // ".lf-text-base": {
        //   "@apply text-base leading-6": {},
        // },
        // ".lf-text-md": {
        //   "@apply text-lg leading-7": {},
        // },
        // ".lf-text-lg": {
        //   "@apply text-xl leading-[1.875rem]": {},
        // },
        // ".lf-text-xl": {
        //   "@apply text-2xl leading-[1.5rem]": {},
        // },

        '.display-sm': {
          '@apply text-2xl leading-8': {},
        },
        '.display-md': {
          '@apply text-3xl leading-[2.375rem]': {},
        },
        '.display-lg': {
          '@apply text-4xl leading-[2.75rem]': {},
        },
        '.display-xl': {
          '@apply text-5xl leading-[3.75rem]': {},
        },
        '.title-xs': {
          '@apply text-2xl leading-[2rem] font-semibold font-langfarm': {},
        },
        '.title-sm': {
          '@apply text-3xl leading-[2.375rem] font-semibold font-langfarm': {},
        },
        '.title-md': {
          '@apply text-5xl leading-[3.75rem] font-semibold font-langfarm': {},
        },
        '.title-lg': {
          '@apply text-6xl leading-[4.5rem] font-semibold font-langfarm': {},
        },
        '.title-xl': {
          '@apply text-7xl leading-[5.625rem] font-semibold font-langfarm': {},
        },
        '.title-2xl': {
          '@apply text-[5.625rem] leading-[6.75rem] font-semibold font-langfarm': {},
        },
      })

      addUtilities({
        '.transition-smooth': {
          '@apply transition-all duration-300 ease-linear': {},
        },
      })
    }),
  ],
}
