"use client";

import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Calculator,
  Code,
  Cpu,
  LineChart,
  Pyramid,
  Sigma,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, Suspense, lazy } from 'react';

// Dynamically import the 3D visual component to ensure it's client-only
const LinearAlgebraVisual = lazy(() => import('@/components/homepage/LinearAlgebraVisual'));

const GridPanel = ({
  className,
  children,
  onHoverStart,
  onHoverEnd,
}: {
  className?: string;
  children: React.ReactNode;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
}) => (
  <motion.div
    onHoverStart={onHoverStart}
    onHoverEnd={onHoverEnd}
    variants={gridItemVariants}
    whileHover={{
      scale: 1.02,
      borderColor: 'hsl(var(--primary))',
      boxShadow: '0 0 15px hsl(var(--primary) / 0.5)',
      transition: { duration: 0.3 },
    }}
    className="relative rounded-lg border border-transparent"
  >
    <Card
      className={`h-full overflow-hidden backdrop-blur-sm transition-all duration-300 ease-in-out hover:bg-card/80 ${className}`}
    >
      {children}
    </Card>
  </motion.div>
);

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

export default function Home() {
  const [isLinearAlgebraHovered, setIsLinearAlgebraHovered] = useState(false);

  return (
    <main className="min-h-screen w-full bg-background font-mono text-foreground">
      <div className="container mx-auto p-4 md:p-8">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LineChart className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">
              StatSpark
            </h1>
          </div>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Launch Terminal <ArrowRight className="ml-2" />
          </Button>
        </header>

        <motion.div
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6"
          variants={gridContainerVariants}
          initial="hidden"
          animate="show"
        >
          <div className="md:col-span-1 lg:col-span-2">
            <GridPanel
              onHoverStart={() => setIsLinearAlgebraHovered(true)}
              onHoverEnd={() => setIsLinearAlgebraHovered(false)}
            >
              <div className="absolute inset-0 z-0">
                <AnimatePresence>
                  {isLinearAlgebraHovered && (
                     <Suspense fallback={null}>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.5 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          className="h-full w-full"
                        >
                          <LinearAlgebraVisual />
                        </motion.div>
                     </Suspense>
                  )}
                </AnimatePresence>
              </div>
              <CardHeader className="z-10">
                <CardTitle className="flex items-center gap-2">
                  <Pyramid className="text-primary" />
                  Linear Algebra
                </CardTitle>
              </CardHeader>
              <CardContent className="z-10">
                <p className="text-sm text-muted-foreground">
                  Vectors, matrices, and tensors. The language of data.
                </p>
              </CardContent>
            </GridPanel>
          </div>

          <div className="md:col-span-1 lg:col-span-2">
            <GridPanel>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sigma className="text-primary" />
                  Statistics & Probability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Quantifying uncertainty and making sense of distributions.
                </p>
              </CardContent>
            </GridPanel>
          </div>

          <div className="md:col-span-1 lg:col-span-2">
            <GridPanel>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="text-primary" />
                  Python for Quants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  NumPy, Pandas, SciPy. The tools of the trade.
                </p>
              </CardContent>
            </GridPanel>
          </div>

          <div className="md:col-span-1 lg:col-span-2">
            <GridPanel>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="text-primary" />
                  Time Series Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  ARIMA, GARCH, and forecasting market movements.
                </p>
              </CardContent>
            </GridPanel>
          </div>

          <div className="md:col-span-1 lg:col-span-2">
            <GridPanel>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="text-primary" />
                  Machine Learning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Building predictive models for financial markets.
                </p>
              </CardContent>
            </GridPanel>
          </div>

          <div className="md:col-span-1 lg:col-span-2">
            <GridPanel>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="text-primary" />
                  Algorithmic Trading
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  From strategy backtesting to live deployment.
                </p>
              </CardContent>
            </GridPanel>
          </div>
        </motion.div>
      </div>
      <footer className="fixed bottom-0 left-0 right-0 border-t border-border/50 bg-background/80 p-2 text-center text-xs text-muted-foreground backdrop-blur-sm">
        SYSTEM.NORMAL | Connection secure | Latency: 12ms
      </footer>
    </main>
  );
}