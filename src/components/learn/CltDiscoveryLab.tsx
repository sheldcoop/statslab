'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
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
import { randomLogNormal, randomBates, randomExponential, randomNormal } from 'd3-random';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

// --- Data Generation ---
const generateData = (type: string, n: number) => {
  switch (type) {
    case 'positive-skew':
      return Array.from({ length: n }, randomLogNormal(0, 1));
    case 'negative-skew':
        const negSkewGenerator = randomBates(4);
        return Array.from({ length: n }, () => 10 - negSkewGenerator() * 10);
    case 'bimodal': {
      const bimodal = () => {
        const r = Math.random();
        return r < 0.5 ? randomNormal(2, 1)() : randomNormal(8, 1)();
      };
      return Array.from({ length: n }, bimodal);
    }
    case 'uniform':
      return Array.from({ length: n }, () => Math.random() * 10);
    default: // normal
      return Array.from({ length: n }, randomNormal(5, 1.5));
  }
};

const binData = (data: number[], numBins: number) => {
  if (data.length === 0) return [];
  
  let min = Math.min(...data);
  let max = Math.max(...data);

  if (min === max) {
    min = min - 1;
    max = max + 1;
  }

  const binSize = (max - min) / numBins;
    if (binSize === 0) {
    // Handle case where all data points are the same
    return [{ name: min.toFixed(1), value: data.length, x0: min, x1: max }];
  }


  const bins = Array.from({ length: numBins }, (_, i) => ({
    name: (min + i * binSize).toFixed(1),
    value: 0,
    x0: min + i * binSize,
    x1: min + (i + 1) * binSize,
  }));

  for (const d of data) {
    const binIndex = Math.min(
      Math.floor((d - min) / binSize),
      numBins - 1
    );
     if(bins[binIndex]) {
        bins[binIndex].value++;
    }
  }
  return bins;
};

// --- Main Component ---
export default function CltDiscoveryLab() {
  const [populationType, setPopulationType] = useState('positive-skew');
  const [populationData, setPopulationData] = useState<number[]>([]);
  const [sampleMeans, setSampleMeans] = useState<number[]>([]);
  const [sampleSize, setSampleSize] = useState(30);
  const [numSamples, setNumSamples] = useState(5000);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showTheoretical, setShowTheoretical] = useState(false);
  const [currentAnimatedSample, setCurrentAnimatedSample] = useState<number[] | null>(null);
  const [currentAnimatedMean, setCurrentAnimatedMean] = useState<number | null>(null);


  useEffect(() => {
    setPopulationData(generateData(populationType, 10000));
    setSampleMeans([]);
    setCurrentAnimatedSample(null);
    setCurrentAnimatedMean(null);
  }, [populationType]);
  
  const handlePopulationChange = (value: string) => {
    setPopulationType(value);
    setSampleMeans([]);
  };

  const populationBinned = useMemo(() => binData(populationData, 30), [populationData]);
  const sampleMeansBinned = useMemo(() => binData(sampleMeans, 30), [sampleMeans]);
  const animatedSampleBinned = useMemo(() => currentAnimatedSample ? binData(currentAnimatedSample, 20) : [], [currentAnimatedSample]);
  
 const runSimulation = useCallback(() => {
    setIsSimulating(true);
    setSampleMeans([]);
    setCurrentAnimatedSample(null);
    setCurrentAnimatedMean(null);

    let i = 0;

    const simulationStep = () => {
      if (i >= numSamples) {
        setIsSimulating(false);
        setCurrentAnimatedSample(null);
        setCurrentAnimatedMean(null);
        return;
      }

      const sample = Array.from({ length: sampleSize }, () => populationData[Math.floor(Math.random() * populationData.length)]);
      const mean = sample.reduce((a, b) => a + b, 0) / sampleSize;
      
      setCurrentAnimatedSample(sample);
      setCurrentAnimatedMean(mean);
      
      setSampleMeans(prevMeans => [...prevMeans, mean]);
      
      i++;
      
      setTimeout(simulationStep, 10); 
    };

    simulationStep();

  }, [sampleSize, numSamples, populationData]);

  const populationMean = useMemo(() => populationData.reduce((a,b) => a+b, 0) / populationData.length, [populationData]);
  const populationStdDev = useMemo(() => {
      if (populationData.length === 0) return 0;
      const mean = populationMean;
      const variance = populationData.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / populationData.length;
      return Math.sqrt(variance);
  }, [populationData, populationMean]);

  const sampleMeansMean = useMemo(() => sampleMeans.length > 0 ? sampleMeans.reduce((a,b) => a+b, 0) / sampleMeans.length : 0, [sampleMeans]);
  const sampleMeansStdDev = useMemo(() => {
      if (sampleMeans.length < 2) return 0;
      const mean = sampleMeansMean;
      const variance = sampleMeans.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / sampleMeans.length;
      return Math.sqrt(variance);
  }, [sampleMeans, sampleMeansMean]);

  const theoreticalMean = populationMean;
  const theoreticalStdDev = populationStdDev / Math.sqrt(sampleSize);
  
  const normalPDF = (x: number, mean: number, stdDev: number) => {
    if (stdDev === 0) return 0;
    return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
  };

  const theoreticalCurveData = useMemo(() => {
      if (!showTheoretical || sampleMeansBinned.length === 0 || theoreticalStdDev === 0) return [];
      const binSize = sampleMeansBinned[0].x1 - sampleMeansBinned[0].x0;
      const scale = sampleMeans.length * binSize;
      
      return sampleMeansBinned.map(bin => {
          const x = bin.x0 + binSize / 2;
          return {
              x: x,
              y: normalPDF(x, theoreticalMean, theoreticalStdDev) * scale
          };
      });
  }, [sampleMeansBinned, theoreticalMean, theoreticalStdDev, sampleMeans.length, showTheoretical]);

  return (
    <div className="w-full space-y-8 p-4 md:p-8">
       <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="font-headline text-4xl md:text-5xl text-primary">The Magic of Large Numbers</h2>
          <p className="mt-4 max-w-3xl mx-auto text-muted-foreground">The Central Limit Theorem is the secret bridge between chaos and predictability. Discover how, no matter how strange the source data, the averages of its samples will always form a perfect bell curve.</p>
        </motion.div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Discovery Lab</CardTitle>
            <CardDescription>Adjust the parameters of the experiment.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.5 } }}
                className="space-y-6"
            >
                <div>
                    <Label>1. Population Shape</Label>
                     <Select value={populationType} onValueChange={handlePopulationChange}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="positive-skew">Positively Skewed</SelectItem>
                            <SelectItem value="negative-skew">Negatively Skewed</SelectItem>
                            <SelectItem value="bimodal">Bimodal</SelectItem>
                            <SelectItem value="uniform">Uniform</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div>
                    <Label>2. Sample Size: {sampleSize}</Label>
                    <Slider disabled={isSimulating} value={[sampleSize]} onValueChange={([v]) => setSampleSize(v)} min={2} max={200} step={1} />
                </div>
                <div>
                    <Label>3. Number of Samples: {numSamples.toLocaleString()}</Label>
                    <Slider disabled={isSimulating} value={[numSamples]} onValueChange={([v]) => setNumSamples(v)} min={100} max={20000} step={100} />
                </div>
                <Button onClick={runSimulation} disabled={isSimulating} className="w-full">
                    {isSimulating ? 'Simulating...' : 'Run Simulation'}
                </Button>
                <div className="flex items-center space-x-2">
                   <Switch id="theoretical-curve" checked={showTheoretical} onCheckedChange={setShowTheoretical} />
                   <Label htmlFor="theoretical-curve">Show Theoretical Curve</Label>
                </div>
            </motion.div>
          </CardContent>
        </Card>

        <div className="space-y-8 lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>1. The Population</CardTitle>
              <CardDescription>This is the entire dataset we are drawing samples from.</CardDescription>
              <div className="flex justify-around text-sm pt-2">
                <span>Mean: <span className="font-bold text-primary">{populationMean.toFixed(2)}</span></span>
                <span>Std. Dev: <span className="font-bold text-primary">{populationStdDev.toFixed(2)}</span></span>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={populationBinned} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false}/>
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[0, 'dataMax']} />
                  <Bar dataKey="value" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <AnimatePresence>
            {isSimulating && currentAnimatedSample && (
               <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.5 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>2. The Story of One Sample</CardTitle>
                            <CardDescription>We take a random sample of {sampleSize} data points, and calculate its average.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={150}>
                                <BarChart data={animatedSampleBinned} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false}/>
                                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[0, 'dataMax']}/>
                                    <Bar dataKey="value" fill="hsl(var(--accent))" radius={[2, 2, 0, 0]} />
                                    {currentAnimatedMean !== null && (
                                        <ReferenceLine x={currentAnimatedMean} stroke="hsl(var(--primary))" strokeWidth={2} label={{ value: `Avg: ${currentAnimatedMean.toFixed(2)}`, position: 'top', fill: 'hsl(var(--primary))' }} />
                                    )}
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
              <CardDescription>We plot the average of each sample. Watch the pattern emerge.</CardDescription>
               <div className="flex justify-around text-sm pt-2">
                <span>Samples: <span className="font-bold text-primary">{sampleMeans.length.toLocaleString()}</span></span>
                <span>Mean: <span className="font-bold text-primary">{sampleMeansMean.toFixed(2)}</span></span>
                <span>Std. Dev: <span className="font-bold text-primary">{sampleMeansStdDev.toFixed(2)}</span></span>
                <span>Theoretical Std. Dev: <span className="font-bold text-primary">{theoreticalStdDev.toFixed(2)}</span></span>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sampleMeansBinned} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <XAxis dataKey="name" type="number" domain={['dataMin', 'dataMax']} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false}/>
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[0, 'dataMax']}/>
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                    }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  {showTheoretical && theoreticalCurveData.length > 0 && (
                    <Line
                        type="monotone"
                        dataKey="y"
                        data={theoreticalCurveData}
                        stroke="hsl(var(--accent))"
                        strokeWidth={2}
                        dot={false}
                        animationDuration={300}
                        dataKey="x"
                    />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

    