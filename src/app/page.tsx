"use client";

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
import { Skeleton } from '@/components/ui/skeleton';


const GridPanel = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <Card
    className={`flex flex-col justify-between overflow-hidden backdrop-blur-sm transition-all duration-300 ease-in-out hover:bg-card/80 hover:shadow-2xl hover:shadow-primary/10 ${className}`}
  >
    {children}
  </Card>
);

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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
          <GridPanel className="relative md:col-span-1 lg:col-span-2">
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

          <GridPanel className="md:col-span-1 lg:col-span-2">
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

          <GridPanel className="md:col-span-1 lg:col-span-2">
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

          <GridPanel className="md:col-span-1 lg:col-span-2">
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
          
          <GridPanel className="md:col-span-1 lg:col-span-2">
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

          <GridPanel className="md:col-span-1 lg:col-span-2">
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
      </div>
      <footer className="fixed bottom-0 left-0 right-0 border-t border-border/50 bg-background/80 p-2 text-center text-xs text-muted-foreground backdrop-blur-sm">
        SYSTEM.NORMAL | Connection secure | Latency: 12ms
      </footer>
    </main>
  );
}
