'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import ModuleGrid from '@/components/homepage/ModuleGrid';
import { Skeleton } from '@/components/ui/skeleton';
import Hero from '@/components/homepage/Hero';

const TestYourIntuition = dynamic(
  () => import('@/components/homepage/TestYourIntuition'),
  {
    loading: () => (
      <div className="w-full text-center">
        <Skeleton className="mx-auto h-12 w-1/2" />
        <Skeleton className="mx-auto mt-4 h-6 w-3/4" />
        <Skeleton className="mx-auto mt-12 h-64 w-full max-w-2xl" />
      </div>
    ),
  }
);

const Testimonials = dynamic(
  () => import('@/components/homepage/Testimonials'),
  {
    loading: () => (
      <div className="w-full text-center">
        <Skeleton className="mx-auto h-12 w-1/2" />
        <Skeleton className="mx-auto mt-4 h-6 w-3/4" />
        <Skeleton className="mx-auto mt-12 h-80 w-full" />
      </div>
    ),
  }
);

const Footer = dynamic(() => import('@/components/homepage/Footer'), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <main className="relative min-h-[300vh] bg-background text-foreground">
        <Hero />
        <div className="relative z-10 bg-background">
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
      </main>
      <Footer />
    </>
  );
}
