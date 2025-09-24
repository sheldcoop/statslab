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
import React from 'react';

// --- Thematic Background Components ---

const BGLinearAlgebra = () => (
  <div className="absolute inset-0 z-0 overflow-hidden rounded-lg opacity-20">
    <svg width="100%" height="100%">
      <defs>
        <pattern
          id="grid"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      {/* Axes */}
      <line x1="0" y1="50%" x2="100%" y2="50%" stroke="hsl(var(--muted))" strokeWidth="0.5" />
      <line x1="50%" y1="0" x2="50%" y2="100%" stroke="hsl(var(--muted))" strokeWidth="0.5" />
      <motion.line
        x1="50%"
        y1="50%"
        stroke="hsl(var(--primary))"
        strokeWidth="1.5"
        initial={{ x2: '70%', y2: '30%' }}
        animate={{ x2: ['30%', '70%', '30%'], y2: ['70%', '30%', '70%'] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
      />
      <motion.line
        x1="50%"
        y1="50%"
        stroke="hsl(var(--secondary))"
        strokeWidth="1.5"
        initial={{ x2: '30%', y2: '30%' }}
        animate={{ x2: ['70%', '30%', '70%'], y2: ['70%', '30%', '70%'] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
          delay: 0.5,
        }}
      />
    </svg>
  </div>
);

const BGStatistics = () => (
  <div className="absolute inset-0 z-0 overflow-hidden rounded-lg opacity-20 flex items-center justify-center">
    <svg width="80%" height="80%" viewBox="0 0 200 100" preserveAspectRatio="none">
      <motion.path
        d="M 0 100 C 50 100, 75 20, 100 50 S 150 100, 200 80"
        stroke="hsl(var(--secondary))"
        fill="transparent"
        strokeWidth="2"
        initial={{ pathLength: 0, stroke: 'hsl(var(--primary))' }}
        animate={{ pathLength: 1, stroke: 'hsl(var(--secondary))' }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />
    </svg>
  </div>
);

const codeLines = ['const data =', 'df.describe()', '() => { ... }', 'plt.show()'];
const BGPython = () => {
    const containerVariants = {
        animate: {
            transition: {
                staggerChildren: 0.8,
                repeat: Infinity,
            },
        },
    };

    const itemVariants = {
        initial: { opacity: 0, x: -10 },
        animate: { 
            opacity: [0, 0.7, 0.7, 0],
            x: [-10, 0, 0, 10],
            transition: {
                duration: 3,
                ease: 'easeInOut',
            }
        },
    };

    return (
        <div className="absolute inset-0 z-0 overflow-hidden rounded-lg p-4 opacity-30">
            <motion.div 
                className="font-mono text-lg text-primary"
                variants={containerVariants}
                initial="initial"
                animate="animate"
            >
                {codeLines.map((line, i) => (
                    <motion.p key={i} variants={itemVariants} className="mt-1">
                        {line}
                    </motion.p>
                ))}
            </motion.div>
        </div>
    );
};


const BGTimeSeries = () => (
  <div className="absolute inset-0 z-0 overflow-hidden rounded-lg opacity-20 flex items-center justify-center">
    <svg
      width="80%"
      height="80%"
      viewBox="0 0 200 100"
      preserveAspectRatio="none"
    >
      <motion.path
        d="M 0 50 Q 25 20, 50 50 T 100 50 T 150 50 T 200 50"
        stroke="hsl(var(--secondary))"
        fill="transparent"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: 2.5,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />
    </svg>
  </div>
);

const BGMachineLearning = () => (
  <div className="absolute inset-0 z-0 overflow-hidden rounded-lg opacity-10 flex items-center justify-center">
    {[-40, 0, 40].map((y) =>
      [-60, 0, 60].map((x) => (
        <motion.circle
          key={`${x}-${y}`}
          cx="50%"
          cy="50%"
          r="4"
          fill="hsl(var(--secondary))"
          initial={{ x, y, opacity: 0.5 }}
          animate={{ opacity: [0.2, 0.7, 0.2] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: Math.random(),
            ease: 'easeInOut',
          }}
        />
      ))
    )}
  </div>
);

const BGAlgorithmicTrading = () => (
  <div className="absolute inset-0 z-0 overflow-hidden rounded-lg opacity-20 flex items-center justify-center p-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <motion.div
        key={i}
        className="w-4 h-16 bg-primary/50 rounded-sm mx-1"
        initial={{ scaleY: 0.5, opacity: 0.5 }}
        animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.4, 0.8, 0.4] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: i * 0.3,
          ease: 'easeInOut',
        }}
      />
    ))}
  </div>
);

const gridItems = [
  {
    icon: Orbit,
    title: 'Linear Algebra',
    description: 'Vectors, matrices, and tensors. The language of data.',
    background: <BGLinearAlgebra />,
  },
  {
    icon: Sigma,
    title: 'Statistics & Probability',
    description: 'Quantifying uncertainty and making sense of distributions.',
    background: <BGStatistics />,
  },
  {
    icon: Code,
    title: 'Python for Quants',
    description: 'NumPy, Pandas, SciPy. The tools of the trade.',
    background: <BGPython />,
  },
  {
    icon: TrendingUp,
    title: 'Time Series Analysis',
    description: 'ARIMA, GARCH, and forecasting market movements.',
    background: <BGTimeSeries />,
  },
  {
    icon: Cpu,
    title: 'Machine Learning',
    description: 'Building predictive models for financial markets.',
    background: <BGMachineLearning />,
  },
  {
    icon: Calculator,
    title: 'Algorithmic Trading',
    description: 'From strategy backtesting to live deployment.',
    background: <BGAlgorithmicTrading />,
  },
];

const gridContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const gridItemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      ease: 'easeOut',
      duration: 0.3,
    },
  },
};

const footerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.6, // Stagger after the grid items
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

export default function ModuleGrid() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-transparent p-4 md:p-8">
      <motion.div
        className="w-full max-w-6xl text-center"
        initial="hidden"
        animate="show"
        variants={gridContainerVariants}
      >
        <header className="mb-12">
          <motion.h1
            className="font-headline text-5xl font-bold md:text-7xl"
            variants={gridItemVariants}
          >
            Begin Your Journey
          </motion.h1>
          <motion.p
            className="mt-4 text-xl text-muted-foreground"
            variants={gridItemVariants}
          >
            Master the core pillars of quantitative finance and data science.
          </motion.p>
        </header>

        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={gridContainerVariants}
        >
          {gridItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                variants={gridItemVariants}
                whileHover={{
                  scale: 1.03,
                  borderColor: 'hsl(var(--secondary))',
                  boxShadow: '0 0 25px hsl(var(--secondary) / 0.2)',
                  transition: { duration: 0.2, ease: 'easeOut' },
                }}
                className="relative cursor-pointer overflow-hidden rounded-lg border-2 border-border bg-card p-6 text-left"
              >
                {item.background}
                <div className="relative z-10">
                  <div className="mb-4">
                    <Icon className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="font-headline text-2xl font-bold">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
        <motion.footer className="mt-12" variants={footerVariants}>
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 20px hsl(var(--primary) / 0.5)',
            }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-headline text-lg font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all"
          >
            Launch Terminal <ArrowRight />
          </motion.button>
        </motion.footer>
      </motion.div>
    </div>
  );
}
