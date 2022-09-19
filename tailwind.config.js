module.exports = {
  mode: 'jit', // Just-In-Time Compiler
  purge: ['./src/**/*.html'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        darkGray: '#333A44',
        passiveGray: '#757D8A',
        anotherGray: '#9A9DA2',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
