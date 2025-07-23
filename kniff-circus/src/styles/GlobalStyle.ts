// src/styles/GlobalStyle.ts
import { createGlobalStyle } from 'styled-components';
import { StyledDetailBody, StyledDetailModal, TerminalItem } from '../components/TerminalUI';
import { AboutItem } from '../components/About';

export const GlobalStyle = createGlobalStyle`
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

  /* ─── Mobile‑first global overrides ─── */
  @media (max-width: 768px) {
    :root {
      font-size: 14px; /* Base font size for mobile */
    }
    
    html, body {
      overflow-x: hidden;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    
    body { 
      padding: 0;
      min-width: 100%;
      width: 100%;
    }
    
    /* ASCII Art and Terminal Text */
    pre, code, .ascii-art {
      font-size: 0.5rem !important;
      line-height: 1.1 !important;
      white-space: pre-wrap;
      word-wrap: break-word;
      overflow-x: auto;
    }
    
    /* Layout adjustments */
    .AppGrid { 
      display: flex; 
      flex-direction: column;
      width: 100%;
      margin: 0;
    }
    
    .Sidebar { 
      display: none; 
    }
    
    .Main { 
      width: 100% !important; 
      padding: 0.5rem !important;
      margin: 0 !important;
    }
    
    section { 
      padding: 1rem 0.5rem !important; 
      margin: 0 !important;
      width: 100% !important;
      max-width: 100% !important;
    }
    
    /* Typography */
    h1, h2, h3 { 
      font-size: clamp(1.1rem, 5vw, 1.4rem) !important; 
      line-height: 1.2 !important;
      margin: 0.5rem 0 !important;
    }
    
    p, li, .subtitle { 
      font-size: 0.9rem !important; 
      line-height: 1.4 !important; 
      margin: 0.5rem 0 !important;
    }
    
    button, [role="button"] { 
      font-size: 0.9rem !important; 
      padding: 0.6rem 0.8rem !important; 
      min-height: 2.5rem;
    }
    
    /* Properly sized modals on mobile */
    ${StyledDetailModal} {
      position: relative !important;
      top: auto !important;
      left: auto !important;
      right: auto !important;
      bottom: auto !important;
      width: 85vw !important;
      height: auto !important;
      max-height: 80vh !important;
      margin: 2rem auto !important;
      padding: 1rem !important;
      border-radius: 8px !important;
      max-width: 85vw !important;
      box-shadow: 0 0 40px rgba(0, 255, 0, 0.2) !important;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      z-index: 9999 !important;
    }
    
    ${StyledDetailBody} { 
      font-size: 0.9rem !important; 
      line-height: 1.4 !important;
      padding: 0.5rem !important;
    }
    
    /* Better touch targets */
    ${AboutItem}, ${TerminalItem} {
      margin: 0.5rem 0 !important;
      padding: 0.8rem !important;
      min-height: 2.5rem;
    }
    
    /* GitHub button styles */
    .github-button {
      display: inline-flex !important;
      align-items: center;
      padding: 0.8rem 1.5rem !important;
      background: rgba(0, 255, 0, 0.1) !important;
      border: 1px solid rgba(0, 255, 0, 0.3) !important;
      border-radius: 4px;
      color: #0F0 !important;
      text-decoration: none !important;
      font-size: 1rem !important;
      transition: all 0.3s ease !important;
      margin: 0.5rem 0;
      min-height: 44px;
      min-width: 44px;
      justify-content: center;
    }
    
    .github-button:hover {
      background: rgba(0, 255, 0, 0.2) !important;
      transform: translateY(-2px) !important;
      box-shadow: 0 2px 8px rgba(0, 255, 0, 0.2) !important;
    }
    
    .github-icon {
      margin-right: 0.5rem !important;
    }
  }
`;
