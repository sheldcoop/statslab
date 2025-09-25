'use client';

import {
  Calculator,
  Cpu,
  Orbit,
  Sigma,
  TrendingUp,
  BrainCircuit,
  Container,
} from 'lucide-react';
import React, { useRef, useState, MouseEvent } from 'react';
import { motion } from 'framer-motion';
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
  {
    icon: Container,
    title: "Statistician's Toolkit",
    description: 'Interactive tools for hands-on statistical analysis.',
    href: '/modules/statisticians-toolkit',
  },
];

const GridItem = ({
  item,
  index,
}: {
  item: (typeof gridItems)[0];
  index: number;
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <Link href={item.href} className="block h-full">
      <motion.div
        ref={divRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.3, delay: 0.3 + index * 0.05, ease: 'easeOut' }}
        viewport={{ once: true }}
        className="group relative h-full overflow-hidden rounded-lg border-2 border-border bg-card p-6 text-left transition-all duration-300 ease-out hover:border-secondary"
      >
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            opacity,
            background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, hsla(var(--secondary), 0.15), transparent 80%)`,
          }}
        />
        <div className="relative z-10">
          <div className="mb-4">
            <item.icon className="h-8 w-8 text-secondary transition-transform duration-300 ease-out group-hover:scale-110" />
          </div>
          <h3 className="font-headline text-2xl font-bold">{item.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {item.description}
          </p>
        </div>
      </motion.div>
    </Link>
  );
};

export default function ModuleGrid() {
  return (
    <div className="w-full">
      <div className="mb-12 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="font-headline text-4xl font-bold md:text-5xl"
        >
          Begin Your Journey
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground"
        >
          Master the core pillars of quantitative finance and data science, from
          foundational theory to practical application.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {gridItems.map((item, index) => (
          <GridItem item={item} key={index} index={index} />
        ))}
      </div>
    </div>
  );
}
