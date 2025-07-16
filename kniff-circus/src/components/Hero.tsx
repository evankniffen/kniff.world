// src/components/Hero.tsx
import React from 'react';
import styled from 'styled-components';
import { Typewriter } from 'react-simple-typewriter';
import { motion } from 'framer-motion';
import { 
  TerminalWindow, 
  WindowHeader, 
  WindowBody, 
  Dot, 
  Prompt 
} from './TerminalComponents';

export const Hero: React.FC = () => (
  <TerminalWindow
    as={motion.div}
    initial={{ scale:0.9, opacity:0 }}
    animate={{ scale:1, opacity:1 }}
    transition={{ duration:0.8 }}
  >
    <WindowHeader>
      <Dot style={{ background:'#f00' }}/>
      <Dot style={{ background:'#ff0' }}/>
      <Dot style={{ background:'#0f0' }}/>
    </WindowHeader>
    <WindowBody>
      <Line>
        <Prompt>Kniff@tamu:~$</Prompt>{' '}
        <Typewriter
          words={['npm start kniff-world']}
          cursor
          cursorStyle='_'
          typeSpeed={80}
          deleteSpeed={50}
          loop={1}
        />
      </Line>
      <Line>Loading digital circus...</Line>
    </WindowBody>
  </TerminalWindow>
);

const Line = styled.div`
  display:flex;
  align-items:center;
  white-space:nowrap;
`;
