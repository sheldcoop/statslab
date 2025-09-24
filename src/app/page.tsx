'use client';

import React, { useRef } from 'react';
import { useScroll } from 'framer-motion';
import VisualsContainer from '@/components/homepage/VisualsContainer';
import TextOverlay from '@/components/homepage/TextOverlay';

export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end end'],
  });

  return (
    <main
      ref={scrollRef}
      className="relative min-h-[500vh] w-full bg-background text-foreground"
    >
      <VisualsContainer scrollYProgress={scrollYProgress} />
      <TextOverlay scrollYProgress={scrollYProgress} />
    </main>
  );
}
