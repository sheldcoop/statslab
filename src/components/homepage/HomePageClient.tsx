"use client";

import { useRef } from 'react';
import type { MotionValue } from 'framer-motion';
import { useScroll } from 'framer-motion';
import ScrollytellingOverlay from '@/components/homepage/ScrollytellingOverlay';
import ScrollytellingCanvas from '@/components/homepage/ScrollytellingCanvas';

export default function HomePageClient() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end end'],
  });

  return (
    <>
      <ScrollytellingCanvas scrollYProgress={scrollYProgress as MotionValue<number>} />
      <ScrollytellingOverlay ref={scrollRef} scrollYProgress={scrollYProgress as MotionValue<number>} />
    </>
  );
}
