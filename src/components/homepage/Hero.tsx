'use client';

import React from 'react';
import TextOverlay from '@/components/homepage/TextOverlay';
import VisualsContainer from '@/components/homepage/VisualsContainer';

export default function Hero() {
  return (
    <>
      <div className="sticky top-0 h-screen w-full">
        <VisualsContainer />
      </div>
      <div className="relative z-10">
        <TextOverlay />
      </div>
    </>
  );
}
