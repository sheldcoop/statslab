'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="relative min-h-[300vh] bg-background text-foreground">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-24 w-96" />
          <Skeleton className="h-8 w-80" />
        </div>
      </div>
      <div className="relative z-10 bg-background">
        <div className="container mx-auto w-full max-w-6xl px-4 py-20 md:py-32">
          <div className="mb-12 text-center">
            <Skeleton className="mx-auto h-12 w-1/2" />
            <Skeleton className="mx-auto mt-4 h-6 w-3/4" />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-lg border-2 border-border bg-card p-6">
                <Skeleton className="mb-4 h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="mt-2 h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
