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
  const [populationShape, setPopulationShape] = useState('positive-skew');
  const [populationData, setPopulationData] = useState<number[]>([]);
  const [isPopulationLoading, setIsPopulationLoading] = useState(true);

  const [sampleSize, setSampleSize] = useState(30);
  const [numSamples, setNumSamples] = useState(5000);
  const [isSimulating, setIsSimulating] = useState(false);

  const [sampleMeans, setSampleMeans] = useState<number[]>([]);
  const [showTheoretical, setShowTheoretical] = useState(false);

  const simulationRef = useRef<{ stop: boolean, id?: number }>({ stop: false });

  const stopSimulation = useCallback(() => {
    simulationRef.current.stop = true;
    if (simulationRef.current.id) {
      cancelAnimationFrame(simulationRef.current.id);
      simulationRef.current.id = undefined;
    }
    setIsSimulating(false);
  }, []);

  const clearResults = useCallback(() => {
    stopSimulation();
    setSampleMeans([]);
  }, [stopSimulation]);
  
  const handlePopulationChange = (newShape: string) => {
      setPopulationShape(newShape);
      clearResults();
  }

  const handleParamChange = <T,>(setter: React.Dispatch<React.SetStateAction<T>>) => (value: T) => {
    clearResults();
    setter(value);
  }

  useEffect(() => {
    setIsPopulationLoading(true);
    const data = generatePopulationData(populationShape, 20000);
    setPopulationData(data);
    setIsPopulationLoading(false);
  }, [populationShape]);

  const { populationMean, populationStdDev, populationDomain } = useMemo(() => {
    if (!populationData || populationData.length === 0) return { populationMean: 0, populationStdDev: 0, populationDomain: [0,10] as [number, number]};
    const mean = populationData.reduce((a,b) => a+b, 0) / populationData.length;
    const variance = populationData.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / populationData.length;
    const stdDev = Math.sqrt(variance);
    const domain: [number, number] = [Math.min(...populationData), Math.max(...populationData)];
    return { populationMean: mean, populationStdDev: stdDev, populationDomain: domain };
  }, [populationData]);
  
  const populationBinned = useMemo(() => binData(populationData, 50), [populationData]);
  const sampleMeansBinned = useMemo(() => binData(sampleMeans, 40), [sampleMeans]);

  const runFullSimulation = useCallback(() => {
    if (isSimulating) return;
    
    stopSimulation();
    setSampleMeans([]);
    setIsSimulating(true);

    simulationRef.current.stop = false;

    let means: number[] = [];
    const totalBatches = 100;
    const batchSize = Math.ceil(numSamples / totalBatches);
    let currentBatch = 0;
  
    const simulationStep = () => {
      if (simulationRef.current.stop || currentBatch >= totalBatches) {
        setIsSimulating(false);
        if(simulationRef.current.id) {
            cancelAnimationFrame(simulationRef.current.id);
            simulationRef.current.id = undefined;
        }
        return;
      }
  
      const batchMeans = Array.from({ length: batchSize }, () => {
        const sample = Array.from({ length: sampleSize }, () => populationData[Math.floor(Math.random() * populationData.length)]);
        return sample.reduce((a, b) => a + b, 0) / sampleSize;
      });
  
      means = [...means, ...batchMeans];
      setSampleMeans(means);
  
      currentBatch++;
      simulationRef.current.id = requestAnimationFrame(simulationStep);
    };
  
    simulationRef.current.id = requestAnimationFrame(simulationStep);
  }, [sampleSize, numSamples, populationData, isSimulating, stopSimulation]);
  
  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopSimulation();
    }
  }, [stopSimulation]);


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
  
  const showAnalysis = sampleMeans.length > 1;

  return (
    <div className="w-full space-y-8 p-4 md:p-8">
      <div className="text-center">
        <h2 className="font-headline text-4xl md:text-5xl text-primary">The Discovery Lab</h2>
        <p className="mt-4 max-w-3xl mx-auto text-muted-foreground">From chaos comes order. Change the population, adjust the sample size, and see how the Central Limit Theorem works its magic every time.</p>
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
                      <Select value={populationShape} onValueChange={handlePopulationChange} disabled={isSimulating}>
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
                      <Slider value={[sampleSize]} onValueChange={handleParamChange(setSampleSize)} min={2} max={200} step={1} disabled={isSimulating}/>
                  </div>
                  <div>
                      <Label>Number of Samples: {numSamples.toLocaleString()}</Label>
                      <Slider value={[numSamples]} onValueChange={handleParamChange(setNumSamples)} min={100} max={20000} step={100} disabled={isSimulating} />
                  </div>
                
                <div className="space-y-2 pt-2">
                    <Button onClick={runFullSimulation} disabled={isSimulating} className="w-full">
                        {isSimulating ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Simulating...</>) : 'Run New Simulation'}
                    </Button>
                    <Button onClick={clearResults} className="w-full" variant="outline" disabled={isSimulating}>Reset</Button>
                </div>

                <div className="flex items-center space-x-2 pt-4">
                    <Switch id="theoretical-curve" checked={showTheoretical} onCheckedChange={setShowTheoretical} />
                    <Label htmlFor="theoretical-curve">Show Theoretical Curve</Label>
                </div>
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
                <AnimatePresence>
                {showAnalysis && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <CardDescription>
                      Analysis of {sampleMeans.length.toLocaleString()} sample averages.
                    </CardDescription>
                  </motion.div>
                )}
                </AnimatePresence>
            </CardHeader>
            <CardContent className="h-[300px] pl-2 pr-6">
               <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sampleMeansBinned} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <XAxis dataKey="name" type="number" domain={['dataMin', 'dataMax']} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => Number(value).toFixed(1)} />
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
            <AnimatePresence>
             {showAnalysis && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto', transition: { delay: 0.3 } }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <CardContent className="border-t pt-4 space-y-2">
                   <AnalysisStat label="Simulated Mean" value={simulatedMean} theoreticalValue={theoreticalMean} />
                   <AnalysisStat label="Simulated Std. Error" value={simulatedStdDev} theoreticalValue={theoreticalStdDev} />
                </CardContent>
              </motion.div>
            )}
            </AnimatePresence>
          </Card>
        </div>
      </div>
    </div>
  );
}
