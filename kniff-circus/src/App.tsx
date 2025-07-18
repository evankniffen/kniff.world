// src/App.tsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { GlobalStyle } from './styles/GlobalStyle';
import { BinaryRain } from './components/BinaryRain';
import { Sidebar, Hero, About, Projects, Contact } from './components';
import Experience from './components/Experience';
import Research from './components/Research';

const App: React.FC = () => {
  const [initialAnimationComplete, setInitialAnimationComplete] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const animationTriggered = useRef(false);
  const appRef = useRef<HTMLDivElement>(null);
  
  // Check if mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMenuOpen(false);
      }
    };

    // Initial check
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  const handleAnimationComplete = useCallback(() => {
    if (!initialAnimationComplete) {
      setInitialAnimationComplete(true);
    }
  }, [initialAnimationComplete]);

  // Handle click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (appRef.current && !appRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  // Only trigger the initial animation once when the component mounts
  const shouldShowInitialAnimation = !initialAnimationComplete && !animationTriggered.current;
  if (shouldShowInitialAnimation) {
    animationTriggered.current = true;
  }

  const toggleMenu = useCallback((isOpen: boolean) => {
    setIsMenuOpen(isOpen);
  }, []);

  return (
    <>
      <GlobalStyle />
      <BinaryRain 
        key={shouldShowInitialAnimation ? 'initial' : 'background'}
        onAnimationComplete={handleAnimationComplete} 
        isInitialAnimation={shouldShowInitialAnimation}
      />
      <AppContainer 
        ref={appRef}
        $visible={true} 
        $isMenuOpen={isMobile && isMenuOpen}
      >
        <Sidebar onMenuToggle={toggleMenu} isMenuOpen={isMenuOpen} />
        <Main>
          <Section id="hero"><Hero /></Section>
          <Section id="about"><About /></Section>
          <Section id="experience"><Experience /></Section>
          <Section id="projects"><Projects/></Section>
          <Section id="research"><Research /></Section>
          <Section id="contact"><Contact/></Section>
        </Main>
      </AppContainer>
    </>
  );
};

const AppContainer = styled.div<{ $visible: boolean; $isMenuOpen?: boolean }>`
  position: relative;
  min-height: 100vh;
  display: flex;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 1s ease-in-out, filter 0.3s ease, transform 0.3s ease;
  width: 100%;
  z-index: 1;
  overflow: hidden;
  filter: ${({ $isMenuOpen }) => ($isMenuOpen ? 'brightness(0.7)' : 'none')};
  transform: ${({ $isMenuOpen }) => ($isMenuOpen ? 'translateX(280px)' : 'translateX(0)')};
  
  @media (min-width: 769px) {
    filter: none;
    transform: none;
  }
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem;
  margin-left: 0;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: auto;
  height: 100vh;
  padding-top: 2rem;
  transition: transform 0.3s ease;
  
  @media (min-width: 769px) {
    margin-left: 250px;
    width: calc(100% - 250px);
    padding-top: 0;
  }
  
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
`;

const Section = styled.section`
  min-height: 100vh;
  width: 100%;
  scroll-snap-align: start;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
`;

export default App;
