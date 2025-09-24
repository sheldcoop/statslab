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
  range: [number, number, number, number];
  title: string;
  subtitle: string;
}) => {
  const opacity = useTransform(scrollYProgress, range, [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, range, [100, 0, 0, -100]);

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
      <FirstTextSection scrollYProgress={scrollYProgress} />
      <TextSection
        scrollYProgress={scrollYProgress}
        range={[0.15, 0.25, 0.35, 0.45]}
        title="Linear Algebra Gives It Structure"
        subtitle="We introduce vectors and matrices—the language of space and transformation. The chaos begins to form shapes, to align along hidden axes."
      />
      <TextSection
        scrollYProgress={scrollYProgress}
        range={[0.35, 0.45, 0.55, 0.65]}
        title="Statistics Finds the Pattern"
        subtitle="Probability and distributions reveal the invisible trends. We learn to listen for the signal within the noise, quantifying uncertainty."
      />
      <TextSection
        scrollYProgress={scrollYProgress}
        range={[0.55, 0.65, 0.75, 0.85]}
        title="Time Series Makes It Predict"
        subtitle="The past gains a voice. We analyze sequences, understand rhythms, and begin to forecast the future with confidence."
      />
      <TextSection
        scrollYProgress={scrollYProgress}
        range={[0.75, 0.85, 0.95, 1.0]}
        title="Python Brings It to Life"
        subtitle="With code, our ideas become engines. NumPy, Pandas, and Scikit-learn are the tools we use to build, test, and deploy our intuition."
      />
    </div>
  );
}

const FirstTextSection = ({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) => {
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.25], [1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.05, 0.25], [0, 0, -100]);

  return (
    <section className="flex h-screen items-center justify-center">
      <motion.div
        style={{ opacity, y }}
        className="mx-auto max-w-2xl text-center"
      >
        <h2 className="font-headline text-5xl font-bold md:text-7xl">
          Data is Chaos
        </h2>
        <p className="mt-4 font-body text-xl text-muted-foreground">
          It’s a universe of disconnected points, a symphony without a
          conductor. Our journey begins by facing this raw, untamed wilderness.
        </p>
      </motion.div>
    </section>
  );
};
