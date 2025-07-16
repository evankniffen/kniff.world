// src/styles/GlobalStyle.ts
import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;600&display=swap');
  
  *, *::before, *::after { 
    box-sizing: border-box; 
    margin: 0; 
    padding: 0; 
  }
  
  html, body, #root {
    height: 100vh;
    width: 100vw;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background: #000;
    color: #0F0;
    font-family: 'Source Code Pro', monospace;
  }

  /* Scrollbar Styling */
  ::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(0, 30, 0, 0.2);
    border-left: 1px solid rgba(0, 255, 0, 0.1);
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(0, 255, 0, 0.3);
    border: 1px solid rgba(0, 255, 0, 0.4);
    border-radius: 6px;
    transition: all 0.2s ease;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 255, 0, 0.5);
    border-color: rgba(0, 255, 0, 0.7);
  }

  ::-webkit-scrollbar-corner {
    background: rgba(0, 0, 0, 0.5);
  }

  /* Firefox scrollbar */
  * {
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 255, 0, 0.3) rgba(0, 30, 0, 0.2);
  }
  
  a {
    color: #0F0; 
    text-decoration: none;
    transition: color 0.2s ease;
    
    &:hover {
      color: #0F0;
      text-shadow: 0 0 5px rgba(0, 255, 0, 0.7);
    }
  }
`;
