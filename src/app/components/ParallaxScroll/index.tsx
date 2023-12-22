import React from 'react';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';

interface ParallaxScrollProps {
  children: React.ReactNode;
}

export default function ParallaxScroll({ children }: ParallaxScrollProps) {
  return (
    <ParallaxProvider>
      <Parallax translateY={[0, 0]}>
        <div className="parallax-container">{children}</div>
      </Parallax>
    </ParallaxProvider>
  );
};