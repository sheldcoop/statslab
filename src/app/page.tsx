'use client';

import React from 'react';
import TextOverlay from '@/components/homepage/TextOverlay';
import VisualsContainer from '@/components/homepage/VisualsContainer';

export default function Home() {
  return (
    <main className="relative min-h-[400vh] bg-background">
      <TextOverlay />
      <VisualsContainer />
    </main>
  );
}

    