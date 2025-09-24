import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ModulePage({ params }: { params: { slug: string } }) {
  const title = params.slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
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
            This is a placeholder page for the {title} module. Content will be
            added here soon.
          </p>
        </div>
      </main>
    </div>
  );
}
