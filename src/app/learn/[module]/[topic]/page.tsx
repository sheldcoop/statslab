'use client';

import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import CltDiscoveryLab from '@/components/learn/CltDiscoveryLab';
import { Button } from '@/components/ui/button';

function formatSlug(slug: string) {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const PlaceholderContent = ({ topicTitle }: { topicTitle: string }) => (
  <div className="flex flex-1 flex-col items-center justify-center p-4 text-center md:p-6">
    <div className="space-y-4">
      <h1 className="font-headline text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl">
        {topicTitle}
      </h1>
      <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
        This is a placeholder page for the {topicTitle} topic. Content will be
        added here soon.
      </p>
    </div>
  </div>
);

const HypothesisTestingContent = ({ onStartQuiz }: { onStartQuiz: () => void }) => (
    <div className="flex flex-1 flex-col items-center justify-center p-4 text-center md:p-6">
      <div className="space-y-4">
        <h1 className="font-headline text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl">
          Hypothesis Testing
        </h1>
        <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
          Ready to test your knowledge? This quiz will challenge your understanding of null and alternative hypotheses, p-values, and statistical significance.
        </p>
        <Button onClick={onStartQuiz} size="lg">Start Quiz</Button>
      </div>
    </div>
  );


export default function TopicPage({
  params: paramsProp,
}: {
  params: { module: string; topic: string };
}) {
  const params = React.use(paramsProp);
  const [isQuizActive, setQuizActive] = useState(false);


  const moduleTitle = formatSlug(params.module);
  const topicTitle = formatSlug(params.topic);

  const renderContent = () => {
    if (isQuizActive) {
        return (
            <div>Quiz placeholder</div>
        )
    }

    switch (params.topic) {
      case 'central-limit-theorem':
        return <CltDiscoveryLab />;
      case 'hypothesis-testing':
        return <HypothesisTestingContent onStartQuiz={() => setQuizActive(true)} />;
      default:
        return <PlaceholderContent topicTitle={topicTitle} />;
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
