'use client';

import React, { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  MotionValue,
  useMotionTemplate,
} from 'framer-motion';

function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance]);
}

const content = [
  {
    title: 'StatSpark',
    description:
      'An interactive, AI-powered toolkit for mastering quantitative concepts.',
  },
  {
    title: 'Linear Algebra',
    description:
      'Explore vectors, matrices, and transformations in a 3D space. See the concepts behind the calculations.',
  },
  {
    title: 'Statistics & Probability',
    description:
      'Visualize distributions, understand the Central Limit Theorem, and build an intuition for uncertainty.',
  },
  {
    title: 'Time Series Analysis',
    description:
      'Deconstruct market data, identify trends, and understand the components of time-based data.',
  },
  {
    title: 'Begin Your Journey',
    description:
      'Master the core pillars of quantitative finance and data science. Launch the interactive terminal to start.',
  },
];

function Section({
  i,
  progress,
}: {
  i: number;
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, [i - 0.5, i, i + 0.5], [0, 1, 0]);
  const y = useParallax(useTransform(progress, [i - 1, i], [0, 1]), -100);

  return (
    <motion.div
      style={{ opacity, y }}
      className="pointer-events-none fixed inset-0 z-10 flex flex-col items-center justify-center text-center"
    >
      <h1 className="font-headline text-6xl font-bold tracking-tighter text-foreground md:text-8xl lg:text-9xl">
        {content[i].title}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
        {content[i].description}
      </p>
    </motion.div>
  );
}

export default function TextOverlay() {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end end'],
  });

  const sectionProgress = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [0, 1, 2, 3, 4, 4]
  );
  const gradientOpacity = useTransform(scrollYProgress, [0.8, 1], [1, 0]);
  const gradient = useMotionTemplate`radial-gradient(ellipse at 50% 50%, rgba(34, 34, 37, 0) 40%, rgba(34, 34, 37, 1) 70%), radial-gradient(ellipse at 50% 400px, var(--primary) 0%, #0000 40%)`;

  return (
    <>
      <div ref={scrollRef} className="pointer-events-none">
        {content.map((_, i) => (
          <Section key={i} i={i} progress={sectionProgress} />
        ))}
      </div>
      <motion.div
        style={{
          opacity: gradientOpacity,
          '--gradient': gradient,
          background: 'var(--gradient)',
        }}
        className="pointer-events-none fixed inset-0 z-20"
      />
    </>
  );
}

    