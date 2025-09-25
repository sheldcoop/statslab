'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import CltDiscoveryLab from '@/components/learn/CltDiscoveryLab';

function formatSlug(slug: string) {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function TopicPage({
  params: paramsProp,
}: {
  params: { module: string; topic: string };
}) {
  const params = React.use(paramsProp);

  const moduleTitle = formatSlug(params.module);
  const topicTitle = formatSlug(params.topic);

  const renderContent = () => {
    switch (params.topic) {
      case 'central-limit-theorem':
        return <CltDiscoveryLab />;
      default:
        return (
          <div className="flex flex-1 flex-col items-center justify-center p-4 text-center md:p-6">
            <div className="space-y-4">
              <h1 className="font-headline text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl">
                {topicTitle}
              </h1>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                This is a placeholder page for the {topicTitle} topic. Content
                will be added here soon.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background/90 px-4 backdrop-blur-sm md:px-6">
        <Link
          href={`/modules/${params.module}`}
          className="flex items-center gap-2 text-lg font-semibold text-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to {moduleTitle}
        </Link>
      </header>
      <main className="flex flex-1 flex-col">
        {renderContent()}
      </main>
    </div>
  );
}
