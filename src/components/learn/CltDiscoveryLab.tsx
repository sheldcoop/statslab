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
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { generateDistributionFlow, type DistributionInput } from '@/ai/flows/statistics-flow';
import { Loader2 } from 'lucide-react';

const binData = (data: number[] | undefined, numBins: number) => {
    if (!data || data.length === 0) return [];
    
    let min = Math.min(...data);
    let max = Math.max(...data);
    
    // Handle case where all data points are the same or only one point exists
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


const SIMULATION_SPEED_MS = 20; // How fast to run the simulation loop
const BATCH_SIZE = 10; // How many samples to process per animation frame

type Scene = 'intro' | 'single_sample' | 'simulation' | 'lab';

export default function CltDiscoveryLab() {
  const [scene, setScene] = useState<Scene>('intro');

  const [populationParams, setPopulationParams] = useState<Omit<DistributionInput, 'count'>>({ 
      distribution: 'positive-skew',
      mean: 5,
      stdDev: 2,
      alpha: 2,
      beta: 5
  });

  const [populationData, setPopulationData] = useState<number[]>([]);
  const [isPopulationLoading, setIsPopulationLoading] = useState(true);

  const [sampleSize, setSampleSize] = useState(30);
  const [numSamples, setNumSamples] = useState(5000);
  const [isSimulating, setIsSimulating] = useState(false);

  const [sampleMeans, setSampleMeans] = useState<number[]>([]);
  const [currentSingleSample, setCurrentSingleSample] = useState<number[]>([]);
  const [showTheoretical, setShowTheoretical] = useState(false);

  const fetchPopulation = useCallback(async () => {
    setIsPopulationLoading(true);
    setSampleMeans([]);
    setCurrentSingleSample([]);
    try {
        const { data } = await generateDistributionFlow({ ...populationParams, count: 10000 });
        setPopulationData(data);
    } catch (e) {
        console.error("Failed to fetch population data", e);
    } finally {
        setIsPopulationLoading(false);
    }
  }, [populationParams]);

  useEffect(() => {
    fetchPopulation();
  }, [fetchPopulation]);

  const populationBinned = useMemo(() => binData(populationData, 40), [populationData]);
  const sampleMeansBinned = useMemo(() => binData(sampleMeans, 40), [sampleMeans]);
  const currentSampleBinned = useMemo(() => binData(currentSingleSample, 20), [currentSingleSample]);

  const { populationMean, populationStdDev } = useMemo(() => {
    if (!populationData || populationData.length === 0) return { populationMean: 0, populationStdDev: 0 };
    const mean = populationData.reduce((a,b) => a+b, 0) / populationData.length;
    const variance = populationData.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / populationData.length;
    return { populationMean: mean, populationStdDev: Math.sqrt(variance) };
  }, [populationData]);

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

  const takeOneSample = useCallback(() => {
      if (populationData.length === 0) return;
      const sample = Array.from({ length: sampleSize }, () => populationData[Math.floor(Math.random() * populationData.length)]);
      setCurrentSingleSample(sample);
      const mean = sample.reduce((a, b) => a + b, 0) / sampleSize;
      setSampleMeans(prev => [...prev, mean]);
      setScene('single_sample');
  }, [sampleSize, populationData]);

  const runSimulation = useCallback(() => {
    setIsSimulating(true);
    if(scene === 'single_sample') {
      setCurrentSingleSample([]);
    } else {
      setSampleMeans([]);
    }
    setScene('simulation');

    let i = sampleMeans.length;
    const simulationLoop = () => {
        if (i >= numSamples || populationData.length === 0) {
            setIsSimulating(false);
            setScene('lab'); // Move to lab scene after simulation
            return;
        }

        const batchMeans = Array.from({ length: BATCH_SIZE }, () => {
            const sample = Array.from({ length: sampleSize }, () => populationData[Math.floor(Math.random() * populationData.length)]);
            return sample.reduce((a, b) => a + b, 0) / sampleSize;
        });

        setSampleMeans(prevMeans => [...prevMeans, ...batchMeans]);
        i += BATCH_SIZE;
        setTimeout(simulationLoop, SIMULATION_SPEED_MS);
    };
    simulationLoop();
  }, [numSamples, sampleSize, populationData, scene, sampleMeans.length]);

  const handleReset = useCallback(() => {
    setSampleMeans([]);
    setCurrentSingleSample([]);
    setScene('intro');
  }, []);

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
            <h2 className="font-headline text-4xl md:text-5xl text-primary">If we take an average from this weird data, what will it look like?</h2>
          )}
          {(scene === 'single_sample') && (
            <h2 className="font-headline text-4xl md:text-5xl text-primary">Okay, that's one average. Not very useful. What if we did this {numSamples.toLocaleString()} times?</h2>
          )}
          {scene === 'simulation' && (
            <h2 className="font-headline text-4xl md:text-5xl text-primary">From chaos comes order. This is the Central Limit Theorem.</h2>
          )}
           {scene === 'lab' && (
            <div>
                 <h2 className="font-headline text-4xl md:text-5xl text-primary">The Discovery Lab</h2>
                 <p className="mt-4 max-w-3xl mx-auto text-muted-foreground">The magic works every time. Change the population, adjust the sample size, and see for yourself.</p>
            </div>
           )}
        </motion.div>
       </AnimatePresence>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* === CONTROLS === */}
        <motion.div initial={false} animate={scene === 'lab' ? 'open' : 'closed'} className="lg:col-span-1">
             <Card>
              <CardHeader>
                <CardTitle>The Laboratory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <AnimatePresence>
                  {scene === 'intro' && (
                     <motion.div initial={{ opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                        <Button onClick={takeOneSample} className="w-full" disabled={isPopulationLoading || isSimulating}>
                          {isPopulationLoading ? 'Preparing Population...' : 'Take One Sample'}
                        </Button>
                     </motion.div>
                  )}
                  {scene === 'single_sample' && (
                      <motion.div initial={{ opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="space-y-4">
                           <Button onClick={runSimulation} className="w-full" disabled={isSimulating}>
                              {isSimulating ? "Simulating..." : `Run Simulation (${numSamples.toLocaleString()} times)`}
                          </Button>
                           <Button onClick={handleReset} className="w-full" variant="outline">Reset</Button>
                      </motion.div>
                  )}
                   {(scene === 'simulation' || scene === 'lab') && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: 0.3 } }}
                        className="space-y-6"
                    >
                        <div>
                            <Label>Population Shape</Label>
                            <Select value={populationParams.distribution} onValueChange={(v: DistributionInput['distribution']) => { setPopulationParams(p => ({...p, distribution: v})); setScene('intro'); }} disabled={isSimulating}>
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
                        <Button onClick={runSimulation} disabled={isSimulating} className="w-full">
                            {isSimulating ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Simulating...</>) : 'Run New Simulation'}
                        </Button>
                         <Button onClick={handleReset} className="w-full" variant="outline">Reset</Button>

                        <div className="flex items-center space-x-2 pt-4">
                        <Switch id="theoretical-curve" checked={showTheoretical} onCheckedChange={setShowTheoretical} />
                        <Label htmlFor="theoretical-curve">Show Theoretical Curve</Label>
                        </div>
                    </motion.div>
                   )}
                </AnimatePresence>
              </CardContent>
            </Card>
        </motion.div>

        {/* === VISUALIZATIONS === */}
        <div className="space-y-8 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Population Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[200px]">
              {isPopulationLoading ? (
                 <div className="flex items-center justify-center h-full text-muted-foreground"><Loader2 className="mr-2 h-6 w-6 animate-spin" />Loading Population...</div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={populationBinned} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => Number(value).toFixed(1)} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => v > 0 ? v : ''}/>
                        <Bar dataKey="value" fill="hsl(var(--secondary))" radius={[2, 2, 0, 0]}>
                            {currentSampleBinned.length > 0 && populationBinned.map((entry, index) => {
                                const isSampled = currentSampleBinned.some(sampleBin => entry.x0 < sampleBin.x1 && entry.x1 > sampleBin.x0 && sampleBin.value > 0);
                                return <Cell key={`cell-${index}`} fill={isSampled ? 'hsl(var(--primary))' : 'hsl(var(--secondary))'} />;
                            })}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Distribution of Sample Averages</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
               <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sampleMeansBinned} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <XAxis dataKey="name" domain={['dataMin', 'dataMax']} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => Number(value).toFixed(1)} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} width={40} tickFormatter={(v) => v > 0 ? v : ''}/>
                    <Tooltip
                        cursor={{ fill: 'hsla(var(--muted) / 0.1)'}}
                        contentStyle={{
                            background: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: 'var(--radius)',
                        }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} maxBarSize={40} />

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
          </Card>
        </div>
      </div>
    </div>
  );
}
