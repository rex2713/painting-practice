/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        main: "#2F89FC",
        title: "#2DABD1",
        black: "#6B7280",
        error: "#EF4444",
      },
    },
  },
  plugins: [],
};
