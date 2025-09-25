'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './visuals/Scene';

export default function VisualsContainer() {
  return (
    <div className="pointer-events-none absolute inset-0 h-screen w-full">
      <Canvas>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
