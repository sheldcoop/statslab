"use client";

import { useRef } from 'react';
import type { MotionValue } from 'framer-motion';
import { useScroll } from 'framer-motion';
import ScrollytellingCanvas from '@/components/homepage/ScrollytellingCanvas';
import ScrollytellingOverlay from '@/components/homepage/ScrollytellingOverlay';

export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end end'],
  });

  return (
    <main>
      <ScrollytellingCanvas scrollYProgress={scrollYProgress as MotionValue<number>} />
      <ScrollytellingOverlay ref={scrollRef} scrollYProgress={scrollYProgress as MotionValue<number>} />
    </main>
  );
}
