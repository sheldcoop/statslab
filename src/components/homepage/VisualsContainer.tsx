'use client';

import { useScroll, useTransform } from 'framer-motion';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function VisualsContainer({ children }: { children: ReactNode }) {
  const { scrollY } = useScroll();

  const opacity = useTransform(scrollY, [0, 250, 400], [0, 0, 1]);
  const scale = useTransform(scrollY, [0, 400], [0.9, 1]);
  const y = useTransform(scrollY, [0, 400], ['100vh', '0vh']);

  return (
    <div className="sticky top-0 h-screen w-full">
      <motion.div
        style={{ opacity, scale, y }}
        className="flex h-full w-full items-center justify-center"
      >
        {children}
      </motion.div>
    </div>
  );
}
