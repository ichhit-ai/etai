/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        industrial: {
          bg: '#0f172a',
          card: '#1e293b',
          border: '#334155',
          brand: '#3b82f6',
          warning: '#f59e0b',
          danger: '#ef4444',
          safe: '#10b981'
        }
      }
    },
  },
  plugins: [],
}

