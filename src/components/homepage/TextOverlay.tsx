'use client';

import { motion, MotionValue, useTransform } from 'framer-motion';
import React from 'react';

const TextSection = ({
  scrollYProgress,
  range,
  title,
  subtitle,
}: {
  scrollYProgress: MotionValue<number>;
  range: [number, number];
  title: string;
  subtitle: string;
}) => {
  // Use a small overlap for cross-fading
  const overlap = 0.05;
  const start = range[0];
  const end = range[1];
  
  const opacity = useTransform(
    scrollYProgress,
    [start, start + overlap, end - overlap, end],
    [0, 1, 1, 0]
  );
  const y = useTransform(
    scrollYProgress,
    [start, start + overlap, end - overlap, end],
    [50, 0, 0, -50]
  );

  return (
    <section className="flex h-screen items-center justify-center">
      <motion.div
        style={{ opacity, y }}
        className="mx-auto max-w-2xl text-center"
      >
        <h2 className="font-headline text-5xl font-bold md:text-7xl">
          {title}
        </h2>
        <p className="mt-4 font-body text-xl text-muted-foreground">{subtitle}</p>
      </motion.div>
    </section>
  );
};

export default function TextOverlay({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  return (
    <div className="pointer-events-none absolute inset-0">
      <TextSection
        scrollYProgress={scrollYProgress}
        range={[0.1, 0.3]}
        title="Data is Chaos"
        subtitle="It’s a universe of disconnected points, a symphony without a conductor. Our journey begins by facing this raw, untamed wilderness."
      />
      <TextSection
        scrollYProgress={scrollYProgress}
        range={[0.3, 0.5]}
        title="Linear Algebra Gives It Structure"
        subtitle="We introduce vectors and matrices—the language of space and transformation. The chaos begins to form shapes, to align along hidden axes."
      />
      <TextSection
        scrollYProgress={scrollYProgress}
        range={[0.5, 0.7]}
        title="Statistics Finds the Pattern"
        subtitle="Probability and distributions reveal the invisible trends. We learn to listen for the signal within the noise, quantifying uncertainty."
      />
       <TextSection
        scrollYProgress={scrollYProgress}
        range={[0.7, 0.85]}
        title="Python Brings It to Life"
        subtitle="With code, our ideas become engines. NumPy, Pandas, and Scikit-learn are the tools we use to build, test, and deploy our intuition."
      />
    </div>
  );
}
