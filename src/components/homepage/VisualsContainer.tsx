'use client';

import React from 'react';

export default function VisualsContainer() {
  return (
    <div className="pointer-events-none absolute inset-0 h-screen w-full">
      <div className="absolute inset-0 bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
    </div>
  );
}
