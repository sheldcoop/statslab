'use client';

import { useScroll, useTransform } from 'framer-motion';
import { motion } from 'framer-motion';
import Constellation from './Constellation';

export default function VisualsContainer() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <motion.div style={{ y }} className="sticky top-0 h-screen w-full">
      <Constellation />
    </motion.div>
  );
}
