'use client';

import {
  ArrowRight,
  Calculator,
  Cpu,
  Orbit,
  Sigma,
  TrendingUp,
  BrainCircuit,
} from 'lucide-react';
import React from 'react';
import Link from 'next/link';

const gridItems = [
  {
    icon: Orbit,
    title: 'Linear Algebra',
    description: 'Vectors, matrices, and tensors. The language of data.',
    href: '/modules/linear-algebra',
  },
  {
    icon: Sigma,
    title: 'Statistics & Probability',
    description: 'Quantifying uncertainty and making sense of distributions.',
    href: '/modules/statistics',
  },
  {
    icon: BrainCircuit,
    title: 'Mental Math',
    description: 'Train your calculation speed and accuracy for interviews.',
    href: '/modules/mental-math',
  },
  {
    icon: TrendingUp,
    title: 'Time Series Analysis',
    description: 'ARIMA, GARCH, and forecasting market movements.',
    href: '/modules/time-series',
  },
  {
    icon: Cpu,
    title: 'Machine Learning',
    description: 'Building predictive models for financial markets.',
    href: '/modules/machine-learning',
  },
  {
    icon: Calculator,
    title: 'Algorithmic Trading',
    description: 'From strategy backtesting to live deployment.',
    href: '/modules/algorithmic-trading',
  },
];

export default function ModuleGrid() {
  return (
    <div className="w-full max-w-6xl text-center">
      <header className="mb-12">
        <h1 className="font-headline text-5xl font-bold md:text-7xl">
          Begin Your Journey
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Master the core pillars of quantitative finance and data science.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {gridItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link href={item.href} key={index} className="block h-full">
              <div className="group relative h-full overflow-hidden rounded-lg border-2 border-border bg-card p-6 text-left transition-all duration-200 ease-out hover:scale-105 hover:border-secondary hover:shadow-2xl hover:shadow-secondary/20">
                <div className="relative z-10">
                  <div className="mb-4">
                    <Icon className="h-8 w-8 text-secondary transition-transform duration-200 ease-out group-hover:scale-110" />
                  </div>
                  <h3 className="font-headline text-2xl font-bold">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <footer className="mt-12">
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-headline text-lg font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/50 active:scale-95">
          Launch Terminal <ArrowRight />
        </button>
      </footer>
    </div>
  );
}
