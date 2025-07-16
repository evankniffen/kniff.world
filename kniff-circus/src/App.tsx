// src/App.tsx
import React from 'react';
import styled from 'styled-components';
import { GlobalStyle } from './styles/GlobalStyle';
// @ts-ignore
import { Hero } from './components/Hero';
// @ts-ignore
import { About } from './components/About';
// @ts-ignore
import { Projects } from './components/Projects';
// @ts-ignore
import { Contact } from './components/Contact';

const App: React.FC = () => (
  <>
    <GlobalStyle />
    <Container className="snap-container">
      <Section><Hero /></Section>
      <Section><About /></Section>
      <Section><Projects /></Section>
      <Section><Contact /></Section>
    </Container>
  </>
);

export default App;

/* Styled wrappers */
const Container = styled.div``;
const Section = styled.section.attrs({ className: 'snap-section' })`
  display: flex;
  align-items: center;
  justify-content: center;
`;
