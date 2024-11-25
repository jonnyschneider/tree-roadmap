const { Satellite } = require("lucide-react")

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        salt: '#fff8ef',
        forest: '#001a13',
        emerald: '#41BB88',
        pine: '#224b3b',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
