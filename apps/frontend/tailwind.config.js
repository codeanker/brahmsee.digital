const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  important: true,
  content: [
    './index.html',
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
    '../packages/**/*.{js,jsx,ts,tsx,vue}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '540px',
        md: '720px',
        lg: '960px',
        xl: '1140px',
      },
    },
    fontFamily: {
      sans: [
        '"Inter var", sans-serif',
        {
          fontFeatureSettings: '"calt", "ss01", "ss02", "dlig"',
        },
      ],
    },
    extend: {
      colors: {
        success: colors.lime,
        warning: colors.yellow,
        danger: colors.red,
        primary: colors.green,
        secondary: colors.green,
        muted: colors.gray,
        gray: colors.slate,
        white: colors.white,
        black: colors.black,
        dark: {
          primary: colors.gray[950],
          secondary: colors.gray[900],
        },
      },
      zIndex: {
        '-1': '-1',
        dropdown: '1000',
        sticky: '1020',
        fixed: '1030',
        'modal-backdrop': '1040',
        modal: '1050',
        popover: '1060',
        tooltip: '1070',
      },
      borderColor: {
        transparent: 'transparent',
      },
      backgroundImage: {
        public: "url('/src/assets/images/publicBg.webp')",
      },
      gridTemplateColumns: {
        switch: 'min-content minmax(0, 1fr)',
      },
      boxShadow: {
        hover: '0px 0px 12px 0px rgba(0,0,0,0.06);',
      },
    },
  },
  safelist: [
    { pattern: /bg-(info|success|danger|warning|primary|secondary|muted)-(100|200|600)/ },
    { pattern: /text-(info|success|danger|warning|primary|muted)-(600|700)/ },
    { pattern: /bg-white/ },
    { pattern: /(w|h)-(6|12|24)/ },
    { pattern: /max-w-(lg|xl|2xl)/ },
  ],
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
  corePlugins: {
    preflight: true,
  },
}
