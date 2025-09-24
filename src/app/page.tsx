"use client";

import {
  ArrowRight,
  Code,
  LineChart,
  Target,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
          <div className="text-right text-xs text-muted-foreground">
            <p>Market Status: OPEN</p>
            <p>Last Sync: 12:34:56.789 GMT-4</p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 lg:grid-cols-6">
          <GridPanel className="md:col-span-4 lg:col-span-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <Target className="text-primary" />
                Mission Control
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h2 className="font-headline text-4xl font-bold text-foreground md:text-5xl">
                Your Intuition Engine
              </h2>
              <p className="mt-4 max-w-xl text-lg text-muted-foreground">
                From data chaos to predictive clarity. StatSpark is a toolkit for quants to develop, test, and deploy complex models with unparalleled speed.
              </p>
              <Button size="lg" className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
                Launch Analysis <ArrowRight className="ml-2" />
              </Button>
            </CardContent>
          </GridPanel>

          <GridPanel className="md:col-span-2 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="text-primary" />
                AlphaStream
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Live signals and model performance metrics.
              </p>
              <div className="mt-4 space-y-2 text-xs">
                <p><span className="text-green-400">[SIG_BUY]</span> MODEL_A / SPY @ 548.75</p>
                <p><span className="text-red-400">[SIG_SELL]</span> MODEL_B / BTC @ 68123.45</p>
                <p><span className="text-green-400">[INFO]</span> MODEL_C P/L: +2.1%</p>
              </div>
            </CardContent>
          </GridPanel>

          <GridPanel className="md:col-span-2 lg:col-span-3">
             <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="text-primary" />
                Strategy Backtester
              </CardTitle>
            </CardHeader>
            <CardContent>
               <p className="text-sm text-muted-foreground">
                Define and run historical performance tests on your models.
              </p>
              <Button variant="outline" className="mt-4">
                Open Backtester
              </Button>
            </CardContent>
          </GridPanel>

          <GridPanel className="md:col-span-2 lg:col-span-3">
             <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="text-primary" />
                Portfolio Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
               <p className="text-sm text-muted-foreground">
                Visualize risk, return, and attribution across all strategies.
              </p>
               <Button variant="outline" className="mt-4">
                View Dashboard
              </Button>
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
