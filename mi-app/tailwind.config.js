/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        roboto: ['Roboto', 'ui-sans-serif', 'sans-serif'],
      },
      colors: {
        navy: { 900: '#041627', 800: '#0b1c2c' },
        brand: { orange: '#f6ad55' },
      },
    },
  },
  plugins: [],
}
