'use client';

import React from 'react';
import VisualsContainer from '@/components/homepage/VisualsContainer';
import AnimatedHeadline from './AnimatedHeadline';

const taglines = [
    ["From Data to ", "Insight"],
    ["From Insight to ", "Model"],
    ["From Model to ", "Signal"],
    ["From Signal to ", "Trade"],
    ["From Trade to ", "Alpha"],
    ["From Alpha to ", "Mastery"]
  ];

export default function Hero() {
  return (
    <div className="relative h-screen w-full">
      <VisualsContainer />
      <div className="relative z-10 flex h-screen flex-col items-center justify-center text-center">
        <AnimatedHeadline taglines={taglines} />
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
          An interactive, AI-powered toolkit for mastering quantitative
          concepts.
        </p>
      </div>
    </div>
  );
}
