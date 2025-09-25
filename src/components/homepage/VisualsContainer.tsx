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
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <motion.div
      style={{ y }}
      className="sticky top-0 h-screen w-full"
    >
      <Constellation />
      {children}
    </motion.div>
  );
}
