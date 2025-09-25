'use client';

import React from 'react';
import ModuleGrid from '@/components/homepage/ModuleGrid';
import VisualsContainer from '@/components/homepage/VisualsContainer';
import TextOverlay from '@/components/homepage/TextOverlay';

export default function Home() {
  return (
    <main className="relative min-h-[300vh] bg-background">
      <VisualsContainer>
        <ModuleGrid />
      </VisualsContainer>
      <TextOverlay />
    </main>
  );
}
