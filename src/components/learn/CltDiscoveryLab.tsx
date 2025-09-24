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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { randomLogNormal, randomBates, randomExponential, randomNormal } from 'd3-random';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

// --- Data Generation ---
const generateData = (type: string, n: number) => {
  switch (type) {
    case 'skewed':
      return Array.from({ length: n }, randomLogNormal(0, 1.5));
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
  const max = Math.max(...data);
  const min = Math.min(...data);
  const binSize = (max - min) / numBins;

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
  const [populationType, setPopulationType] = useState('skewed');
  const [populationData, setPopulationData] = useState<number[]>([]);
  const [sampleMeans, setSampleMeans] = useState<number[]>([]);
  const [sampleSize, setSampleSize] = useState(30);
  const [numSamples, setNumSamples] = useState(5000);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showTheoretical, setShowTheoretical] = useState(false);

  useEffect(() => {
    setPopulationData(generateData(populationType, 10000));
    setSampleMeans([]);
  }, [populationType]);
  
  const handlePopulationChange = (value: string) => {
    setPopulationType(value);
    setSampleMeans([]); // Clear previous simulation results
  };


  const populationBinned = useMemo(
    () => binData(populationData, 20),
    [populationData]
  );
  const sampleMeansBinned = useMemo(
    () => binData(sampleMeans, 30),
    [sampleMeans]
  );
  
  const runSimulation = useCallback(() => {
    setIsSimulating(true);
    setSampleMeans([]);
    
    let means: number[] = [];
    const batchSize = Math.max(100, numSamples / 50); // Ensure at least some batches
    let i = 0;

    const interval = setInterval(() => {
        const batchMeans = Array.from({ length: batchSize }, () => {
            const sample = Array.from({ length: sampleSize }, () => populationData[Math.floor(Math.random() * populationData.length)]);
            return sample.reduce((a, b) => a + b, 0) / sampleSize;
        });
        
        means = [...means, ...batchMeans];
        setSampleMeans([...means]);

        i += batchSize;
        if (i >= numSamples) {
            clearInterval(interval);
            setIsSimulating(false);
        }
    }, 50);

    return () => clearInterval(interval);
  }, [sampleSize, numSamples, populationData]);


  useEffect(() => {
    // Automatically run simulation on first load
    runSimulation();
  }, [runSimulation]);


  const populationMean = useMemo(() => populationData.reduce((a,b) => a+b, 0) / populationData.length, [populationData]);
  const populationStdDev = useMemo(() => {
      const mean = populationMean;
      const variance = populationData.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / populationData.length;
      return Math.sqrt(variance);
  }, [populationData, populationMean]);

  const theoreticalMean = populationMean;
  const theoreticalStdDev = populationStdDev / Math.sqrt(sampleSize);
  
  const normalPDF = (x: number, mean: number, stdDev: number) => {
    return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
  };

  const theoreticalCurveData = useMemo(() => {
      if (sampleMeansBinned.length === 0) return [];
      const scale = sampleMeans.length * (sampleMeansBinned[0].x1 - sampleMeansBinned[0].x0);
      return sampleMeansBinned.map(bin => ({
          x: bin.x0 + (bin.x1 - bin.x0)/2,
          y: normalPDF(bin.x0 + (bin.x1 - bin.x0)/2, theoreticalMean, theoreticalStdDev) * scale
      }));
  }, [sampleMeansBinned, theoreticalMean, theoreticalStdDev, sampleMeans.length]);

  return (
    <div className="w-full space-y-8 p-4 md:p-8">
       <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="font-headline text-4xl md:text-5xl text-primary">From chaos comes order. This is the Central Limit Theorem.</h2>
          <p className="mt-4 max-w-3xl mx-auto text-muted-foreground">No matter how strange the population data, the distribution of its sample averages will always form a perfect normal distribution. Use the lab below to see it for yourself.</p>
        </motion.div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>The Discovery Lab</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.5 } }}
                className="space-y-6"
            >
                <div>
                    <Label>Population Shape</Label>
                     <Select value={populationType} onValueChange={handlePopulationChange}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="skewed">Skewed</SelectItem>
                            <SelectItem value="bimodal">Bimodal</SelectItem>
                            <SelectItem value="uniform">Uniform</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div>
                    <Label>Sample Size: {sampleSize}</Label>
                    <Slider value={[sampleSize]} onValueChange={([v]) => setSampleSize(v)} min={2} max={200} step={1} />
                </div>
                <div>
                    <Label>Number of Samples: {numSamples.toLocaleString()}</Label>
                    <Slider value={[numSamples]} onValueChange={([v]) => setNumSamples(v)} min={100} max={20000} step={100} />
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

        <div className="space-y-8 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Population Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={populationBinned} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false}/>
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false}/>
                  <Bar dataKey="value" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Distribution of Sample Averages</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sampleMeansBinned} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false}/>
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false}/>
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                    }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]}>
                    <AnimatePresence>
                        {sampleMeansBinned.map((entry, index) => (
                        <Cell key={`cell-${index}`}>
                            <motion.rect
                                fill="hsl(var(--primary))"
                                x={entry.x}
                                y={entry.y}
                                width={entry.width}
                                height={entry.height}
                                initial={{ opacity: 0, y: entry.y + 20 }}
                                animate={{ opacity: 1, y: entry.y }}
                                transition={{ duration: 0.5, delay: index * 0.01 }}
                            />
                        </Cell>
                        ))}
                    </AnimatePresence>
                  </Bar>
                  {showTheoretical && theoreticalCurveData.length > 0 && (
                     <ReferenceLine x={theoreticalMean} stroke="hsl(var(--accent))" strokeDasharray="3 3" />
                  )}
                  {showTheoretical && (
                    <Line
                        type="monotone"
                        dataKey="y"
                        data={theoreticalCurveData}
                        stroke="hsl(var(--accent))"
                        strokeWidth={2}
                        dot={false}
                        animationDuration={500}
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
