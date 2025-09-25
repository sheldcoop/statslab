'use client';

import React from 'react';
import VisualsContainer from '@/components/homepage/VisualsContainer';
import ModuleGrid from '@/components/homepage/ModuleGrid';
import { motion } from 'framer-motion';
import TestYourIntuition from '@/components/homepage/TestYourIntuition';
import Testimonials from '@/components/homepage/Testimonials';
import Footer from '@/components/homepage/Footer';

export default function Home() {
  return (
    <>
      <main className="relative min-h-screen bg-background text-foreground">
        <div className="absolute inset-0 h-screen w-full">
          <VisualsContainer />
        </div>

        <div className="relative z-10">
          <section className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="text-center"
            >
              <h1 className="font-headline text-6xl font-bold tracking-tighter text-foreground md:text-8xl lg:text-9xl">
                StatSpark
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
                An interactive, AI-powered toolkit for mastering quantitative
                concepts. Explore topics visually, build a deeper understanding,
                and accelerate your learning.
              </p>
            </motion.div>
          </section>

          <section className="bg-background py-20 md:py-32">
            <div className="container mx-auto w-full max-w-6xl px-4">
              <ModuleGrid />
            </div>
          </section>

          <section className="bg-background py-20 md:py-32">
            <div className="container mx-auto w-full max-w-4xl px-4">
              <TestYourIntuition />
            </div>
          </section>
          
          <section className="bg-background py-20 md:py-32">
            <div className="container mx-auto w-full max-w-6xl px-4">
              <Testimonials />
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
