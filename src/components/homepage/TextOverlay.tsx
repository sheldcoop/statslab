'use client';

import React, { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  MotionValue,
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
      'Visualize vectors, matrices, and transformations in 3D space. Build an intuition for the building blocks of data science.',
  },
  {
    title: 'Statistics',
    description:
      'Explore probability distributions and statistical concepts in a dynamic, interactive way. See the data come to life.',
  },
  {
    title: 'Time Series',
    description:
      'Uncover patterns and forecast trends by visualizing time-dependent data. From stock prices to climate data.',
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
  const y = useParallax(useTransform(progress, [i - 0.5, i], [0.5, 0]), -100);

  return (
    <section className="flex h-screen flex-col items-center justify-center">
      <motion.div
        style={{ opacity, y }}
        className="max-w-3xl text-center"
      >
        <h2 className="font-headline text-5xl font-bold tracking-tighter text-foreground md:text-7xl">
          {content[i].title}
        </h2>
        <p className="mt-4 text-lg text-muted-foreground md:text-xl">
          {content[i].description}
        </p>
      </motion.div>
    </section>
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
    [0, 1],
    [0, content.length -1]
  );
  
  return (
    <div ref={scrollRef} className="relative z-10">
      {content.map((_, i) => (
        <Section key={i} i={i} progress={sectionProgress} />
      ))}
    </div>
  );
}
