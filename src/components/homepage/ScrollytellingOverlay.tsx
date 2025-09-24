"use client";

import { forwardRef } from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const sections = [
  {
    title: "The world is chaos.",
    subtitle: "Data is a sea of noise. But within the randomness, patterns wait to be found. This is where intuition begins.",
    range: [0.02, 0.1, 0.18, 0.22],
  },
  {
    title: "Linear Algebra Gives It Structure.",
    subtitle: "We find the vectors, the planes, the dimensions that matter. Turning noise into a structured space of possibilities.",
    range: [0.23, 0.3, 0.38, 0.42],
  },
  {
    title: "Statistics Finds the Patterns.",
    subtitle: "With structure, we can see the distributions, the correlations, the signals. We quantify the uncertainty and find the truth.",
    range: [0.43, 0.5, 0.58, 0.62],
  },
  {
    title: "Time Series Reveals the Trends.",
    subtitle: "We follow the data through time, uncovering the rhythms and cycles that predict what's next. The past informs the future.",
    range: [0.63, 0.7, 0.78, 0.82],
  },
];

interface ScrollytellingOverlayProps {
  scrollYProgress: MotionValue<number>;
}

const ScrollytellingOverlay = forwardRef<HTMLDivElement, ScrollytellingOverlayProps>(({ scrollYProgress }, ref) => {

  const ctaOpacity = useTransform(scrollYProgress, [0.85, 0.9], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.85, 0.9], [50, 0]);

  return (
    <div ref={ref} className="relative z-10 w-full" style={{ height: '500vh' }}>
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <div className="relative flex w-full max-w-3xl flex-col items-center gap-4 p-8 text-center">
          {sections.map((sec, i) => {
            const opacity = useTransform(scrollYProgress, sec.range, [0, 1, 1, 0]);
            const y = useTransform(scrollYProgress, sec.range, [50, 0, 0, -50]);
            return (
              <motion.div
                key={i}
                style={{ opacity, y }}
                className="absolute flex flex-col items-center gap-4"
              >
                <h2 className="font-headline text-4xl font-bold text-primary-foreground md:text-6xl">
                  {sec.title}
                </h2>
                <p className="max-w-xl text-lg text-muted-foreground md:text-xl">
                  {sec.subtitle}
                </p>
              </motion.div>
            );
          })}

          <motion.div
            style={{ opacity: ctaOpacity, y: ctaY }}
            className="absolute flex flex-col items-center gap-6"
          >
            <h1 className="font-headline text-5xl font-bold md:text-7xl">
              StatSpark
            </h1>
            <p className="max-w-2xl text-xl text-muted-foreground md:text-2xl">
              Your Intuition Engine. Go from data chaos to predictive clarity.
            </p>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              Start Your Analysis <ArrowRight className="ml-2" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
});

ScrollytellingOverlay.displayName = "ScrollytellingOverlay";

export default ScrollytellingOverlay;
