import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: "#C20E1A", //Títulos, botones estado HOVER
        secondary: "#E20613", //Llamados de acción, botones, texto seleccionado
        option1: "#d3d8f7", //Fondo secciones
        option2: "#F2F2F2", //Fondo secciones 2
        parrafo: "#585857", //Párrafo, fondo dropdowns en HOVER, tab laterales, encabezados tablas
        azul: "#004884",
      },
      // fontSize: {
      //     xs: ['0.75rem', { lineHeight: '1rem' }], // 12px
      //     sm: ['0.875rem', { lineHeight: '1.25rem' }], // 14px
      //     base: ['1rem', { lineHeight: '1.5rem' }], // 16px
      //     lg: ['1.125rem', { lineHeight: '1.75rem' }], // 18px
      //     xl: ['1.25rem', { lineHeight: '1.75rem' }], // 20px
      //     '2xl': ['1.5rem', { lineHeight: '2rem' }], // 24px
      //     '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
      //     '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
      //     '5xl': ['3rem', { lineHeight: '1' }], // 48px
      //     '6xl': ['3.75rem', { lineHeight: '1' }], // 60px
      //     '7xl': ['4.5rem', { lineHeight: '1' }], // 72px
      //     '8xl': ['6rem', { lineHeight: '1' }], // 96px
      //     '9xl': ['8rem', { lineHeight: '1' }], // 128px
      // },
    },
  },

  
};
