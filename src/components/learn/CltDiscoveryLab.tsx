'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Line,
  ReferenceLine,
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
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Loader2 } from 'lucide-react';
import { randomLogNormal, randomNormal } from 'd3-random';

type Scene = 'intro' | 'single_sample' | 'simulation' | 'lab';

// --- Data Generation ---
const generatePopulationData = (distribution: string, count: number) => {
    switch (distribution) {
      case 'positive-skew':
        return Array.from({ length: count }, randomLogNormal(0, 1.5));
      case 'negative-skew':
        return Array.from({ length: count }, () => 10 - randomLogNormal(0, 1.5)());
      case 'bimodal': {
        const bimodal = () => (Math.random() < 0.5 ? randomNormal(2, 1)() : randomNormal(8, 1)());
        return Array.from({ length: count }, bimodal);
      }
      case 'uniform':
        return Array.from({ length: count }, () => Math.random() * 10);
      case 'normal':
      default:
        return Array.from({ length: count }, randomNormal(5, 1.5));
    }
};

const binData = (data: number[] | undefined, numBins: number, domain?: [number, number]) => {
    if (!data || data.length === 0) return [];
    
    let min = domain ? domain[0] : Math.min(...data);
    let max = domain ? domain[1] : Math.max(...data);
    
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
        const binIndex = Math.min(Math.floor((d - min) / binSize), numBins - 1);
        if (bins[binIndex]) {
            bins[binIndex].value++;
        }
    }
    return bins;
};

const AnalysisStat = ({ label, value, theoreticalValue }: { label: string; value: number, theoreticalValue?: number }) => (
    <div className="flex justify-between items-baseline text-sm">
      <p className="text-muted-foreground">{label}</p>
      <div className="flex items-baseline gap-2 font-mono">
        {theoreticalValue !== undefined && (
             <p className="text-xs text-muted-foreground/80" title="Theoretical Value">({theoreticalValue.toFixed(3)})</p>
        )}
        <p className="text-foreground font-bold">{value.toFixed(3)}</p>
      </div>
    </div>
  );

export default function CltDiscoveryLab() {
  const [scene, setScene] = useState<Scene>('intro');
  const [populationShape, setPopulationShape] = useState('positive-skew');
  const [populationData, setPopulationData] = useState<number[]>([]);
  const [isPopulationLoading, setIsPopulationLoading] = useState(true);

  const [sampleSize, setSampleSize] = useState(30);
  const [numSamples, setNumSamples] = useState(5000);
  const [isSimulating, setIsSimulating] = useState(false);

  const [sampleMeans, setSampleMeans] = useState<number[]>([]);
  const [showTheoretical, setShowTheoretical] = useState(false);

  const simulationRef = useRef<{ stop: boolean, intervalId?: number }>({ stop: false });

  const fetchPopulationData = useCallback(async () => {
    setIsPopulationLoading(true);
    setSampleMeans([]);
    const data = generatePopulationData(populationShape, 10000);
    setPopulationData(data);
    setIsPopulationLoading(false);
    setScene('intro');
  }, [populationShape]);

  useEffect(() => {
    fetchPopulationData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [populationShape]);

  const { populationMean, populationStdDev, populationDomain } = useMemo(() => {
    if (!populationData || populationData.length === 0) return { populationMean: 0, populationStdDev: 0, populationDomain: [0,10] as [number, number]};
    const mean = populationData.reduce((a,b) => a+b, 0) / populationData.length;
    const variance = populationData.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / populationData.length;
    const stdDev = Math.sqrt(variance);
    const domain: [number, number] = [Math.min(...populationData), Math.max(...populationData)];
    return { populationMean: mean, populationStdDev: stdDev, populationDomain: domain };
  }, [populationData]);
  
  const populationBinned = useMemo(() => binData(populationData, 40), [populationData]);
  const sampleMeansBinned = useMemo(() => binData(sampleMeans, 40, populationDomain), [sampleMeans, populationDomain]);

  const runSingleSample = () => {
    const sample = Array.from({ length: sampleSize }, () => populationData[Math.floor(Math.random() * populationData.length)]);
    const mean = sample.reduce((a, b) => a + b, 0) / sampleSize;
    setSampleMeans([mean]);
    setScene('single_sample');
  }

  const runFullSimulation = useCallback(() => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSampleMeans([]);
    simulationRef.current.stop = false;

    let means: number[] = [];
    const totalBatches = 100;
    const batchSize = Math.ceil(numSamples / totalBatches);
    let currentBatch = 0;
  
    const simulationStep = () => {
      if (simulationRef.current.stop || currentBatch >= totalBatches) {
        setIsSimulating(false);
        if(simulationRef.current.intervalId) {
            cancelAnimationFrame(simulationRef.current.intervalId);
            simulationRef.current.intervalId = undefined;
        }
        setScene('lab');
        return;
      }
  
      const batchMeans = Array.from({ length: batchSize }, () => {
        const sample = Array.from({ length: sampleSize }, () => populationData[Math.floor(Math.random() * populationData.length)]);
        return sample.reduce((a, b) => a + b, 0) / sampleSize;
      });
  
      means = [...means, ...batchMeans];
      setSampleMeans(means);
  
      currentBatch++;
      simulationRef.current.intervalId = requestAnimationFrame(simulationStep);
    };
  
    simulationRef.current.intervalId = requestAnimationFrame(simulationStep);
  }, [sampleSize, numSamples, populationData, isSimulating]);
  
  const handleReset = useCallback(() => {
    simulationRef.current.stop = true;
    if (simulationRef.current.intervalId) {
      cancelAnimationFrame(simulationRef.current.intervalId);
      simulationRef.current.intervalId = undefined;
    }
    setIsSimulating(false);
    fetchPopulationData();
  }, [fetchPopulationData]);


  const { simulatedMean, simulatedStdDev } = useMemo(() => {
    if (!sampleMeans || sampleMeans.length < 2) return { simulatedMean: 0, simulatedStdDev: 0 };
    const mean = sampleMeans.reduce((a, b) => a + b, 0) / sampleMeans.length;
    const variance = sampleMeans.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / sampleMeans.length;
    return { simulatedMean: mean, simulatedStdDev: Math.sqrt(variance) };
  }, [sampleMeans]);

  const theoreticalMean = populationMean;
  const theoreticalStdDev = populationStdDev / Math.sqrt(sampleSize);

  const normalPDF = (x: number, mean: number, stdDev: number) => {
    if (stdDev <= 0) return 0;
    return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
  };
  
  const theoreticalCurveData = useMemo(() => {
      if (sampleMeansBinned.length === 0 || !sampleMeans.length) return [];
      const scale = sampleMeans.length * (sampleMeansBinned[0].x1 - sampleMeansBinned[0].x0);
      return sampleMeansBinned.map(bin => ({
          x: bin.x0 + (bin.x1 - bin.x0)/2,
          y: normalPDF(bin.x0 + (bin.x1 - bin.x0)/2, theoreticalMean, theoreticalStdDev) * scale
      }));
  }, [sampleMeansBinned, theoreticalMean, theoreticalStdDev, sampleMeans.length]);
  

  return (
    <div className="w-full space-y-8 p-4 md:p-8">
        <AnimatePresence mode="wait">
            <motion.div
                key={scene}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                {scene === 'intro' && (
                    <h2 className="font-headline text-3xl md:text-4xl">If we take an average from this weird data, what will it look like?</h2>
                )}
                {scene === 'single_sample' && (
                    <h2 className="font-headline text-3xl md:text-4xl">Okay, that's one average. Not very useful. What if we did this 5,000 times?</h2>
                )}
                {(scene === 'simulation' || scene === 'lab') && (
                    <>
                        <h2 className="font-headline text-4xl md:text-5xl text-primary">From chaos comes order.</h2>
                        <p className="mt-4 max-w-3xl mx-auto text-muted-foreground">This is the Central Limit Theorem. Notice how the distribution of sample averages forms a perfect bell curve, no matter how chaotic the original population is.</p>
                    </>
                )}
            </motion.div>
        </AnimatePresence>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* === CONTROLS === */}
        <div className="lg:col-span-1">
             <Card>
              <CardHeader>
                <CardTitle>The Laboratory</CardTitle>
                <CardDescription>The engine of discovery.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <AnimatePresence>
                    {(scene === 'lab') && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-6 overflow-hidden"
                        >
                            <div>
                                <Label>Population Shape</Label>
                                <Select value={populationShape} onValueChange={setPopulationShape} disabled={isSimulating}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
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
                                <Label>Sample Size: {sampleSize}</Label>
                                <Slider value={[sampleSize]} onValueChange={([v]) => setSampleSize(v)} min={2} max={200} step={1} disabled={isSimulating}/>
                            </div>
                            <div>
                                <Label>Number of Samples: {numSamples.toLocaleString()}</Label>
                                <Slider value={[numSamples]} onValueChange={([v]) => setNumSamples(v)} min={100} max={20000} step={100} disabled={isSimulating} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                
                <div className="space-y-2">
                    {scene === 'intro' && <Button onClick={runSingleSample} className="w-full">Take One Sample</Button>}
                    {scene === 'single_sample' && <Button onClick={() => { setScene('simulation'); runFullSimulation(); }} className="w-full">Run the Simulation</Button>}
                    {(scene === 'simulation' || scene === 'lab') && <Button onClick={runFullSimulation} disabled={isSimulating} className="w-full">
                        {isSimulating ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Simulating...</>) : 'Run New Simulation'}
                    </Button>}
                    {(scene === 'lab') && <Button onClick={handleReset} className="w-full" variant="outline">Reset</Button>}
                </div>

                <AnimatePresence>
                    {scene === 'lab' && (
                         <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center space-x-2 pt-4"
                        >
                            <Switch id="theoretical-curve" checked={showTheoretical} onCheckedChange={setShowTheoretical} />
                            <Label htmlFor="theoretical-curve">Show Theoretical Curve</Label>
                        </motion.div>
                    )}
                </AnimatePresence>
              </CardContent>
            </Card>
        </div>

        {/* === VISUALIZATIONS === */}
        <div className="space-y-8 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Population Distribution</CardTitle>
               <CardDescription>
                μ = {populationMean.toFixed(2)}, σ = {populationStdDev.toFixed(2)}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[200px] pr-4">
              {isPopulationLoading ? (
                 <div className="flex items-center justify-center h-full text-muted-foreground"><Loader2 className="mr-2 h-6 w-6 animate-spin" />Loading Population...</div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={populationBinned} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => Number(value).toFixed(1)} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => v > 0 ? v : ''} width={30} />
                        <Bar dataKey="value" fill="hsl(var(--secondary))" radius={[2, 2, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          <Card>
             <CardHeader>
                <CardTitle>Distribution of Sample Averages</CardTitle>
                <CardDescription>
                    {sampleMeans.length > 1 ? `Analysis of ${sampleMeans.length.toLocaleString()} sample averages.` : 'A single sample average. Not very informative... yet.'}
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] pl-2 pr-6">
               <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sampleMeansBinned} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <XAxis dataKey="name" domain={populationDomain} type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => Number(value).toFixed(1)} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} width={40} tickFormatter={(v) => v > 0 ? v : ''}/>
                    <Tooltip
                        cursor={{ fill: 'hsla(var(--muted) / 0.1)'}}
                        contentStyle={{
                            background: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: 'var(--radius)',
                        }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} maxBarSize={40} animationDuration={isSimulating ? 0 : 300} />

                    {showTheoretical && theoreticalCurveData.length > 0 && (
                        <ReferenceLine 
                            x={theoreticalMean} 
                            stroke="hsl(var(--accent))" 
                            strokeDasharray="3 3" 
                            strokeWidth={2}
                            label={{ value: 'μ', fill: 'hsl(var(--accent))', position: 'insideTop' }}
                        />
                    )}
                    {showTheoretical && theoreticalCurveData.length > 1 && (
                        <Line
                            type="monotone"
                            dataKey="y"
                            data={theoreticalCurveData}
                            stroke="hsl(var(--accent))"
                            strokeWidth={2}
                            dot={false}
                            animationDuration={300}
                        />
                    )}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
             {scene === 'lab' && sampleMeans.length > 1 && (
              <CardContent className="border-t pt-4 space-y-2">
                 <AnalysisStat label="Simulated Mean" value={simulatedMean} theoreticalValue={theoreticalMean} />
                 <AnalysisStat label="Simulated Std. Error" value={simulatedStdDev} theoreticalValue={theoreticalStdDev} />
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
