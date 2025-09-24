
'use client';

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '../ui/label';
import { generateDistribution } from '@/ai/flows/statistics-flow';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

// --- Type Definitions ---
type DistributionType = 'normal' | 'uniform' | 'beta' | 'bimodal' | 'positive-skew' | 'negative-skew';

// --- Data Utilities ---
const binData = (
  data: number[],
  numBins: number
): { name: string; value: number; x0: number; x1: number }[] => {
  if (data.length === 0) return [];

  let min = Math.min(...data);
  let max = Math.max(...data);

  if (min === max) {
    min = min - 1;
    max = max + 1;
  }

  const binSize = (max - min) / numBins;
  if (binSize <= 0) {
    return [{ name: min.toFixed(1), value: data.length, x0: min, x1: max }];
  }

  const bins = Array.from({ length: numBins }, (_, i) => ({
    name: (min + i * binSize).toFixed(1),
    value: 0,
    x0: min + i * binSize,
    x1: min + (i + 1) * binSize,
  }));

  for (const d of data) {
    let binIndex = Math.floor((d - min) / binSize);
    if (binIndex >= numBins) binIndex = numBins - 1;
    if (bins[binIndex]) {
      bins[binIndex].value++;
    }
  }
  return bins;
};

const calculateMean = (data: number[]) => data.length > 0 ? data.reduce((a, b) => a + b, 0) / data.length : 0;

const calculateStdDev = (data: number[], mean: number) => {
    if (data.length < 2) return 0;
    const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (data.length - 1);
    return Math.sqrt(variance);
}

// --- Main Component ---
export default function CltDiscoveryLab() {
  // --- State Management ---
  const [distributionType, setDistributionType] = useState<DistributionType>('positive-skew');
  const [populationData, setPopulationData] = useState<number[]>([]);
  const [isLoadingPopulation, setIsLoadingPopulation] = useState(true);

  const [sampleMeans, setSampleMeans] = useState<number[]>([]);
  const [currentAnimatedSample, setCurrentAnimatedSample] = useState<number[]>([]);
  
  const [sampleSize, setSampleSize] = useState(30);
  const [numSamples, setNumSamples] = useState(5000);
  const [simulationSpeed, setSimulationSpeed] = useState(50); // ms per sample

  const [isSimulating, setIsSimulating] = useState(false);
  
  const simulationRef = useRef<NodeJS.Timeout>();

  const [meanParam, setMeanParam] = useState(5);
  const [stdDevParam, setStdDevParam] = useState(2);
  const [alphaParam, setAlphaParam] = useState(2);
  const [betaParam, setBetaParam] = useState(5);


  // --- Data Fetching & Generation ---
  const fetchPopulationData = useCallback(async () => {
    setIsLoadingPopulation(true);
    setSampleMeans([]);
    setCurrentAnimatedSample([]);
    try {
      const { data } = await generateDistribution({
        distribution: distributionType,
        count: 10000,
        mean: meanParam,
        stdDev: stdDevParam,
        alpha: alphaParam,
        beta: betaParam,
      });
      setPopulationData(data);
    } catch (error) {
      console.error("Failed to fetch population data:", error);
    } finally {
      setIsLoadingPopulation(false);
    }
  }, [distributionType, meanParam, stdDevParam, alphaParam, betaParam]);

  useEffect(() => {
    fetchPopulationData();
  }, [fetchPopulationData]);


  // --- Simulation Logic ---
  const runSimulation = useCallback(() => {
    setIsSimulating(true);

    const simulationStep = () => {
        if (populationData.length === 0) {
            setIsSimulating(false);
            return;
        }

        const sample = Array.from({ length: sampleSize }, () => populationData[Math.floor(Math.random() * populationData.length)]);
        const mean = calculateMean(sample);
        
        setCurrentAnimatedSample(sample);
        
        // This functional update is crucial for performance and correctness
        setSampleMeans(prevMeans => {
            const newMeans = [...prevMeans, mean];
            if (newMeans.length >= numSamples) {
                stopSimulation();
                return newMeans.slice(0, numSamples);
            }
            return newMeans;
        });
    };

    simulationRef.current = setInterval(simulationStep, simulationSpeed);
  }, [populationData, sampleSize, numSamples, simulationSpeed]);

  const stopSimulation = () => {
      setIsSimulating(false);
      if(simulationRef.current) {
        clearInterval(simulationRef.current);
      }
  }
  
  const handleSimulateClick = () => {
    if (isSimulating) {
        stopSimulation();
    } else {
        if (sampleMeans.length >= numSamples) {
            setSampleMeans([]);
            setCurrentAnimatedSample([]);
        }
        runSimulation();
    }
  }

  const handleResetClick = () => {
    stopSimulation();
    setSampleMeans([]);
    setCurrentAnimatedSample([]);
    fetchPopulationData();
  }

  useEffect(() => {
      return () => stopSimulation(); // Cleanup on unmount
  }, []);

  // --- Memoized Calculations for Charts ---
  const populationMean = useMemo(() => calculateMean(populationData), [populationData]);
  const populationStdDev = useMemo(() => calculateStdDev(populationData, populationMean), [populationData, populationMean]);

  const populationBinned = useMemo(() => binData(populationData, 40), [populationData]);
  const currentSampleBinned = useMemo(() => binData(currentAnimatedSample, 20), [currentAnimatedSample]);
  const sampleMeansBinned = useMemo(() => binData(sampleMeans, 40), [sampleMeans]);
  
  const sampleMeansMean = useMemo(() => calculateMean(sampleMeans), [sampleMeans]);
  const sampleMeansStdDev = useMemo(() => calculateStdDev(sampleMeans, sampleMeansMean), [sampleMeans, sampleMeansMean]);

  // --- UI Components ---
  const renderControls = () => (
    <div className="space-y-4">
        <div>
            <Label className="font-semibold">1. Population Shape</Label>
            <Select value={distributionType} onValueChange={(v) => setDistributionType(v as DistributionType)} disabled={isSimulating}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="uniform">Uniform</SelectItem>
                    <SelectItem value="beta">Beta</SelectItem>
                    <SelectItem value="bimodal">Bimodal</SelectItem>
                    <SelectItem value="positive-skew">Positive Skew</SelectItem>
                    <SelectItem value="negative-skew">Negative Skew</SelectItem>
                </SelectContent>
            </Select>
        </div>
        {distributionType === 'normal' || distributionType === 'uniform' || distributionType === 'bimodal' || distributionType === 'positive-skew' || distributionType === 'negative-skew' ? (
            <>
             <div>
                <Label>Mean: {meanParam.toFixed(2)}</Label>
                <Slider disabled={isSimulating} value={[meanParam]} onValueChange={([v]) => setMeanParam(v)} min={-5} max={15} step={0.5} />
            </div>
             <div>
                <Label>Std. Dev: {stdDevParam.toFixed(2)}</Label>
                <Slider disabled={isSimulating} value={[stdDevParam]} onValueChange={([v]) => setStdDevParam(v)} min={0.5} max={5} step={0.1} />
            </div>
            </>
        ) : null}
        {distributionType === 'beta' ? (
             <>
             <div>
                <Label>Alpha: {alphaParam.toFixed(2)}</Label>
                <Slider disabled={isSimulating} value={[alphaParam]} onValueChange={([v]) => setAlphaParam(v)} min={0.1} max={10} step={0.1} />
            </div>
             <div>
                <Label>Beta: {betaParam.toFixed(2)}</Label>
                <Slider disabled={isSimulating} value={[betaParam]} onValueChange={([v]) => setBetaParam(v)} min={0.1} max={10} step={0.1} />
            </div>
            </>
        ) : null}

        <div className="border-t pt-4 space-y-4">
            <Label className="font-semibold">2. Sampling Parameters</Label>
             <div>
                <Label>Sample Size: {sampleSize}</Label>
                <Slider disabled={isSimulating} value={[sampleSize]} onValueChange={([v]) => setSampleSize(v)} min={2} max={200} step={1} />
            </div>
             <div>
                <Label>Number of Samples: {numSamples.toLocaleString()}</Label>
                <Slider disabled={isSimulating} value={[numSamples]} onValueChange={([v]) => setNumSamples(v)} min={100} max={10000} step={100} />
            </div>
        </div>
        <div className="border-t pt-4 flex gap-2">
            <Button onClick={handleSimulateClick} className="w-full" variant={isSimulating ? 'destructive' : 'default'}>
                {isSimulating ? <Pause className="mr-2"/> : <Play className="mr-2"/>}
                {isSimulating ? 'Pause' : 'Run'}
            </Button>
            <Button onClick={handleResetClick} variant="outline" aria-label="Reset Simulation">
                <RotateCcw />
            </Button>
        </div>
    </div>
  );

 const StatDisplay = ({ title, value, isLoading }: { title: string; value: number; isLoading?: boolean }) => (
    <div className="text-sm">
        <span className="text-muted-foreground">{title}: </span>
        {isLoading ? <Skeleton className="h-4 w-12 inline-block" /> : <span className="font-bold">{value.toFixed(2)}</span>}
    </div>
 );

  return (
    <div className="w-full space-y-8 p-4 md:p-8">
      <header className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            The Central Limit Theorem
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
            Discover the magic bridge between chaos and predictability. No matter how strange the source data, the averages of its samples will always tend to form a perfect bell curve.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* --- Left Panel: Controls --- */}
        <Card className="lg:col-span-1 h-fit sticky top-24">
          <CardHeader>
            <CardTitle>Discovery Lab</CardTitle>
            <CardDescription>Adjust the parameters of the experiment.</CardDescription>
          </CardHeader>
          <CardContent>
            {renderControls()}
          </CardContent>
        </Card>

        {/* --- Right Panel: Visualizations --- */}
        <div className="space-y-8 lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>1. The Population</CardTitle>
                    <CardDescription>The entire dataset we are drawing samples from.</CardDescription>
                    <div className="flex gap-4 pt-2">
                        <StatDisplay title="Mean" value={populationMean} isLoading={isLoadingPopulation} />
                        <StatDisplay title="Std. Dev" value={populationStdDev} isLoading={isLoadingPopulation} />
                    </div>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        {isLoadingPopulation ? <Skeleton className="h-full w-full"/> : (
                        <BarChart data={populationBinned} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} interval="auto"/>
                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[0, 'dataMax']} />
                            <Bar dataKey="value" fill="hsl(var(--secondary))" radius={[2, 2, 0, 0]} animationDuration={300} />
                        </BarChart>
                        )}
                    </ResponsiveContainer>
                </CardContent>
            </Card>

             <AnimatePresence>
             {isSimulating && currentAnimatedSample.length > 0 && (
                <motion.div initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: 20}}>
                     <Card>
                        <CardHeader>
                            <CardTitle>2. A Single Sample</CardTitle>
                             <CardDescription>
                                Taking a random sample of {sampleSize} data points and calculating its average. 
                                <span className="font-bold ml-2">Sample Mean: {calculateMean(currentAnimatedSample).toFixed(2)}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={150}>
                                 <BarChart data={currentSampleBinned}>
                                     <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} interval="auto"/>
                                     <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} domain={[0, 'dataMax']} />
                                     <Bar dataKey="value" fill="hsl(var(--accent))" radius={[2, 2, 0, 0]} />
                                 </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>
             )}
             </AnimatePresence>
            
            <Card>
                <CardHeader>
                    <CardTitle>3. The Distribution of Sample Averages</CardTitle>
                    <CardDescription>
                        We plot the average of each sample. Watch the pattern emerge.
                    </CardDescription>
                     <div className="flex gap-4 pt-2">
                        <StatDisplay title="Samples" value={sampleMeans.length} />
                        <StatDisplay title="Mean" value={sampleMeansMean} />
                        <StatDisplay title="Std. Dev" value={sampleMeansStdDev} />
                    </div>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                         <BarChart data={sampleMeansBinned} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                             <XAxis dataKey="name" type="number" domain={['dataMin', 'dataMax']} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false}/>
                             <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[0, 'dataMax']}/>
                             <Bar dataKey="value" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} animationDuration={isSimulating ? 0 : 300}/>
                         </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
