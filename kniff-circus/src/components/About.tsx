// src/components/About.tsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
// type-only import avoids the verbatimModuleSyntax error
import type { Variants } from 'framer-motion';

const cards = [
  { front: '👋 Hi there!', back: 'I’m Evan, a math‑obsessed coder with a flair for the surreal.' },
  { front: '🎓 Education', back: 'TAMU Math MS track · Quant roles prep' },
  { front: '💡 Passions', back: 'Stochastic calculus, glitch art, digital carnival.' },
];

const flipVariants: Variants = {
  initial: { rotateY: 0 },
  hover:   { rotateY: 180 },
};

export const About: React.FC = () => (
  <Section>
    <Title>About Me</Title>
    <Grid>
      {cards.map((c, i) => (
        <CardContainer
          key={i}
          variants={flipVariants}
          initial="initial"
          whileHover="hover"
          transition={{ duration: 0.6 }}
        >
          <Inner>
            <FaceFront>{c.front}</FaceFront>
            <FaceBack>{c.back}</FaceBack>
          </Inner>
        </CardContainer>
      ))}
    </Grid>
  </Section>
);

const Section = styled.div`
  text-align: center;
`;
const Title = styled.h2`
  font-family: 'Russo One', sans-serif;
  font-size: 2.4rem;
  color: #ff2aff;
  text-shadow: 0 0 6px #ff2aff88;
  margin-bottom: 1.2rem;
`;
const Grid = styled.div`
  display: flex;
  gap: 1.8rem;
  justify-content: center;
  flex-wrap: wrap;
`;
const CardContainer = styled(motion.div)`
  perspective: 1000px;
  width: 200px;
  height: 260px;
`;
const Inner = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
`;
const Face = styled.div<{ front?: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border-radius: 1rem;
  font-size: 1rem;
  color: #fff;
  background: ${({ front }) => (front ? '#2afffb15' : '#ff2aff08')};
  border: 2px solid ${({ front }) => (front ? '#2afffb' : '#ff2aff')};
  transform: ${({ front }) => (front ? 'rotateY(0deg)' : 'rotateY(180deg)')};
`;
const FaceFront = styled(Face).attrs({ front: true })``;
const FaceBack  = styled(Face).attrs({ front: false })``;
