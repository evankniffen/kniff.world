// src/App.tsx
import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { GlobalStyle } from './styles/GlobalStyle';
import { BinaryRain } from './components/BinaryRain';
import { Sidebar, Hero, About, Projects, Contact } from './components';
import Experience from './components/Experience';

const App: React.FC = () => {
  const [initialAnimationComplete, setInitialAnimationComplete] = useState(false);
  const animationTriggered = useRef(false);
  
  const handleAnimationComplete = useCallback(() => {
    if (!initialAnimationComplete) {
      setInitialAnimationComplete(true);
    }
  }, [initialAnimationComplete]);

  // Only trigger the initial animation once when the component mounts
  const shouldShowInitialAnimation = !initialAnimationComplete && !animationTriggered.current;
  if (shouldShowInitialAnimation) {
    animationTriggered.current = true;
  }

  return (
    <>
      <GlobalStyle />
      <BinaryRain 
        key={shouldShowInitialAnimation ? 'initial' : 'background'}
        onAnimationComplete={handleAnimationComplete} 
        isInitialAnimation={shouldShowInitialAnimation}
      />
      <AppContainer $visible={true}>
        <Sidebar />
        <Main>
          <Section id="hero"><Hero /></Section>
          <Section id="about"><About /></Section>
          <Section id="experience"><Experience /></Section>
          <Section id="projects"><Projects/></Section>
          <Section id="contact"><Contact/></Section>
        </Main>
      </AppContainer>
    </>
  );
};

const AppContainer = styled.div<{ $visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  grid-template-columns: 200px 1fr;
  z-index: 10;
`;



const Main = styled.main`
  height: 100%;
  overflow-y: auto;
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
