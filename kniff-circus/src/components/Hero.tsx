// src/components/Hero.tsx
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
// type-only for TS compliance
import type { MotionProps } from 'framer-motion';

export const Hero: React.FC = () => (
  <Wrapper
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1.2, ease: 'easeOut' }}
  >
    <Glitch data-text="Evan Kniffen">Evan Kniffen</Glitch>
    <Tagline
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.8 }}
    >
      A Digital Circus of Math · Code · Chaos
    </Tagline>
    <Light left="15%" delay="0s" />
    <Light left="50%" delay="0.5s" />
    <Light left="85%" delay="1s" />
  </Wrapper>
);

// ─────────────────────────────────────────────────────────────────────────────
// Styled + Motion components
// ─────────────────────────────────────────────────────────────────────────────

const Wrapper = styled(motion.div)<MotionProps>`
  position: relative;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, #300040, #0a001f);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const glitch1 = keyframes`
  0% { clip-path: inset(20% 0 65% 0); transform: translate(-2px, -2px); }
  20% { clip-path: inset(10% 0 75% 0); transform: translate(2px, 2px); }
  40% { clip-path: inset(85% 0 5% 0); transform: translate(-2px, 2px); }
  60% { clip-path: inset(45% 0 45% 0); transform: translate(2px, -2px); }
  80% { clip-path: inset(10% 0 75% 0); transform: translate(-2px, -2px); }
  100% { clip-path: inset(20% 0 65% 0); transform: translate(0, 0); }
`;
const glitch2 = keyframes`
  0% { clip-path: inset(85% 0 5% 0); transform: translate(2px, 2px); }
  20% { clip-path: inset(5% 0 85% 0); transform: translate(-2px, -2px); }
  40% { clip-path: inset(50% 0 40% 0); transform: translate(2px, -2px); }
  60% { clip-path: inset(10% 0 75% 0); transform: translate(-2px, 2px); }
  80% { clip-path: inset(75% 0 15% 0); transform: translate(2px, 2px); }
  100% { clip-path: inset(85% 0 5% 0); transform: translate(0, 0); }
`;

const Glitch = styled.h1`
  position: relative;
  font-family: 'Russo One', sans-serif;
  font-size: clamp(2.5rem, 10vw, 5rem);
  color: #fff;
  text-transform: uppercase;
  z-index: 1;

  &::before,
  &::after {
    content: attr(data-text);
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    overflow: hidden;
    color: #fff;
  }

  &::before {
    left: 2px;
    text-shadow: -2px 0 #ff00c8;
    animation: ${glitch1} 2s infinite linear alternate-reverse;
  }
  &::after {
    left: -2px;
    text-shadow: -2px 0 #00ffe7;
    animation: ${glitch2} 3s infinite linear alternate-reverse;
  }
`;

const Tagline = styled(motion.p)<MotionProps>`
  margin-top: 1rem;
  font-family: 'Rubik', sans-serif;
  font-size: clamp(1rem, 3vw, 1.5rem);
  background: linear-gradient(45deg, #ff00c8, #00ffe7);
  -webkit-background-clip: text;
  color: transparent;
  text-shadow: 0 0 8px #00ffe780;
  z-index: 1;
`;

const Light = styled.div<{ left: string; delay: string }>`
  position: absolute;
  bottom: 20%;
  left: ${({ left }) => left};
  width: 4px;
  height: 150px;
  background: linear-gradient(to top, #ff00c8 0%, transparent 70%);
  opacity: 0.3;
  filter: blur(4px);
  animation: flicker 2s infinite;
  animation-delay: ${({ delay }) => delay};

  @keyframes flicker {
    0%, 100% { opacity: 0.3; transform: scaleY(1); }
    50% { opacity: 0.6; transform: scaleY(1.2); }
  }
`;
