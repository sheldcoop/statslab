'use client';

import {
  ArrowRight,
  Calculator,
  Code,
  Cpu,
  Orbit,
  Sigma,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'framer-motion';

const gridItems = [
  {
    icon: Orbit,
    title: 'Linear Algebra',
    description: 'Vectors, matrices, and tensors. The language of data.',
  },
  {
    icon: Sigma,
    title: 'Statistics & Probability',
    description: 'Quantifying uncertainty and making sense of distributions.',
  },
  {
    icon: Code,
    title: 'Python for Quants',
    description: 'NumPy, Pandas, SciPy. The tools of the trade.',
  },
  {
    icon: TrendingUp,
    title: 'Time Series Analysis',
    description: 'ARIMA, GARCH, and forecasting market movements.',
  },
  {
    icon: Cpu,
    title: 'Machine Learning',
    description: 'Building predictive models for financial markets.',
  },
  {
    icon: Calculator,
    title: 'Algorithmic Trading',
    description: 'From strategy backtesting to live deployment.',
  },
];

const gridContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const gridItemVariants = {
  hidden: { y: 30, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      ease: 'easeOut',
      duration: 0.4,
    },
  },
};

export default function ModuleGrid() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#0D1117] p-4 md:p-8">
      <div className="w-full max-w-6xl">
        <header className="mb-12 text-center">
          <h1 className="font-headline text-5xl font-bold md:text-7xl">
            Begin Your Journey
          </h1>
          <p className="mt-4 text-xl text-[#8B949E]">
            Master the core pillars of quantitative finance and data science.
          </p>
        </header>

        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={gridContainerVariants}
          initial="hidden"
          animate="show"
        >
          {gridItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                variants={gridItemVariants}
                whileHover={{
                  scale: 1.02,
                  borderColor: 'hsl(var(--secondary))',
                  boxShadow: '0 0 20px hsl(var(--secondary) / 0.3)',
                  transition: { duration: 0.2 },
                }}
                className="relative rounded-lg border-2 border-[#161B22] bg-[#161B22] p-6 text-left"
              >
                <div className="mb-4">
                  <Icon className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-headline text-2xl font-bold">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-[#8B949E]">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
         <footer className="mt-12 text-center">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-headline font-bold text-lg text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Launch Terminal <ArrowRight />
            </motion.button>
        </footer>
      </div>
    </div>
  );
}
