/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui')
  ],
  daisyui: {
    themes: [
      {
        omnii: {
          primary: "#ff4136",
          secondary: "#ffffff",
          accent: "#ff4136",
          neutral: "#1a1a1a",
          "base-100": "#000000",
          "base-200": "#1a1a1a",
          "base-300": "#2a2a2a",
          "base-content": "#ffffff",
          info: "#ff4136",
          success: "#ff4136",
          warning: "#ff4136",
          error: "#ff4136",
        },
      },
    ],
  },
}
