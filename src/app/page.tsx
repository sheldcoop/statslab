'use client';

import React from 'react';
import VisualsContainer from '@/components/homepage/VisualsContainer';
import ModuleGrid from '@/components/homepage/ModuleGrid';
import TestYourIntuition from '@/components/homepage/TestYourIntuition';
import Testimonials from '@/components/homepage/Testimonials';
import Footer from '@/components/homepage/Footer';
import TextOverlay from '@/components/homepage/TextOverlay';

export default function Home() {
  return (
    <>
      <main className="relative min-h-[300vh] bg-background text-foreground">
        <div className="sticky top-0 h-screen w-full">
          <VisualsContainer />
        </div>
        <div className="relative z-10">
          <TextOverlay />

          <div className="bg-background">
            <section className="container mx-auto w-full max-w-6xl px-4 py-20 md:py-32">
              <ModuleGrid />
            </section>

            <section className="container mx-auto w-full max-w-4xl px-4 py-20 md:py-32">
              <TestYourIntuition />
            </section>

            <section className="container mx-auto w-full max-w-6xl px-4 py-20 md:py-32">
              <Testimonials />
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
