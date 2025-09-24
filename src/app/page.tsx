"use client";

import { motion } from 'framer-motion';
import {
  ArrowRight,
  Calculator,
  Code,
  Cpu,
  LineChart,
  Orbit,
  Sigma,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const GridPanel = ({
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      variants={gridItemVariants}
      whileHover={{
        scale: 1.02,
        borderColor: 'hsl(var(--primary))',
        boxShadow: '0 0 20px hsl(var(--primary) / 0.4)',
        transition: { duration: 0.3 },
      }}
      className="relative rounded-lg border-2 border-transparent h-full"
    >
      <Card
        className={`h-full overflow-hidden backdrop-blur-sm transition-all duration-300 ease-in-out hover:bg-card/80`}
      >
        {children}
      </Card>
    </motion.div>
  );
};

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

const AnimatedIcon = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      variants={{
        initial: { scale: 1, rotate: 0 },
        hover: { scale: 1.1, rotate: 5 },
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 10 }}
    >
      {children}
    </motion.div>
  );
};


export default function Home() {
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
          <motion.div
            className="md:col-span-1 lg:col-span-2"
            variants={gridItemVariants}
            initial="initial"
            whileHover="hover"
          >
            <GridPanel>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AnimatedIcon>
                    <Orbit className="text-primary" />
                  </AnimatedIcon>
                  Linear Algebra
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Vectors, matrices, and tensors. The language of data.
                </p>
              </CardContent>
            </GridPanel>
          </motion.div>

          <motion.div
            className="md:col-span-1 lg:col-span-2"
            variants={gridItemVariants}
            initial="initial"
            whileHover="hover"
          >
            <GridPanel>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                   <AnimatedIcon>
                    <Sigma className="text-primary" />
                  </AnimatedIcon>
                  Statistics & Probability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Quantifying uncertainty and making sense of distributions.
                </p>
              </CardContent>
            </GridPanel>
          </motion.div>

          <motion.div
            className="md:col-span-1 lg:col-span-2"
            variants={gridItemVariants}
            initial="initial"
            whileHover="hover"
          >
            <GridPanel>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AnimatedIcon>
                    <Code className="text-primary" />
                  </AnimatedIcon>
                  Python for Quants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  NumPy, Pandas, SciPy. The tools of the trade.
                </p>
              </CardContent>
            </GridPanel>
          </motion.div>

          <motion.div
            className="md:col-span-1 lg:col-span-2"
            variants={gridItemVariants}
            initial="initial"
            whileHover="hover"
          >
            <GridPanel>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AnimatedIcon>
                    <TrendingUp className="text-primary" />
                  </AnimatedIcon>
                  Time Series Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  ARIMA, GARCH, and forecasting market movements.
                </p>
              </CardContent>
            </GridPanel>
          </motion.div>

          <motion.div
            className="md:col-span-1 lg:col-span-2"
            variants={gridItemVariants}
            initial="initial"
            whileHover="hover"
          >
            <GridPanel>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AnimatedIcon>
                    <Cpu className="text-primary" />
                  </AnimatedIcon>
                  Machine Learning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Building predictive models for financial markets.
                </p>
              </CardContent>
            </GridPanel>
          </motion.div>

          <motion.div
            className="md:col-span-1 lg:col-span-2"
            variants={gridItemVariants}
            initial="initial"
            whileHover="hover"
          >
            <GridPanel>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AnimatedIcon>
                    <Calculator className="text-primary" />
                  </AnimatedIcon>
                  Algorithmic Trading
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  From strategy backtesting to live deployment.
                </p>
              </CardContent>
            </GridPanel>
          </motion.div>
        </motion.div>
      </div>
      <footer className="fixed bottom-0 left-0 right-0 border-t border-border/50 bg-background/80 p-2 text-center text-xs text-muted-foreground backdrop-blur-sm">
        SYSTEM.NORMAL | Connection secure | Latency: 12ms
      </footer>
    </main>
  );
}
