export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['raleway', 'sans-serif']
      },
      colors: {
        primary: '#FCB404',
        secondary: '#2B2B2B',
        tertiary: '#F2F2F2'
      },

      screens: {
        xs: '375px',
        '3xl': '1920px'
      }
    }
  },
  plugins: []
}
