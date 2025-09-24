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
            ease: "easeOut"
        }
    }
}

const CardBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden rounded-lg">
    {Array.from({ length: 3 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute h-40 w-40 rounded-full bg-secondary/5 opacity-50"
        initial={{
          x: `${Math.random() * 100}%`,
          y: `${Math.random() * 100}%`,
        }}
        animate={{
          x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
          y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: Math.random() * 10 + 10,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />
    ))}
  </div>
);


export default function ModuleGrid() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#0D1117] p-4 md:p-8">
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
            className="mt-4 text-xl text-[#8B949E]"
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
                className="relative cursor-pointer overflow-hidden rounded-lg border-2 border-[#21262d] bg-[#161B22] p-6 text-left"
              >
                <CardBackground />
                <div className="relative z-10">
                    <div className="mb-4">
                        <Icon className="h-8 w-8 text-secondary" />
                    </div>
                    <h3 className="font-headline text-2xl font-bold">
                        {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-[#8B949E]">
                        {item.description}
                    </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
         <motion.footer 
            className="mt-12"
            variants={footerVariants}
        >
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px hsl(var(--primary) / 0.5)" }}
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
