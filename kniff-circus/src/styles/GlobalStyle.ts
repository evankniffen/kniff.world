// src/styles/GlobalStyle.ts
import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  /* Google Fonts */
  @import url('https://fonts.googleapis.com/css2?family=Russo+One&family=Rubik:wght@400;500;700&display=swap');
  /* Reset & base */
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html, body, #root { height:100%; overflow-x:hidden; scroll-behavior:smooth; }
  body {
    font-family: 'Rubik', sans-serif;
    background: #0a001f;
    color: #fff;
  }
  /* Scroll‑snap container */
  .snap-container {
    scroll-snap-type: y mandatory;
    overflow-y: auto;
    height: 100vh;
  }
  /* Each full‑screen section */
  .snap-section {
    scroll-snap-align: start;
    height: 100vh;
    position: relative;
  }
  a { color: inherit; text-decoration: none; }
`;
