'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function formatSlug(slug: string) {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function ModulePage({ params }: { params: { slug: string } }) {
  if (!params || !params.slug) {
    return null;
  }
  const title = formatSlug(params.slug);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background/90 px-4 backdrop-blur-sm md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold text-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Home
        </Link>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center p-4 text-center md:p-6">
        <div className="space-y-4">
          <h1 className="font-headline text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl">
            {title}
          </h1>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
            This is a placeholder page for the {title} module. Content and topics will
            be added here soon.
          </p>
        </div>
      </main>
    </div>
  );
}
