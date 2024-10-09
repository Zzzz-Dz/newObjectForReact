/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  corePlugins: {
    aspectRatio: false,
  },
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
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'base', // only generate global styles
      strategy: 'class', // only generate classes
    }),
    require('@tailwindcss/container-queries'),
    require('@tailwindcss/aspect-ratio'),
  ],
}

