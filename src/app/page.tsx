'use client';

import React from 'react';
import ModuleGrid from '@/components/homepage/ModuleGrid';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <ModuleGrid />
    </main>
  );
}
