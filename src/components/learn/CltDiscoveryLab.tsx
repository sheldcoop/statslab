'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Label,
} from 'recharts';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Play, Pause, RefreshCw, Sigma, Waves, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  randomNormal,
  randomExponential,
  randomUniform,
} from 'd3-random';

type DistributionShape =
  | 'normal'
  | 'uniform'
  | 'skewed'
  | 'bimodal';

const DISTRIBUTION_CONFIG = {
  normal: { mean: 50, stdDev: 15 },
  uniform: { min: 0, max: 100 },
  skewed: { lambda: 0.1 },
  bimodal: { mean1: 30, stdDev1: 10, mean2: 70, stdDev2: 10 },
};

const STAT_CARD_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

// --- Data Generation ---

const generatePopulation = (
  shape: DistributionShape,
  size: number
): number[] => {
  let data: number[] = [];
  const config = DISTRIBUTION_CONFIG[shape];

  switch (shape) {
    case 'normal': {
      const generator = randomNormal(config.mean, config.stdDev);
      for (let i = 0; i < size; i++) data.push(generator());
      break;
    }
    case 'uniform': {
      const generator = randomUniform(config.min, config.max);
      for (let i = 0; i < size; i++) data.push(generator());
      break;
    }
    case 'skewed': {
      const generator = randomExponential(config.lambda);
      // Scale and invert to create a right-skewed distribution
      for (let i = 0; i < size; i++) data.push(100 - generator() * 10);
      break;
    }
    case 'bimodal': {
      const gen1 = randomNormal(config.mean1, config.stdDev1);
      const gen2 = randomNormal(config.mean2, config.stdDev2);
      for (let i = 0; i < size; i++) {
        data.push(Math.random() < 0.5 ? gen1() : gen2());
      }
      break;
    }
  }
  // Clamp values to a reasonable range [0, 100]
  return data.map(d => Math.max(0, Math.min(100, d)));
};


// --- Helper Functions ---

const calculateMean = (data: number[]): number =>
  data.reduce((a, b) => a + b, 0) / data.length;

const calculateStdDev = (data: number[]): number => {
  const mean = calculateMean(data);
  const sqDiff = data.map(d => Math.pow(d - mean, 2));
  const avgSqDiff = calculateMean(sqDiff);
  return Math.sqrt(avgSqDiff);
};

const binData = (data: number[], numBins: number = 20): { x: number, y: number }[] => {
  if (data.length === 0) return [];
  const min = 0;
  const max = 100;
  const binWidth = (max - min) / numBins;
  const bins = new Array(numBins).fill(0);
  
  for (const val of data) {
    const binIndex = Math.min(
      numBins - 1,
      Math.max(0, Math.floor((val - min) / binWidth))
    );
    bins[binIndex]++;
  }

  return bins.map((count, i) => ({
    x: min + (i + 0.5) * binWidth,
    y: count,
  }));
};

const drawSample = (population: number[], sampleSize: number): number[] => {
  const sample = [];
  for (let i = 0; i < sampleSize; i++) {
    const randomIndex = Math.floor(Math.random() * population.length);
    sample.push(population[randomIndex]);
  }
  return sample;
};

// --- React Components ---

const ChartSkeleton = () => (
  <div className="h-full w-full p-4">
    <Skeleton className="mb-4 h-4 w-1/4" />
    <Skeleton className="h-full w-full" />
  </div>
);

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon: Icon }) => (
  <motion.div variants={STAT_CARD_VARIANTS}>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{typeof value === 'number' ? value.toFixed(2) : value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-md border bg-background/90 p-2 shadow-lg backdrop-blur-sm">
          <p className="font-semibold">{`Value: ${label.toFixed(2)}`}</p>
          <p className="text-sm text-muted-foreground">{`Count: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

export default function CltDiscoveryLab() {
  const [populationShape, setPopulationShape] = useState<DistributionShape>('normal');
  const [population, setPopulation] = useState<number[]>([]);
  const [populationStats, setPopulationStats] = useState({ mean: 0, stdDev: 0 });
  const [isGenerating, setIsGenerating] = useState(true);

  const [sampleSize, setSampleSize] = useState(30);
  const [numSamples, setNumSamples] = useState(1000);
  const [animationSpeed, setAnimationSpeed] = useState(50);
  
  const [sampleMeans, setSampleMeans] = useState<number[]>([]);
  const [isSampling, setIsSampling] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSampleIndex, setCurrentSampleIndex] = useState(0);

  // Generate population when shape changes
  useEffect(() => {
    setIsGenerating(true);
    const newPopulation = generatePopulation(populationShape, 10000);
    setPopulation(newPopulation);
    setPopulationStats({
      mean: calculateMean(newPopulation),
      stdDev: calculateStdDev(newPopulation),
    });
    // Reset sampling when population changes
    setSampleMeans([]);
    setCurrentSampleIndex(0);
    setIsSampling(false);
    setIsPaused(false);
    setIsGenerating(false);
  }, [populationShape]);

  // Main sampling animation loop
  useEffect(() => {
    if (!isSampling || isPaused || population.length === 0) {
      return;
    }

    if (currentSampleIndex >= numSamples) {
      setIsSampling(false);
      return;
    }

    const delay = 1000 / animationSpeed;
    const timeoutId = setTimeout(() => {
      const sample = drawSample(population, sampleSize);
      const sampleMean = calculateMean(sample);
      setSampleMeans(prevMeans => [...prevMeans, sampleMean]);
      setCurrentSampleIndex(prevIndex => prevIndex + 1);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [isSampling, isPaused, currentSampleIndex, numSamples, sampleSize, population, animationSpeed]);

  const handleStartStop = () => {
    if (isSampling && !isPaused) {
      setIsPaused(true); // Pause
    } else if (isSampling && isPaused) {
      setIsPaused(false); // Resume
    } else {
      // Start
      if (currentSampleIndex >= numSamples) {
        setSampleMeans([]);
        setCurrentSampleIndex(0);
      }
      setIsSampling(true);
      setIsPaused(false);
    }
  };

  const handleReset = () => {
    setIsSampling(false);
    setIsPaused(false);
    setSampleMeans([]);
    setCurrentSampleIndex(0);
  };
  
  const binnedPopulation = useMemo(() => binData(population, 40), [population]);
  const binnedSampleMeans = useMemo(() => binData(sampleMeans, 40), [sampleMeans]);

  const samplingDistStats = useMemo(() => {
    if (sampleMeans.length < 2) return { mean: NaN, stdErr: NaN };
    const mean = calculateMean(sampleMeans);
    const stdDev = calculateStdDev(sampleMeans);
    return { mean, stdErr: stdDev };
  }, [sampleMeans]);

  const theoreticalStdErr = useMemo(() => {
    if (populationStats.stdDev === 0 || sampleSize === 0) return NaN;
    return populationStats.stdDev / Math.sqrt(sampleSize);
  }, [populationStats.stdDev, sampleSize]);

  const renderPopulationChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      {isGenerating ? (
        <ChartSkeleton />
      ) : (
        <BarChart data={binnedPopulation} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
          <XAxis dataKey="x" type="number" domain={[0, 100]} tickFormatter={(val) => val.toFixed(0)} />
          <YAxis />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent) / 0.2)' }}/>
          <Bar dataKey="y" fill="hsl(var(--primary))" barSize={20} />
          <ReferenceLine x={populationStats.mean} stroke="hsl(var(--secondary))" strokeWidth={2} strokeDasharray="4 4">
             <Label value="μ" position="insideTopLeft" fill="hsl(var(--secondary))" fontSize={14} />
          </ReferenceLine>
        </BarChart>
      )}
    </ResponsiveContainer>
  );

  const renderSamplingDistChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={binnedSampleMeans} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
        <XAxis dataKey="x" type="number" domain={[0, 100]} tickFormatter={(val) => val.toFixed(0)} />
        <YAxis />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent) / 0.2)' }} />
        <Bar dataKey="y" fill="hsl(var(--accent))" barSize={20} />
        {sampleMeans.length > 1 && (
            <ReferenceLine x={samplingDistStats.mean} stroke="hsl(var(--destructive))" strokeWidth={2} strokeDasharray="4 4">
                <Label value="x̄" position="insideTopLeft" fill="hsl(var(--destructive))" fontSize={14} />
            </ReferenceLine>
        )}
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="font-headline text-4xl font-bold md:text-5xl">Central Limit Theorem Discovery Lab</h1>
        <p className="mt-2 max-w-3xl mx-auto text-muted-foreground">
          See the Central Limit Theorem in action. Observe how the distribution of sample means tends towards a normal distribution, regardless of the population's shape.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* --- Controls --- */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Controls</CardTitle>
            <CardDescription>Adjust the simulation parameters.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Population Shape</Label>
              <Select value={populationShape} onValueChange={(v: DistributionShape) => setPopulationShape(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a shape" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="uniform">Uniform</SelectItem>
                  <SelectItem value="skewed">Skewed</SelectItem>
                  <SelectItem value="bimodal">Bimodal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sample-size">Sample Size (n): {sampleSize}</Label>
              <Slider id="sample-size" min={2} max={500} step={1} value={[sampleSize]} onValueChange={([v]) => setSampleSize(v)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="num-samples">Number of Samples: {numSamples}</Label>
              <Slider id="num-samples" min={100} max={10000} step={100} value={[numSamples]} onValueChange={([v]) => setNumSamples(v)} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="anim-speed">Animation Speed: {animationSpeed}x</Label>
              <Slider id="anim-speed" min={1} max={100} step={1} value={[animationSpeed]} onValueChange={([v]) => setAnimationSpeed(v)} />
            </div>
            <div className="flex items-center gap-2 pt-4">
              <Button onClick={handleStartStop} className="flex-1" size="lg">
                {isSampling && !isPaused ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                {isSampling && !isPaused ? 'Pause' : isPaused ? 'Resume' : 'Start'}
              </Button>
              <Button onClick={handleReset} variant="outline" size="icon" aria-label="Reset">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* --- Main Content --- */}
        <div className="lg:col-span-3">
            <motion.div layout className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} initial="hidden" animate="visible">
                <StatCard title="Population Mean (μ)" value={populationStats.mean} description="The true mean of the population" icon={Sigma} />
                <StatCard title="Population Std Dev (σ)" value={populationStats.stdDev} description="The true spread of the population" icon={Waves} />
                <StatCard title="Sample Means Mean (x̄)" value={!isNaN(samplingDistStats.mean) ? samplingDistStats.mean : 'N/A'} description="Mean of the sample means" icon={X} />
                <StatCard title="Sampling Std Err (s_x̄)" value={!isNaN(samplingDistStats.stdErr) ? samplingDistStats.stdErr : 'N/A'} description="Standard deviation of sample means" icon={AlertCircle} />
            </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Population Distribution</CardTitle>
                <CardDescription>The underlying distribution from which samples are drawn.</CardDescription>
              </CardHeader>
              <CardContent>
                {renderPopulationChart()}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Sampling Distribution of the Mean</CardTitle>
                <CardDescription>The distribution of the means from each sample taken.
                  <span className="block mt-2 font-mono text-xs">Samples Taken: {currentSampleIndex} / {numSamples}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderSamplingDistChart()}
                <div className="mt-4 text-center text-sm text-muted-foreground">
                    <p>Theoretical Std. Error (σ/√n): {!isNaN(theoreticalStdErr) ? theoreticalStdErr.toFixed(2) : 'N/A'}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
