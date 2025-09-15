import React, { useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import ReactDOM from 'react-dom';

export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const terminalGlow = keyframes`
  0% { box-shadow: 0 0 5px rgba(0, 255, 0, 0.2); }
  50% { box-shadow: 0 0 20px rgba(0, 255, 0, 0.4); }
  100% { box-shadow: 0 0 5px rgba(0, 255, 0, 0.2); }
`;

const modalBaseStyles = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100dvh;
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  -webkit-tap-highlight-color: transparent;

  @supports (padding: max(0px)) {
    padding: max(1rem, env(safe-area-inset-top)) 
             max(1rem, env(safe-area-inset-right)) 
             max(1rem, env(safe-area-inset-bottom)) 
             max(1rem, env(safe-area-inset-left));
  }
`;

export const ModalBackdrop = styled(motion.div)`
  ${modalBaseStyles}
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  pointer-events: auto;
  z-index: 10000;
`;

export const StyledDetailModal = styled(motion.div)`
  position: relative;
  width: 100%;
  overflow-y: auto;
  max-height: 90dvh;
  display: flex;
  flex-direction: column;
  max-width: 820px;
  height: auto;
  max-height: 90dvh;
  background: rgba(10, 22, 10, 0.98);
  border: 1px solid rgba(0, 255, 0, 0.5);
  border-radius: 10px;
  padding: 1.75rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35), 0 0 24px rgba(0, 255, 0, 0.18);
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  pointer-events: auto;
  animation: ${terminalGlow} 3s infinite;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  margin: auto;
  transform-origin: center center;
  will-change: transform, opacity;
  z-index: 10001;

  @media (max-width: 768px) {
    overflow: hidden; /* delegate scrolling to body on mobile */
    max-width: calc(100% - 2rem);
    max-height: 88dvh;
    padding: 1.25rem;
    margin: 0.75rem;
    width: 100%;
  }

  &:focus {
    outline: 2px solid #0F0;
    outline-offset: 2px;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  color: #0F0;
  font-size: 1.8rem;
  cursor: pointer;
  padding: 0.5rem;
  line-height: 1;
  border-radius: 4px;
  transition: all 0.2s ease;
  z-index: 10;
  
  &:hover, &:focus {
    color: #fff;
    background: rgba(0, 255, 0, 0.1);
    outline: none;
    box-shadow: 0 0 0 2px #0F0;
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
    padding: 1rem;
  }
`;

// Create a dedicated div for modals if it doesn't exist
const createModalRoot = () => {
  const modalRoot = document.createElement('div');
  modalRoot.id = 'modal-root';
  Object.assign(modalRoot.style, {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    display: 'none',
    zIndex: 200000,
  });
  document.body.appendChild(modalRoot);
  return modalRoot;
};

// Modal Portal Component
export const ModalPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const el = useRef<HTMLDivElement | null>(null);
  const modalRoot = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Create or get modal root
    modalRoot.current = document.getElementById('modal-root') || createModalRoot();
    
    // Create portal container
    el.current = document.createElement('div');
    el.current.style.cssText = 'position: relative; z-index: 10001; pointer-events: auto;';
    modalRoot.current.appendChild(el.current);
    if (modalRoot.current) {
      modalRoot.current.style.display = 'block';
      modalRoot.current.style.pointerEvents = 'auto';
    }
    
    // ✅ Lock scroll and bounce on open
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none'; // ⬅ prevent iOS bounce/scroll chaining
  
    return () => {
      // ✅ Clean up on unmount
      if (modalRoot.current && el.current) modalRoot.current.removeChild(el.current);
      // Hide modal root if no children
      if (modalRoot.current && modalRoot.current.childElementCount === 0) {
        modalRoot.current.style.display = 'none';
        modalRoot.current.style.pointerEvents = 'none';
      }
      document.body.style.overflow = '';
      document.body.style.overscrollBehavior = ''; // ⬅ reset overscroll
    };
  }, []);

  return el.current ? ReactDOM.createPortal(children, el.current) : null;
};

// Modal Component
export const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}> = ({ isOpen, onClose, children, title }) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <ModalPortal>
      <AnimatePresence>
        <ModalBackdrop
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <StyledDetailModal
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              y: 0,
              transition: { 
                type: "spring",
                damping: 25,
                stiffness: 300
              }
            }}
            exit={{ 
              scale: 0.95, 
              opacity: 0,
              y: 20,
              transition: { duration: 0.15 }
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton 
              onClick={onClose}
              aria-label="Close modal"
            >
              &times;
            </CloseButton>
            
            {title && (
              <h2 id="modal-title" style={{ marginTop: 0, color: '#0F0' }}>
                {title}
              </h2>
            )}
            
            {children}
          </StyledDetailModal>
        </ModalBackdrop>
      </AnimatePresence>
    </ModalPortal>
  );
};

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
  z-index: 2; /* Above the modal content */
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
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
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  touch-action: pan-y;
  flex: 1 1 auto;
  min-height: 0;
  max-height: 100%;
  line-height: 1.75;
  font-size: 1rem;
  h3 {
    color: #0F0;
    margin: 1.5rem 0 0.5rem;
    font-size: 1.35rem;
  }
  
  .subtitle {
    color: #aaa;
    margin-bottom: 0.75rem;
    font-size: 1rem;
  }
  
  ul {
    margin-left: 1.2rem;
    padding-left: 0.8rem;
    list-style: disc;
  }
  
  li {
    margin: 0.35rem 0;
  }
  
  p {
    margin: 0.4rem 0 0.7rem;
  }
  
  code, pre {
    background: rgba(0, 255, 0, 0.08);
    border: 1px solid rgba(0, 255, 0, 0.2);
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
  padding: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 4px;
  background: rgba(0, 30, 0, 0.1);
  border-left: 2px solid transparent;
  animation: ${fadeIn} 0.5s ease-out forwards;
  opacity: 0;
  position: relative;
  z-index: 1; /* keep above incidental overlays */
  pointer-events: auto;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  
  @media (max-width: 768px) {
    padding: 1rem;
    margin: 0.8rem 0;
    
    .title {
      font-size: 1.1rem;
      margin-bottom: 0.3rem;
    }
    
    .subtitle, .description {
      font-size: 0.9rem;
      line-height: 1.5;
    }
  }
  
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
