"use client";

import { Suspense, useRef } from 'react';
import type { MotionValue } from 'framer-motion';
import { useScroll } from 'framer-motion';
import ScrollytellingOverlay from '@/components/homepage/ScrollytellingOverlay';
import { Canvas } from '@react-three/fiber';
import ScrollytellingCanvas from './ScrollytellingCanvas';

export default function HomePageClient() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end end'],
  });

  return (
    <>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0 }}>
        <Canvas>
          <Suspense fallback={null}>
            <ScrollytellingCanvas scrollYProgress={scrollYProgress as MotionValue<number>} />
          </Suspense>
        </Canvas>
      </div>
      <ScrollytellingOverlay ref={scrollRef} scrollYProgress={scrollYProgress as MotionValue<number>} />
    </>
  );
}