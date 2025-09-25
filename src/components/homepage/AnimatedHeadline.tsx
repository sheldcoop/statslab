'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const cursorVariants = {
  blinking: {
    opacity: [0, 0, 1, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatDelay: 0,
      ease: 'linear',
      times: [0, 0.5, 0.5, 1],
    },
  },
};

const AnimatedHeadline = ({
  taglines,
}: {
  taglines: [string, string][];
}) => {
  const [index, setIndex] = useState(0);
  const [staticText, setStaticText] = useState(taglines[0][0]);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const fullTypedText = taglines[index][1];
    setStaticText(taglines[index][0]);

    if (isTyping) {
      if (typedText.length < fullTypedText.length) {
        const timeout = setTimeout(() => {
          setTypedText(fullTypedText.slice(0, typedText.length + 1));
        }, 100);
        return () => clearTimeout(timeout);
      } else {
        // Finished typing, pause before deleting
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 1500);
        return () => clearTimeout(timeout);
      }
    } else {
      if (typedText.length > 0) {
        const timeout = setTimeout(() => {
          setTypedText(typedText.slice(0, typedText.length - 1));
        }, 50);
        return () => clearTimeout(timeout);
      } else {
        // Finished deleting, move to next tagline
        setIsTyping(true);
        setIndex((prevIndex) => (prevIndex + 1) % taglines.length);
      }
    }
  }, [typedText, isTyping, index, taglines]);

  return (
    <h1 className="font-headline text-5xl font-bold tracking-tighter text-foreground md:text-7xl">
      <span>{staticText}</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {typedText}
        </motion.span>
      </AnimatePresence>
      <motion.span
        variants={cursorVariants}
        animate="blinking"
        className="ml-1 inline-block h-[0.9em] w-[4px] translate-y-1 bg-secondary"
      />
    </h1>
  );
};

export default AnimatedHeadline;
