'use client';

import { useScroll, useTransform } from 'framer-motion';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import Constellation from './Constellation';

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
      <Constellation />
      {children}
    </motion.div>
  );
}
