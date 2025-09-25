'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  LineChart,
} from 'recharts';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, FileWarning, Play, Sigma, RefreshCw } from 'lucide-react';
import {
  randomNormal,
  randomLogNormal,
  randomUniform,
  randomBates,
  randomExponential,
} from 'd3-random';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

type DistributionShape =
  | 'normal'
  | 'uniform'
  | 'positive-skew'
  | 'negative-skew'
  | 'bimodal';

interface LabState {
  populationData: number[];
  sampleMeans: number[];
  populationMean: number;
  populationStdDev: number;
  meanOfSampleMeans: number;
  stdDevOfSampleMeans: number;
  binnedPopulation: { x: number; y: number }[];
  binnedSampleMeans: { x: number; y: number }[];
}

const generatePopulationData = (
  shape: DistributionShape,
  size: number
): number[] => {
  let data: number[] = [];
  switch (shape) {
    case 'normal':
      const normalGenerator = randomNormal(50, 15);
      data = Array.from({ length: size }, normalGenerator);
      break;
    case 'uniform':
      const uniformGenerator = randomUniform(0, 100);
      data = Array.from({ length: size }, uniformGenerator);
      break;
    case 'positive-skew':
      const logNormalGenerator = randomLogNormal(Math.log(30), 0.7);
      data = Array.from({ length: size }, logNormalGenerator);
      break;
    case 'negative-skew':
      const negLogNormalGenerator = randomLogNormal(Math.log(30), 0.7);
      data = Array.from({ length: size }, () => 100 - negLogNormalGenerator());
      break;
    case 'bimodal':
      const normal1 = randomNormal(30, 8);
      const normal2 = randomNormal(70, 8);
      data = Array.from({ length: size / 2 }, normal1).concat(
        Array.from({ length: size / 2 }, normal2)
      );
      break;
  }
  return data.filter((d) => !isNaN(d) && d >= 0 && d <= 100);
};

const calculateMean = (data: number[]) =>
  data.reduce((a, b) => a + b, 0) / data.length;

const calculateStdDev = (data: number[], mean: number) =>
  Math.sqrt(
    data.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / (data.length - 1)
  );

const binData = (data: number[], binWidth: number) => {
  if (!data || data.length === 0) return [];

  const bins: { [key: number]: number } = {};
  const min = 0;
  const max = 100;

  for (let i = min; i <= max; i += binWidth) {
    bins[i] = 0;
  }

  data.forEach((val) => {
    if (val >= min && val <= max) {
      const binStart = Math.floor(val / binWidth) * binWidth;
      bins[binStart]++;
    }
  });

  return Object.entries(bins).map(([x, y]) => ({
    x: Number(x) + binWidth / 2,
    y: (y / data.length) * 100, // as percentage
  }));
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background/90 p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Range
            </span>
            <span className="font-bold text-foreground">
              {label.toFixed(1)} - {(label + 2.5).toFixed(1)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Frequency
            </span>
            <span className="font-bold text-foreground">
              {payload[0].value.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const ChartCard = ({
  title,
  description,
  data,
  mean,
  stdDev,
  isPopulation = false,
}: {
  title: string;
  description: string;
  data: { x: number; y: number }[];
  mean: number;
  stdDev: number;
  isPopulation?: boolean;
}) => {
  const yMax = useMemo(() => {
    if (!data || data.length === 0) return 10;
    const maxVal = Math.max(...data.map((d) => d.y));
    return Math.ceil(maxVal / 5) * 5 + 5;
  }, [data]);

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ResponsiveContainer width="100%" height={250}>
          {data && data.length > 0 ? (
            <BarChart data={data} barCategoryGap="0%" barGap={0}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="x"
                type="number"
                domain={[0, 100]}
                tickCount={11}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, yMax]}
                unit="%"
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--primary) / 0.1)' }} />
              <Bar dataKey="y" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              {mean && (
                <ReferenceLine
                  x={mean}
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
              )}
            </BarChart>
          ) : (
            <div className="flex h-full items-center justify-center">
              <Skeleton className="h-full w-full" />
            </div>
          )}
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">{isPopulation ? 'μ' : 'x̄'}</p>
            <p className="font-headline text-2xl font-bold">
              {mean.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{isPopulation ? 'σ' : 's'}</p>
            <p className="font-headline text-2xl font-bold">
              {stdDev.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function CltDiscoveryLab() {
  const [shape, setShape] = useState<DistributionShape>('normal');
  const [sampleSize, setSampleSize] = useState(30);
  const [numSamples, setNumSamples] = useState(1000);
  const [labState, setLabState] = useState<LabState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [runId, setRunId] = useState(0); // Used to trigger simulation runs

  const runSimulation = useCallback(() => {
    setIsLoading(true);
    setError(null);
    try {
      const popData = generatePopulationData(shape, 10000);
      if (popData.length === 0) throw new Error("Failed to generate valid population data.");

      const sMeans: number[] = [];
      for (let i = 0; i < numSamples; i++) {
        const sample: number[] = [];
        for (let j = 0; j < sampleSize; j++) {
          sample.push(popData[Math.floor(Math.random() * popData.length)]);
        }
        sMeans.push(calculateMean(sample));
      }

      const popMean = calculateMean(popData);
      const popStdDev = calculateStdDev(popData, popMean);
      const meanOfSMeans = calculateMean(sMeans);
      const stdDevOfSMeans = calculateStdDev(sMeans, meanOfSMeans);
      const binWidth = 2.5;

      setLabState({
        populationData: popData,
        sampleMeans: sMeans,
        populationMean: popMean,
        populationStdDev: popStdDev,
        meanOfSampleMeans: meanOfSMeans,
        stdDevOfSampleMeans: stdDevOfSMeans,
        binnedPopulation: binData(popData, binWidth),
        binnedSampleMeans: binData(sMeans, binWidth),
      });
    } catch (e: any) {
      console.error(e);
      setError(e.message || "An unexpected error occurred during the simulation.");
    } finally {
      setIsLoading(false);
    }
  }, [shape, sampleSize, numSamples]);

  useEffect(() => {
    runSimulation();
  }, [runId, runSimulation]);

  const handleRunClick = () => {
    setRunId(prev => prev + 1);
  };
  
  const expectedStdError = useMemo(() => {
    if (!labState) return 0;
    return labState.populationStdDev / Math.sqrt(sampleSize);
  }, [labState, sampleSize]);

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-4 text-center">
        <h1 className="font-headline text-5xl font-bold tracking-tight">
          The Central Limit Theorem: Discovery Lab
        </h1>
        <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
          See the Central Limit Theorem in action. Observe how the distribution
          of sample means approaches a normal distribution, regardless of the
          population's shape.
        </p>
      </div>

      <motion.div
        layout
        className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-4"
      >
        {/* Controls */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Experiment Controls</CardTitle>
            <CardDescription>Adjust parameters and run the simulation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Population Shape</label>
              <Select value={shape} onValueChange={(v) => setShape(v as DistributionShape)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select shape" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="uniform">Uniform</SelectItem>
                  <SelectItem value="positive-skew">Skewed (Right)</SelectItem>
                  <SelectItem value="negative-skew">Skewed (Left)</SelectItem>
                  <SelectItem value="bimodal">Bimodal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="sample-size" className="flex justify-between text-sm font-medium">
                <span>Sample Size (n)</span>
                <span className="font-bold">{sampleSize}</span>
              </label>
              <Slider
                id="sample-size"
                min={2}
                max={500}
                step={1}
                value={[sampleSize]}
                onValueChange={(v) => setSampleSize(v[0])}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="num-samples" className="flex justify-between text-sm font-medium">
                <span>Number of Samples</span>
                <span className="font-bold">{numSamples}</span>
              </label>
              <Slider
                id="num-samples"
                min={100}
                max={10000}
                step={100}
                value={[numSamples]}
                onValueChange={(v) => setNumSamples(v[0])}
              />
            </div>
            <Button onClick={handleRunClick} className="w-full" disabled={isLoading}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={isLoading ? "loading" : "ready"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center gap-2"
                >
                  {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                  {isLoading ? 'Running...' : 'Run Simulation'}
                </motion.span>
              </AnimatePresence>
            </Button>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="space-y-6 lg:col-span-3">
          {error && (
             <Alert variant="destructive">
               <AlertCircle className="h-4 w-4" />
               <AlertTitle>Simulation Error</AlertTitle>
               <AlertDescription>
                 {error} Please try adjusting the parameters or running the simulation again.
               </AlertDescription>
             </Alert>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={runId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="grid grid-cols-1 gap-6 md:grid-cols-2"
            >
              <ChartCard
                title="Population Distribution"
                description="The underlying distribution from which samples are drawn."
                data={labState?.binnedPopulation ?? []}
                mean={labState?.populationMean ?? 0}
                stdDev={labState?.populationStdDev ?? 0}
                isPopulation
              />

              <ChartCard
                title="Distribution of Sample Means"
                description={`The resulting distribution from ${numSamples} samples of size ${sampleSize}.`}
                data={labState?.binnedSampleMeans ?? []}
                mean={labState?.meanOfSampleMeans ?? 0}
                stdDev={labState?.stdDevOfSampleMeans ?? 0}
              />
            </motion.div>
          </AnimatePresence>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sigma className="h-6 w-6 text-primary" />
                CLT Insights
              </CardTitle>
              <CardDescription>
                Comparing theoretical predictions with simulation results.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {labState ? (
                <div className="grid grid-cols-1 gap-4 text-center md:grid-cols-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Population Mean (μ)</p>
                      <p className="font-headline text-2xl font-bold">{labState.populationMean.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Mean of Sample Means (x̄)</p>
                      <p className="font-headline text-2xl font-bold">{labState.meanOfSampleMeans.toFixed(2)}</p>
                    </div>
                    <div>
                       <p className="text-sm text-muted-foreground">Difference</p>
                      <p className={`font-headline text-2xl font-bold ${Math.abs(labState.populationMean - labState.meanOfSampleMeans) < 0.5 ? 'text-green-400' : 'text-amber-400'}`}>
                        {Math.abs(labState.populationMean - labState.meanOfSampleMeans).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Theoretical Std. Error (σ/√n)</p>
                      <p className="font-headline text-2xl font-bold">{expectedStdError.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Actual Std. Error (s<sub className="text-xs">x̄</sub>)</p>
                      <p className="font-headline text-2xl font-bold">{labState.stdDevOfSampleMeans.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Difference</p>
                      <p className={`font-headline text-2xl font-bold ${Math.abs(expectedStdError - labState.stdDevOfSampleMeans) < 0.5 ? 'text-green-400' : 'text-amber-400'}`}>
                        {Math.abs(expectedStdError - labState.stdDevOfSampleMeans).toFixed(2)}
                      </p>
                    </div>
                </div>
              ) : (
                 <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                 </div>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
