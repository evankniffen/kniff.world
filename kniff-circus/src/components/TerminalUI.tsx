import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const terminalGlow = keyframes`
  0% { box-shadow: 0 0 5px rgba(0, 255, 0, 0.2); }
  50% { box-shadow: 0 0 20px rgba(0, 255, 0, 0.4); }
  100% { box-shadow: 0 0 5px rgba(0, 255, 0, 0.2); }
`;

export const ModalBackdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

export const StyledDetailModal = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  background: rgba(10, 25, 10, 0.98);
  border: 1px solid #0F0;
  border-radius: 8px;
  padding: 2.5rem;
  box-shadow: 0 0 40px rgba(0, 255, 0, 0.2);
  overflow-y: auto;
  animation: ${terminalGlow} 3s infinite;
  backdrop-filter: blur(5px);
  -webkit-overflow-scrolling: touch;
  
  @media (max-width: 768px) {
    padding: 1.2rem;
    max-height: 90vh;
    margin: 1rem;
    width: calc(100% - 2rem);
    box-sizing: border-box;
    
    button, [role="button"] {
      min-height: 48px;
      min-width: 48px;
    }
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: #0F0;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 1rem;
  margin: -1rem;
  line-height: 1;
  position: relative;
  z-index: 2;
  
  &:hover {
    color: #fff;
    text-shadow: 0 0 5px #0F0;
  }
  
  @media (max-width: 768px) {
    padding: 1.2rem;
    margin: -1.2rem;
    font-size: 1.8rem;
  }
`;

export const StyledDetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: -2.5rem -2.5rem 1.5rem;
  padding: 1rem 1.5rem;
  background: rgba(0, 30, 0, 0.3);
  border-bottom: 1px solid rgba(0, 255, 0, 0.2);
  position: sticky;
  top: 0;
  z-index: 10;
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #0F0, transparent);
  }
  
  @media (max-width: 768px) {
    margin: -1.2rem -1.2rem 1.5rem;
    padding: 0.8rem 1.2rem;
  }
`;

export const StyledDetailBody = styled.div`
  line-height: 1.8;
  font-size: 1.05rem;
  
  h3 {
    color: #0F0;
    margin: 1.5rem 0 0.5rem;
    font-size: 1.5rem;
    font-weight: 500;
    text-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
    position: relative;
    display: inline-block;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 50px;
      height: 2px;
      background: #0F0;
    }
  }
  
  .subtitle {
    color: #bbb;
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    font-style: italic;
  }
  
  p {
    margin: 1.2rem 0;
    color: #ddd;
    line-height: 1.7;
  }
  
  code {
    background: rgba(0, 50, 0, 0.3);
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: 'Source Code Pro', monospace;
    font-size: 0.9em;
    color: #0F0;
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.7;
    
    h3 {
      font-size: 1.4rem;
      margin: 1rem 0 0.8rem;
    }
    
    .subtitle {
      font-size: 1rem;
      margin-bottom: 1.2rem;
    }
  }
`;

export const TerminalItem = styled.li`
  margin: 1rem 0;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 4px;
  background: rgba(0, 30, 0, 0.1);
  border-left: 2px solid transparent;
  animation: ${fadeIn} 0.5s ease-out forwards;
  opacity: 0;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: rgba(0, 50, 0, 0.2);
    border-left: 2px solid #0F0;
    transform: translateX(5px);
    box-shadow: 0 5px 15px rgba(0, 255, 0, 0.1);
    
    .title {
      color: #0F0;
      text-shadow: 0 0 8px rgba(0, 255, 0, 0.5);
    }
    
    .description {
      opacity: 1;
      max-height: 100px;
    }
  }
  
  .command {
    color: #0F0;
    font-family: 'Source Code Pro', monospace;
    margin-bottom: 0.5rem;
    display: block;
    white-space: pre;
  }
  
  .title {
    font-size: 1.1rem;
    color: #fff;
    margin: 0.3rem 0;
    transition: all 0.3s ease;
    font-weight: 500;
  }
  
  .subtitle {
    color: #aaa;
    font-size: 0.9rem;
    margin: 0.2rem 0;
  }
  
  .description {
    color: #888;
    font-size: 0.85rem;
    margin-top: 0.5rem;
    line-height: 1.5;
    max-height: 0;
    overflow: hidden;
    transition: all 0.5s ease;
    opacity: 0;
  }
  
  // Staggered animation
  &:nth-child(1) { animation-delay: 0.1s; }
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.3s; }

  // Mobile-specific styles
  @media (max-width: 768px) {
    padding: 1.2rem 1rem;
    margin: 0.8rem 0;
    border-radius: 8px;
    
    // Make entire item tappable
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
    }
    
    // Show description by default on mobile
    .description {
      max-height: 500px !important;
      opacity: 1 !important;
      margin-top: 0.8rem;
      font-size: 0.9rem;
      color: #999;
    }
    
    // Adjust title and subtitle for better mobile viewing
    .title {
      font-size: 1.15rem;
      margin: 0.4rem 0 0.3rem;
    }
    
    .subtitle {
      font-size: 0.9rem;
      margin: 0.2rem 0 0.5rem;
    }
    
    // Add touch feedback
    &:active {
      background: rgba(0, 50, 0, 0.3);
      transform: scale(0.98);
    }
    touch-action: manipulation;
  }
`;

// GitHub button styles
export const GitHubButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.5rem 1rem;
  margin: 1.2rem 0 0.5rem;
  background: rgba(15, 30, 15, 0.3);
  border: 1px solid rgba(0, 255, 0, 0.4);
  border-radius: 4px;
  color: #0F0;
  font-family: 'Source Code Pro', monospace;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(0, 255, 0, 0.1), transparent);
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  .github-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }
  
  .github-text {
    position: relative;
    letter-spacing: 0.3px;
    text-decoration: underline;
    text-underline-offset: 0.2em;
    text-decoration-thickness: 1px;
    text-decoration-color: rgba(0, 255, 0, 0.7);
    transition: all 0.2s ease;
  }
  
  &:hover {
    background: rgba(25, 50, 25, 0.4);
    border-color: rgba(0, 255, 0, 0.7);
    color: #fff;
    text-shadow: 0 0 10px rgba(0, 255, 0, 0.8);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 0 8px rgba(0, 255, 0, 0.1);
    
    &::before {
      opacity: 1;
    }
    
    .github-icon {
      transform: scale(1.1);
    }
    
    .github-text {
      text-decoration-color: #0F0;
      text-underline-offset: 0.25em;
    }
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: none;
  }
  
  &:focus-visible {
    outline: 2px solid rgba(0, 255, 0, 0.6);
    outline-offset: 2px;
  }
`;
