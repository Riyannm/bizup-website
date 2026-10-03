/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter Tight"', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
      // Colours are CSS variables so a section can flip them: .on-scene turns ink light and paper dark
      // for content sitting over the live 3D scene (see index.css).
      colors: {
        paper: 'rgb(var(--paper) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        cobalt: 'rgb(var(--cobalt) / <alpha-value>)',
      },
    },
  },
  plugins: [],
};
