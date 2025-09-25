'use client';

import React from 'react';
import TextOverlay from '@/components/homepage/TextOverlay';
import VisualsContainer from '@/components/homepage/VisualsContainer';

export default function Hero() {
  return (
    <div className="relative h-screen w-full">
      <VisualsContainer />
      <TextOverlay />
    </div>
  );
}
