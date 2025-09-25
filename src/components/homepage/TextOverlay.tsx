'use client';

import { motion } from 'framer-motion';

export default function TextOverlay() {
  const staticHeadline = 'Data to ';
  const typedHeadline = 'Quant';
  const subheadline =
    'An interactive, AI-powered toolkit for mastering quantitative concepts.';

  const headlineVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const charVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const subheadlineVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: typedHeadline.length * 0.1 + 0.5, // Delay until after headline types
        duration: 0.5,
      },
    },
  };

  return (
    <div className="relative z-10 flex h-screen flex-col items-center justify-center text-center">
      <h1 className="font-headline text-5xl font-bold tracking-tighter text-foreground md:text-7xl">
        <span>{staticHeadline}</span>
        <motion.span
          variants={headlineVariants}
          initial="hidden"
          animate="visible"
          aria-label={typedHeadline}
        >
          {typedHeadline.split('').map((char, index) => (
            <motion.span
              key={index}
              variants={charVariants}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
      </h1>
      <motion.p
        variants={subheadlineVariants}
        initial="hidden"
        animate="visible"
        className="mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl"
      >
        {subheadline}
      </motion.p>
    </div>
  );
}
