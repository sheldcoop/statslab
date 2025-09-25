'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function TextOverlay() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 100, 200], [1, 1, 0]);
  const y = useTransform(scrollY, [0, 200], [0, -50]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="pointer-events-none fixed inset-0 z-10 flex flex-col items-center justify-center text-center"
    >
      <h1 className="font-headline text-6xl font-bold tracking-tighter text-foreground md:text-8xl lg:text-9xl">
        StatSpark
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
        An interactive, AI-powered toolkit for mastering quantitative concepts.
      </p>
    </motion.div>
  );
}
