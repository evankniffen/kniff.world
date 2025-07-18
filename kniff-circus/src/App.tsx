// src/App.tsx
import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { GlobalStyle } from './styles/GlobalStyle';
import { BinaryRain } from './components/BinaryRain';
import { Sidebar, Hero, About, Projects, Contact } from './components';
import Experience from './components/Experience';
import Research from './components/Research';

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
          <Section id="research"><Research /></Section>
          <Section id="contact"><Contact/></Section>
        </Main>
      </AppContainer>
    </>
  );
};

const AppContainer = styled.div<{ $visible: boolean }>`
  position: relative;
  min-height: 100vh;
  display: flex;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 1s ease-in-out;
  width: 100%;
  z-index: 10;
  overflow: hidden;
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
