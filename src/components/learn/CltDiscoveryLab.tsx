
'use client';

import { randomLogNormal, randomNormal } from 'd3-random';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Bar,
  BarChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '../ui/switch';

// --- Helper Functions & Types ---

type DistributionShape =
  | 'positive-skew'
  | 'negative-skew'
  | 'bimodal'
  | 'uniform'
  | 'normal';

const generatePopulationData = (
  distribution: DistributionShape,
  count: number,
  mean: number,
  stdDev: number
) => {
  switch (distribution) {
    case 'positive-skew':
      return Array.from({ length: count }, randomLogNormal(mean / 5, stdDev / 2));
    case 'negative-skew':
      return Array.from(
        { length: count },
        () => mean * 2 - randomLogNormal(mean / 5, stdDev / 2)()
      );
    case 'bimodal': {
      const mean1 = mean - stdDev * 1.5;
      const mean2 = mean + stdDev * 1.5;
      const dist1 = Array.from(
        { length: count / 2 },
        randomNormal(mean1, stdDev * 0.6)
      );
      const dist2 = Array.from(
        { length: count / 2 },
        randomNormal(mean2, stdDev * 0.6)
      );
      return [...dist1, ...dist2];
    }
    case 'uniform':
      const range = stdDev * Math.sqrt(12);
      const min = mean - range / 2;
      return Array.from({ length: count }, () => min + Math.random() * range);
    case 'normal':
    default:
      return Array.from({ length: count }, randomNormal(mean, stdDev));
  }
};

const binData = (data: number[] | undefined, numBins: number, domain?: [number, number]) => {
  if (!data || data.length === 0) return [];

  let [min, max] = domain || [Math.min(...data), Math.max(...data)];

  // For skewed data, we might want to cap the max to avoid extreme outliers distorting the view
  if (!domain) {
      const sortedData = [...data].sort((a, b) => a - b);
      const p99 = sortedData[Math.floor(0.99 * sortedData.length)];
      if (max > p99 * 1.5) {
          max = p99;
      }
      const p1 = sortedData[Math.floor(0.01 * sortedData.length)];
       if (min < p1 * 1.5) {
        min = p1;
      }
  }


  if (min === max) {
    min = min - 1;
    max = max + 1;
  }

  const binSize = (max - min) / numBins;
  if (binSize <= 0) return [];

  const bins = Array.from({ length: numBins }, (_, i) => ({
    name: (min + i * binSize).toFixed(2),
    value: 0,
    x0: min + i * binSize,
    x1: min + (i + 1) * binSize,
  }));

  for (const d of data) {
    if (d >= min && d <= max) {
      const binIndex = Math.min(
        Math.floor((d - min) / binSize),
        numBins - 1
      );
      if (bins[binIndex]) {
        bins[binIndex].value++;
      }
    }
  }
  return bins;
};

// --- Custom Hooks for Logic Separation ---

function usePopulationControls() {
  const [shape, setShape] = useState<DistributionShape>('positive-skew');
  const [mean, setMean] = useState(6);
  const [stdDev, setStdDev] = useState(1.5);
  const [isPopulationLoading, setIsLoading] = useState(true);
  const [populationData, setPopulationData] = useState<number[]>([]);

  const reset = useCallback(() => {
    setShape('positive-skew');
    setMean(6);
    setStdDev(1.5);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const data = generatePopulationData(shape, 20000, mean, stdDev);
    setPopulationData(data);
    setIsLoading(false);
  }, [shape, mean, stdDev]);
  
  const { populationMean, populationStdDev } = useMemo(() => {
      if (!populationData || populationData.length === 0) return { populationMean: 0, populationStdDev: 0 };
      const mean = populationData.reduce((a,b) => a+b, 0) / populationData.length;
      const variance = populationData.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / populationData.length;
      const stdDev = Math.sqrt(variance);
      return { populationMean: mean, populationStdDev: stdDev };
  }, [populationData]);

  return {
    shape,
    setShape,
    mean,
    setMean,
    stdDev,
    setStdDev,
    isPopulationLoading,
    populationData,
    populationMean,
    populationStdDev,
    reset,
  };
}

function useSimulation(populationData: number[]) {
  const [sampleSize, setSampleSize] = useState(30);
  const [numSamples, setNumSamples] = useState(5000);
  const [sampleMeans, setSampleMeans] = useState<number[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const simulationRef = useRef<{ stop: boolean; id?: number }>({ stop: false });

  const runSimulation = useCallback(() => {
    if (isSimulating || populationData.length === 0) return;

    simulationRef.current.stop = false;
    setSampleMeans([]);
    setIsSimulating(true);

    let means: number[] = [];
    const totalBatches = 100;
    const batchSize = Math.ceil(numSamples / totalBatches);
    let currentBatch = 0;

    const simulationStep = () => {
      if (simulationRef.current.stop || currentBatch >= totalBatches) {
        setIsSimulating(false);
        if (simulationRef.current.id) {
          cancelAnimationFrame(simulationRef.current.id);
          simulationRef.current.id = undefined;
        }
        return;
      }

      const batchMeans = Array.from({ length: batchSize }, () => {
        const sample = Array.from(
          { length: sampleSize },
          () => populationData[Math.floor(Math.random() * populationData.length)]
        );
        return sample.reduce((a, b) => a + b, 0) / sampleSize;
      });

      means = [...means, ...batchMeans];
      setSampleMeans(means);

      currentBatch++;
      simulationRef.current.id = requestAnimationFrame(simulationStep);
    };

    simulationRef.current.id = requestAnimationFrame(simulationStep);
  }, [sampleSize, numSamples, populationData, isSimulating]);

  const stopAndClear = useCallback(() => {
    simulationRef.current.stop = true;
    if (simulationRef.current.id) {
      cancelAnimationFrame(simulationRef.current.id);
      simulationRef.current.id = undefined;
    }
    setIsSimulating(false);
    setSampleMeans([]);
  }, []);

  return {
    sampleSize,
    setSampleSize,
    numSamples,
    setNumSamples,
    sampleMeans,
    isSimulating,
    runSimulation,
    stopAndClear,
  };
}

// --- Analysis & Charting Components ---

const AnalysisStat = ({
  label,
  value,
  theoreticalValue,
}: {
  label: string;
  value: number;
  theoreticalValue?: number;
}) => (
  <div className="flex items-baseline justify-between text-sm">
    <p className="text-muted-foreground">{label}</p>
    <div className="flex items-baseline gap-2 font-mono">
      {theoreticalValue !== undefined && (
        <p
          className="text-xs text-muted-foreground/80"
          title="Theoretical Value"
        >
          ({theoreticalValue.toFixed(3)})
        </p>
      )}
      <p className="font-bold text-foreground">{value.toFixed(3)}</p>
    </div>
  </div>
);

const PopulationChart = ({ data, mean, stdDev, isLoading }: { data: number[], mean: number, stdDev: number, isLoading: boolean }) => {
    const binnedData = useMemo(() => binData(data, 50), [data]);
    return (
        <Card>
            <CardHeader>
                <CardTitle>Population Distribution</CardTitle>
                <CardDescription>
                    μ = {mean.toFixed(2)}, σ = {stdDev.toFixed(2)}
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[200px] pr-4">
                {isLoading ? (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        Loading Population...
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={binnedData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => Number(value).toFixed(1)} />
                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => (v > 0 ? v : '')} width={30} />
                            <Bar dataKey="value" fill="hsl(var(--secondary))" radius={[2, 2, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}

const SampleMeansChart = ({ sampleMeans, theoreticalMean, theoreticalStdDev, showTheoreticalCurve, isSimulating }: { sampleMeans: number[], theoreticalMean: number, theoreticalStdDev: number, showTheoreticalCurve: boolean, isSimulating: boolean }) => {
    const binnedData = useMemo(() => binData(sampleMeans, 40), [sampleMeans]);
    const { simulatedMean, simulatedStdDev } = useMemo(() => {
        if (!sampleMeans || sampleMeans.length < 2) return { simulatedMean: 0, simulatedStdDev: 0 };
        const mean = sampleMeans.reduce((a, b) => a + b, 0) / sampleMeans.length;
        const variance = sampleMeans.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / sampleMeans.length;
        return { simulatedMean: mean, simulatedStdDev: Math.sqrt(variance) };
      }, [sampleMeans]);
      
    const normalPDF = (x: number, mean: number, stdDev: number) => {
        if (stdDev <= 0) return 0;
        return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
    };

    const theoreticalCurveData = useMemo(() => {
      if (!binnedData.length || !sampleMeans.length || !theoreticalStdDev) return [];
      const scale = sampleMeans.length * (binnedData[0].x1 - binnedData[0].x0);
      return binnedData.map(bin => ({
          x: bin.x0 + (bin.x1 - bin.x0)/2,
          y: normalPDF(bin.x0 + (bin.x1 - bin.x0)/2, theoreticalMean, theoreticalStdDev) * scale
      }));
    }, [binnedData, theoreticalMean, theoreticalStdDev, sampleMeans.length]);

    const showAnalysis = sampleMeans.length > 1;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Distribution of Sample Averages</CardTitle>
                <AnimatePresence>
                    {showAnalysis && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                            <CardDescription>
                                Analysis of {sampleMeans.length.toLocaleString()} sample averages.
                            </CardDescription>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardHeader>
            <CardContent className="h-[300px] pl-2 pr-6">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={binnedData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                        <XAxis dataKey="name" type="number" domain={['dataMin', 'dataMax']} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => Number(value).toFixed(1)} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} width={40} tickFormatter={(v) => (v > 0 ? v : '')} />
                        <Tooltip
                            cursor={{ fill: 'hsla(var(--muted) / 0.1)' }}
                            contentStyle={{
                                background: 'hsl(var(--background))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: 'var(--radius)',
                            }}
                        />
                        <Bar dataKey="value" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} maxBarSize={40} animationDuration={isSimulating ? 0 : 300} />

                        {showTheoreticalCurve && theoreticalCurveData.length > 0 && theoreticalMean > 0 && (
                            <ReferenceLine x={theoreticalMean} stroke="hsl(var(--accent))" strokeDasharray="3 3" strokeWidth={2} label={{ value: 'μ', fill: 'hsl(var(--accent))', position: 'insideTop' }} />
                        )}
                        {showTheoreticalCurve && theoreticalCurveData.length > 1 && (
                            <Line type="monotone" dataKey="y" data={theoreticalCurveData} stroke="hsl(var(--accent))" strokeWidth={2} dot={false} animationDuration={300} />
                        )}
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
            <AnimatePresence>
                {showAnalysis && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto', transition: { delay: 0.3 } }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <CardContent className="border-t pt-4 space-y-2">
                            <AnalysisStat label="Simulated Mean" value={simulatedMean} theoreticalValue={theoreticalMean} />
                            <AnalysisStat label="Simulated Std. Error" value={simulatedStdDev} theoreticalValue={theoreticalStdDev} />
                        </CardContent>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
};


// --- Main Component ---

export default function CltDiscoveryLab() {
  const [showTheoretical, setShowTheoretical] = useState(false);

  const {
    shape,
    setShape,
    mean,
    setMean,
    stdDev,
    setStdDev,
isPopulationLoading,
    populationData,
    populationMean,
    populationStdDev,
  } = usePopulationControls();

  const {
    sampleSize,
    setSampleSize,
    numSamples,
    setNumSamples,
    sampleMeans,
    isSimulating,
    runSimulation,
    stopAndClear,
  } = useSimulation(populationData);

  const theoreticalStdErr = populationStdDev / Math.sqrt(sampleSize);

  const handlePopulationParamChange = <T,>(setter: React.Dispatch<React.SetStateAction<T>>) => (values: number[]) => {
      stopAndClear();
      setter(values[0] as T);
  };
  
  const handleSimulationParamChange = <T,>(setter: React.Dispatch<React.SetStateAction<T>>) => (values: number[]) => {
      stopAndClear();
      setter(values[0] as T);
  };
  
  const handlePopulationShapeChange = (newShape: DistributionShape) => {
      stopAndClear();
      setShape(newShape);
  }

  return (
    <div className="w-full space-y-8 p-4 md:p-8">
      <div className="text-center">
        <h2 className="font-headline text-4xl text-primary md:text-5xl">
          The Discovery Lab
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-muted-foreground">
          From chaos comes order. Change the population, adjust the sample
          size, and see how the Central Limit Theorem works its magic every
          time.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* === CONTROLS === */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>The Laboratory</CardTitle>
              <CardDescription>The engine of discovery.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <div>
                <Label>Population Shape</Label>
                <Select
                  value={shape}
                  onValueChange={handlePopulationShapeChange}
                  disabled={isSimulating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="positive-skew">Skewed (Positive)</SelectItem>
                    <SelectItem value="negative-skew">Skewed (Negative)</SelectItem>
                    <SelectItem value="bimodal">Bimodal</SelectItem>
                    <SelectItem value="uniform">Uniform</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Population Mean: {mean}</Label>
                <Slider value={[mean]} onValueChange={handlePopulationParamChange(setMean)} min={0} max={12} step={0.5} disabled={isSimulating}/>
              </div>
              <div>
                <Label>Population Std. Dev: {stdDev.toFixed(1)}</Label>
                <Slider value={[stdDev]} onValueChange={handlePopulationParamChange(setStdDev)} min={0.5} max={5} step={0.1} disabled={isSimulating} />
              </div>
              <div>
                <Label>Sample Size: {sampleSize}</Label>
                <Slider value={[sampleSize]} onValueChange={handleSimulationParamChange(setSampleSize)} min={2} max={200} step={1} disabled={isSimulating} />
              </div>
              <div>
                <Label>Number of Samples: {numSamples.toLocaleString()}</Label>
                <Slider value={[numSamples]} onValueChange={handleSimulationParamChange(setNumSamples)} min={100} max={20000} step={100} disabled={isSimulating}/>
              </div>

              <div className="space-y-2 pt-2">
                <Button onClick={runSimulation} disabled={isSimulating} className="w-full">
                  {isSimulating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Simulating...
                    </>
                  ) : (
                    'Run New Simulation'
                  )}
                </Button>
                <Button onClick={stopAndClear} className="w-full" variant="outline">
                  Reset
                </Button>
              </div>

              <div className="flex items-center space-x-2 pt-4">
                <Switch id="theoretical-curve" checked={showTheoretical} onCheckedChange={setShowTheoretical}/>
                <Label htmlFor="theoretical-curve">Show Theoretical Curve</Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* === VISUALIZATIONS === */}
        <div className="space-y-8 lg:col-span-2">
          <PopulationChart data={populationData} mean={populationMean} stdDev={populationStdDev} isLoading={isPopulationLoading} />
          <SampleMeansChart sampleMeans={sampleMeans} theoreticalMean={populationMean} theoreticalStdDev={theoreticalStdErr} showTheoreticalCurve={showTheoretical} isSimulating={isSimulating}/>
        </div>
      </div>
    </div>
  );
}
