"use client";

import dynamic from 'next/dynamic';

const HomePageClient = dynamic(
  () => import('@/components/homepage/HomePageClient'),
  { ssr: false }
);

export default function Home() {
  return (
    <main>
      <HomePageClient />
    </main>
  );
}
