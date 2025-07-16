// src/components/BinaryRain.tsx
import React, { useRef, useEffect } from 'react';

interface BinaryRainProps {
  onAnimationComplete?: () => void;
  isInitialAnimation?: boolean;
}

export const BinaryRain: React.FC<BinaryRainProps> = (props) => {
  const { onAnimationComplete } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationStartTime = useRef<number>(0);
  const animationDuration = 3000; // 3 seconds of initial animation

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d', { alpha: false })!;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = Array(columns).fill(0);
    let animationFrameId: number;
    let animationCompleteCalled = false;
    let isMounted = true;

    // Only start the initial animation timer if this is the initial animation
    if (props.isInitialAnimation) {
      animationStartTime.current = Date.now();
    } else {
      // For background mode, start with a clean slate
      ctx.fillStyle = 'rgba(0, 0, 0, 1)';
      ctx.fillRect(0, 0, width, height);
    }

    const draw = () => {
      if (!isMounted) return;

      // Handle initial animation if needed
      if (props.isInitialAnimation) {
        const elapsed = Date.now() - animationStartTime.current;
        const progress = Math.min(elapsed / animationDuration, 1);

        // Fade out the initial animation
        if (progress >= 1 && !animationCompleteCalled) {
          animationCompleteCalled = true;
          onAnimationComplete?.();
          // After initial animation, switch to background mode
          return;
        }
      }

      // Clear with a semi-transparent black to create the trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, width, height);

      // Draw the rain
      ctx.fillStyle = '#0F0';
      ctx.font = `${fontSize}px Source Code Pro`;

      for (let i = 0; i < drops.length; i++) {
        const text = Math.random() > 0.5 ? '0' : '1';
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reset drop to top if it reaches the bottom
        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      // Continue the animation
      animationFrameId = requestAnimationFrame(draw);
    };

    // Start the animation
    animationFrameId = requestAnimationFrame(draw);

    const handleResize = () => {
      if (!isMounted) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      isMounted = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [onAnimationComplete, props.isInitialAnimation]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 0,
        pointerEvents: 'none' // Make sure clicks go through to elements below
      }}
    />
  );
};
