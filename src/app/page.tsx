"use client";

import dynamic from 'next/dynamic';

const CanvasLoader = dynamic(
  () => import('@/components/homepage/CanvasLoader'),
  { ssr: false }
);

export default function Home() {
  return (
    <main>
      <CanvasLoader />
    </main>
  );
}