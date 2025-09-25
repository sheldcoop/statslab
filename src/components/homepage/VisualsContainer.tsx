'use client';

import { useScroll, useTransform } from 'framer-motion';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

// A simple placeholder for visuals, can be expanded later
const PlaceholderVisual = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
  </div>
);

export default function VisualsContainer({
  children,
}: {
  children?: ReactNode;
}) {
  const { scrollYProgress } = useScroll({
    offset: ['start start', 'end end'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.8, 1], [1, 1, 1, 0]);

  return (
    <motion.div
      style={{ opacity }}
      className="sticky top-0 h-screen w-full"
    >
      <PlaceholderVisual />
      {children}
    </motion.div>
  );
}
