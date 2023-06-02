const colors = require('tailwindcss/colors')
module.exports = {
  important: true,
  content: ['./index.html', './public/**/*.html', './src/**/*.{js,jsx,ts,tsx,vue}'],
  theme: {
    colors: {
      success: colors.lime,
      warning: colors.yellow,
      danger: colors.red,
      gray: colors.gray,
      primary: colors.green,
      white: colors.white,
      black: colors.black,
      green: colors.green,
      emerald: colors.emerald,
      red: colors.red,
    },
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
    extend: {
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
    },
  },
  safelist: [
    { pattern: /bg-(info|success|danger|warning|primary)-(100|200)/ },
    { pattern: /text-(info|success|danger|warning|primary)-(600|700)/ },
  ],
  plugins: [require('@tailwindcss/forms')],
  corePlugins: {
    preflight: true,
  },
}
