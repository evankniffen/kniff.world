// src/components/Hero.tsx
import React from 'react';
import styled from 'styled-components';

const StyledHero = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  padding: 0;
  margin: 0 auto;
  max-width: 1000px;
  
  @media (max-width: 768px) {
    padding-top: 150px;
  }
`;

const Greeting = styled.h1`
  color: var(--primary);
  font-family: var(--font-mono);
  font-size: clamp(var(--fz-sm), 5vw, var(--fz-md));
  font-weight: 400;
  margin: 0 0 20px 4px;
`;

const BigHeading = styled.h2`
  font-size: clamp(40px, 8vw, 80px);
  margin: 0;
  color: var(--lightest-slate);
  line-height: 1.1;
`;

const BiggerHeading = styled.h3`
  font-size: clamp(40px, 8vw, 70px);
  margin: 10px 0 0;
  color: var(--slate);
  line-height: 1.1;
`;

const Description = styled.div`
  margin-top: 25px;
  max-width: 540px;
  
  p {
    margin: 20px 0 0;
  }
`;

const Button = styled.button`
  color: var(--primary);
  background-color: transparent;
  border: 1px solid var(--primary);
  border-radius: var(--border-radius);
  padding: 1.25rem 1.75rem;
  font-size: var(--fz-sm);
  font-family: var(--font-mono);
  line-height: 1;
  text-decoration: none;
  cursor: pointer;
  transition: var(--transition);
  margin-top: 50px;
  
  &:hover,
  &:focus,
  &:active {
    background-color: var(--primary-tint);
    outline: none;
  }
  
  &:after {
    display: none !important;
  }
`;

export const Hero: React.FC = () => {
  return (
    <StyledHero id="hero">
      <Greeting>Hi, my name is</Greeting>
      <BigHeading>Your Name.</BigHeading>
      <BiggerHeading>I build things for the web.</BiggerHeading>
      
      <Description>
        <p>
          I'm a software engineer based in [Your Location] specializing in building (and occasionally designing)
          exceptional websites, applications, and everything in between.
        </p>
      </Description>
      
      <Button
        onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
      >
        Get In Touch
      </Button>
    </StyledHero>
  );
};
