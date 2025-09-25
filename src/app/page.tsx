'use client';

import React from 'react';
import VisualsContainer from '@/components/homepage/VisualsContainer';
import ModuleGrid from '@/components/homepage/ModuleGrid';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <div className="absolute inset-0 h-screen w-full">
        <VisualsContainer />
      </div>
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h1 className="font-headline text-6xl font-bold tracking-tighter text-foreground md:text-8xl lg:text-9xl">
            StatSpark
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
            An interactive, AI-powered toolkit for mastering quantitative
            concepts. Explore topics visually, build a deeper understanding, and
            accelerate your learning.
          </p>
        </motion.div>

        <div className="mt-16 w-full max-w-6xl">
          <ModuleGrid />
        </div>
      </div>
    </main>
  );
}
