/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    screens:{
      "sm":"640px",
      "md":"768px",
      "lg":"1024px",
      "lg1":"1060px",
      "lg2":"1140px",
      "xl":"1280px",
      "xl1":"1400px",
      "2xl":"1536px"
    }
  },
  plugins: [],
}

