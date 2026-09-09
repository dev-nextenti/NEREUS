/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nereus: {
          bg: "#030a16",
          dark: "#051124",
          card: "rgba(6, 20, 42, 0.72)",
          cardBorder: "rgba(0, 229, 255, 0.2)",
          cyan: "#00e5ff",
          blue: "#0077ff",
          deepBlue: "#003b8e",
          teal: "#00f0b5",
          amber: "#ffaa00",
          danger: "#ff3355",
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"SF Mono"', '"Consolas"', '"Courier New"', 'monospace'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'cyan-glow': '0 0 20px rgba(0, 229, 255, 0.25)',
        'cyan-intense': '0 0 35px rgba(0, 229, 255, 0.45)',
        'danger-glow': '0 0 25px rgba(255, 51, 85, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
        'spin-reverse-slow': 'spinReverse 25s linear infinite',
      },
      keyframes: {
        spinReverse: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        }
      }
    },
  },
  plugins: [],
}
