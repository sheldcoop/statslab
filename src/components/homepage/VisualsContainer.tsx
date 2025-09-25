'use client';

import { useScroll, useTransform } from 'framer-motion';
import { motion } from 'framer-motion';
import { ReactNode, Suspense } from 'react';
import Scene from './visuals/Scene';

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
      <Suspense fallback={null}>
        <Scene scrollProgress={scrollYProgress} />
      </Suspense>
      {children}
    </motion.div>
  );
}

    