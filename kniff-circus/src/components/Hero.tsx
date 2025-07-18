// src/components/Hero.tsx
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { TerminalWindow, WindowHeader, WindowBody, Dot, Prompt } from './TerminalComponents';

// ASCII Art for "kniff.world" - each character will be typed out
const asciiArt = [
  '                         ,,     ,... ,...                                   ,,        ,,  ',
  '`7MMF\' `YMM\'             db   .d\' ".d\' "`7MMF\'     A     `7MF\'            `7MM      `7MM  ',
  '  MM   .M\'                    dM`  dM`    `MA     ,MA     ,V                MM        MM  ',
  '  MM .d"    `7MMpMMMb. `7MM  mMMmmmMMmm    VM:   ,VVM:   ,V ,pW"Wq.`7Mb,od8 MM   ,M""bMM  ',
  '  MMMMM.      MM    MM   MM   MM   MM       MM.  M\' MM.  M\'6W\'   `Wb MM\' "\' MM ,AP    MM  ',
  '  MM  VMA     MM    MM   MM   MM   MM       `MM A\'  `MM A\' 8M     M8 MM     MM 8MI    MM  ',
  '  MM   `MM.   MM    MM   MM   MM   MM   ,,   :MM;    :MM;  YA.   ,A9 MM     MM `Mb    MM',
  '.JMML.   MMb.JMML  JMML.JMML.JMML.JMML  db    VF      VF    `Ybmd9\'.JMML. .JMML.`Wbmd"MML.',
  '',
  '',
];

// Initial terminal prompt text
const initialPrompt = 'kniff@tamu:~$ ';
const loadingMessages = [
  'Initializing hack sequence...',
  'Downloading awesome viruses...',
  'Mining kniffcoin...',
  'Almost there...',
  'You\'re in.'
];

const StyledHero = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  padding: 1rem 0;
  font-family: 'Source Code Pro', monospace;
  
  @media (max-width: 768px) {
    min-height: auto;
    padding: 2rem 0.5rem;
    align-items: flex-start;
  }
`;

const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
`;



const TerminalContent = styled(WindowBody)`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  white-space: pre;
  word-break: break-word;
  max-height: 100%;
  width: 100%;
  font-weight: 600;
  overflow-x: auto;
  font-family: 'Source Code Pro', monospace;
  
  /* Mobile styles */
  @media (max-width: 768px) {
    padding: 0.75rem;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-x: auto;
    font-size: 0.5rem;
    line-height: 1.1;
  }
  
  /* Ensure all text inside is bold */
  * {
    font-weight: 600 !important;
    font-family: 'Source Code Pro', monospace !important;
    
    @media (max-width: 768px) {
      font-size: inherit !important;
      line-height: 1.1 !important;
    }
  }
`;

const TerminalLine = styled.div`
  display: flex;
  flex-wrap: nowrap;
  white-space: pre;
  margin: 0.1rem 0;
  line-height: 1.1;
  width: 100%;
  color: #0f0;
  letter-spacing: -0.5px;
  
  @media (max-width: 768px) {
    white-space: pre-wrap;
    word-wrap: break-word;
    font-size: 0.5rem !important;
    line-height: 1.1 !important;
    margin: 0.05rem 0;
  }
`;

const Cursor = styled.span`
  display: inline-block;
  width: 0.5rem;
  height: 1.4rem;
  background: #0f0;
  margin-left: 0.25rem;
  animation: ${blink} 1s step-end infinite;
  vertical-align: middle;
`;

interface LineData {
  text: string;
  typed: string;
  isTyping: boolean;
}

export const Hero: React.FC = () => {
  const [lines, setLines] = useState<LineData[]>(() => 
    asciiArt.map(line => ({
      text: line,
      typed: '',
      isTyping: true
    }))
  );
  
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  const terminalContentRef = useRef<HTMLDivElement>(null);
  const typingSpeed = 5; // ms per character
  const lineDelay = 50; // ms between lines
  
  // Typewriter effect for ASCII art
  useEffect(() => {
    if (currentLine >= lines.length) {
      // Start loading sequence after ASCII art is complete
      const loadingTimer = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= loadingMessages.length - 1) {
            clearInterval(loadingTimer);
            setShowCursor(false);
            setIsComplete(true);
            return loadingMessages.length - 1;
          }
          return prev + 1;
        });
      }, 800);
      
      return () => clearInterval(loadingTimer);
    }
    
    // Type out current line
    const line = lines[currentLine];
    if (currentChar < line.text.length) {
      const timer = setTimeout(() => {
        setLines(prevLines => {
          const newLines = [...prevLines];
          newLines[currentLine] = {
            ...newLines[currentLine],
            typed: newLines[currentLine].text.substring(0, currentChar + 1)
          };
          return newLines;
        });
        setCurrentChar(prev => prev + 1);
      }, typingSpeed);
      
      return () => clearTimeout(timer);
    } else {
      // Move to next line
      const timer = setTimeout(() => {
        setCurrentLine(prev => prev + 1);
        setCurrentChar(0);
      }, lineDelay);
      
      return () => clearTimeout(timer);
    }
  }, [currentLine, currentChar, lines]);
  
  // Auto-scroll to bottom when content changes
  useEffect(() => {
    if (terminalContentRef.current) {
      terminalContentRef.current.scrollTop = terminalContentRef.current.scrollHeight;
    }
  }, [lines, loadingProgress, isComplete]);

  return (
    <StyledHero>
      <TerminalWindow>
        <WindowHeader>
          <Dot style={{ background: '#ff5f56' }} />
          <Dot style={{ background: '#ffbd2e' }} />
          <Dot style={{ background: '#27c93f' }} />
        </WindowHeader>
        <WindowBody style={{ padding: '1.5rem 0' }}>
          <TerminalContent ref={terminalContentRef}>
            <TerminalLine>
              <Prompt>kniff@tamu:~$</Prompt>
              <span> ./start.sh</span>
              {currentLine < lines.length && showCursor && <Cursor />}
            </TerminalLine>
            
            {/* ASCII Art Display - Always visible once typed */}
            <TerminalLine style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              {lines.map((line, index) => (
                <div key={index} style={{ whiteSpace: 'pre' }}>
                  {index <= currentLine ? line.typed : ''}
                  {index === currentLine && currentLine < lines.length && showCursor && <Cursor />}
                </div>
              ))}
            </TerminalLine>
            
            {/* Loading and welcome messages - Only show after ASCII art is done */}
            {currentLine >= lines.length && (
              <>
                <TerminalLine>
                  <Prompt>{initialPrompt}</Prompt>
                  <span>{loadingMessages[loadingProgress]}</span>
                  {loadingProgress < loadingMessages.length - 1 && showCursor && <Cursor />}
                </TerminalLine>
                
                {isComplete && (
                  <>
                    <TerminalLine style={{ marginTop: '1.5rem' }}>
                      <Prompt>{initialPrompt}</Prompt>
                      <span>Welcome to kniff.world!</span>
                    </TerminalLine>
                    <TerminalLine>
                      <Prompt>{initialPrompt}</Prompt>
                      <span>Click around to see projects, research, and more.</span>
                    </TerminalLine>
                    <TerminalLine style={{ marginTop: '1.5rem' }}>
                      <Prompt>{initialPrompt}</Prompt>
                      {showCursor && <Cursor />}
                    </TerminalLine>
                  </>
                )}
              </>
            )}
          </TerminalContent>
        </WindowBody>
      </TerminalWindow>
    </StyledHero>
  );
};
