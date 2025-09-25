'use client';

import React from 'react';
import TextOverlay from '@/components/homepage/TextOverlay';
import VisualsContainer from '@/components/homepage/VisualsContainer';
import ModuleGrid from '@/components/homepage/ModuleGrid';

export default function Home() {
  return (
    <main className="relative min-h-[150vh] bg-background">
      <div className="relative z-10">
        <TextOverlay />
      </div>
      <div className="sticky top-0 h-screen w-full">
        <VisualsContainer />
      </div>
      <div className="relative z-10 flex justify-center bg-background">
        <ModuleGrid />
      </div>
    </main>
  );
}