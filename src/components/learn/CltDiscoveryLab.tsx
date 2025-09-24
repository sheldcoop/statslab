
'use client';

import React, { useState, useMemo, useCallback } from 'react';
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
import { randomLogNormal, randomBates, randomNormal } from 'd3-random';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { ArrowRight } from 'lucide-react';

// --- Type Definitions ---
type Scene = 'SCENE_1_CHAOS' | 'SCENE_2_FIRST_SPOONFUL' | 'SCENE_3_MAGIC_TRICK' | 'SCENE_4_LAB';

// --- Data Generation ---
const generateData = (type: string, n: number): number[] => {
  switch (type) {
    case 'positive-skew':
      return Array.from({ length: n }, randomLogNormal(0, 1));
    case 'negative-skew':
      const negSkewGenerator = randomBates(4);
      return Array.from({ length: n }, () => 10 - negSkewGenerator() * 10);
    case 'bimodal':
      const bimodal = () => (Math.random() < 0.5 ? randomNormal(2, 1)() : randomNormal(8, 1)());
      return Array.from({ length: n }, bimodal);
    case 'uniform':
      return Array.from({ length: n }, () => Math.random() * 10);
    default: // 'normal'
      return Array.from({ length: n }, randomNormal(5, 1.5));
  }
};

const binData = (data: number[], numBins: number): { name: string; value: number; x0: number; x1: number }[] => {
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
    if (binIndex >= numBins) binIndex = numBins - 1; // Ensure it stays in bounds
    if(bins[binIndex]) {
       bins[binIndex].value++;
   }
  }
  return bins;
};

// --- Main Component ---
export default function CltDiscoveryLab() {
  // --- State Management ---
  const [scene, setScene] = useState<Scene>('SCENE_1_CHAOS');
  const [populationType, setPopulationType] = useState('positive-skew');
  const [populationData, setPopulationData] = useState<number[]>(() => generateData('positive-skew', 10000));
  const [sampleMeans, setSampleMeans] = useState<number[]>([]);
  const [sampleSize, setSampleSize] = useState(30);
  const [numSamples, setNumSamples] = useState(5000);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showTheoretical, setShowTheoretical] = useState(false);
  
  // --- Memoized Calculations ---
  const populationBinned = useMemo(() => binData(populationData, 40), [populationData]);
  const sampleMeansBinned = useMemo(() => binData(sampleMeans, 40), [sampleMeans]);
  
  const populationMean = useMemo(() => populationData.reduce((a, b) => a + b, 0) / populationData.length, [populationData]);
  const populationStdDev = useMemo(() => {
    const mean = populationMean;
    const variance = populationData.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / populationData.length;
    return Math.sqrt(variance);
  }, [populationData, populationMean]);

  const theoreticalMean = populationMean;
  const theoreticalStdDev = populationStdDev / Math.sqrt(sampleSize);

  const normalPDF = (x: number, mean: number, stdDev: number) => {
    if (stdDev <= 0) return 0;
    return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
  };

  const theoreticalCurveData = useMemo(() => {
    if (!showTheoretical || sampleMeansBinned.length === 0 || theoreticalStdDev <= 0) return [];
    const binInfo = sampleMeansBinned[0];
    if (!binInfo || binInfo.x1 - binInfo.x0 <= 0) return [];
    
    const binSize = binInfo.x1 - binInfo.x0;
    const scale = sampleMeans.length * binSize;
      
    return sampleMeansBinned.map(bin => ({
      x: bin.x0 + binSize / 2,
      y: normalPDF(bin.x0 + binSize / 2, theoreticalMean, theoreticalStdDev) * scale
    }));
  }, [sampleMeansBinned, theoreticalMean, theoreticalStdDev, sampleMeans.length, showTheoretical]);


  // --- Event Handlers ---
  const handlePopulationChange = useCallback((value: string) => {
    setPopulationType(value);
    setPopulationData(generateData(value, 10000));
    setSampleMeans([]);
    setShowTheoretical(false);
    if (scene === 'SCENE_4_LAB') {
      runSimulation();
    }
  }, [scene]);

  const handleTakeOneSample = () => {
    const sample = Array.from({ length: sampleSize }, () => populationData[Math.floor(Math.random() * populationData.length)]);
    const mean = sample.reduce((a, b) => a + b, 0) / sampleSize;
    setSampleMeans([mean]);
    setScene('SCENE_2_FIRST_SPOONFUL');
  };
  
  const runSimulation = useCallback(() => {
    setIsSimulating(true);
    setSampleMeans([]);
  
    let means: number[] = [];
    let i = 0;
    const step = () => {
      if (i >= numSamples) {
        setIsSimulating(false);
        if (scene !== 'SCENE_4_LAB') {
            setScene('SCENE_3_MAGIC_TRICK');
        }
        return;
      }
      
      const sample = Array.from({ length: sampleSize }, () => populationData[Math.floor(Math.random() * populationData.length)]);
      const mean = sample.reduce((a, b) => a + b, 0) / sampleSize;
      means.push(mean);
  
      // Batch updates for performance
      if (i % 50 === 0 || i === numSamples - 1) {
        setSampleMeans([...means]);
      }
      
      i++;
      setTimeout(step, 0);
    };
  
    step();
  }, [numSamples, sampleSize, populationData, scene]);


  // --- UI Components ---
  const Scene1Content = () => (
    <div className="text-center">
        <h2 className="font-headline text-2xl md:text-3xl text-muted-foreground">If we take an average from this weird data, what will it look like?</h2>
        <Button size="lg" className="mt-8 font-headline text-lg" onClick={handleTakeOneSample}>
            Take One Sample <ArrowRight className="ml-2"/>
        </Button>
    </div>
  );

  const Scene2Content = () => (
    <div className="text-center">
        <p className="font-headline text-2xl md:text-3xl text-muted-foreground">Okay, that's one average. Not very useful.</p>
        <p className="font-headline text-2xl md:text-3xl text-muted-foreground mt-2">What if we did this 5,000 times?</p>
        <Button size="lg" className="mt-8 font-headline text-lg" onClick={runSimulation}>
            {isSimulating ? 'Simulating...' : 'Run the Simulation'}
        </Button>
    </div>
  );

  const Scene3Content = () => (
    <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 1.5, duration: 1}} className="text-center">
        <h2 className="font-headline text-3xl md:text-5xl text-primary">From chaos comes order.</h2>
        <p className="font-headline text-2xl md:text-3xl text-muted-foreground mt-2">This is the Central Limit Theorem.</p>
        <Button size="lg" className="mt-8 font-headline text-lg" onClick={() => setScene('SC_ENE_4_LAB')}>
            Enter the Lab <ArrowRight className="ml-2"/>
        </Button>
    </motion.div>
  );

  const LabControls = () => (
     <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.5}} className="space-y-6">
        <div>
            <Label>Population Shape</Label>
            <Select value={populationType} onValueChange={handlePopulationChange} disabled={isSimulating}>
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
            <Label>Sample Size: {sampleSize}</Label>
            <Slider disabled={isSimulating} value={[sampleSize]} onValueChange={([v]) => setSampleSize(v)} onValueCommit={runSimulation} min={2} max={200} step={1} />
        </div>
         <div className="flex items-center space-x-2 pt-4">
           <Switch id="theoretical-curve" checked={showTheoretical} onCheckedChange={setShowTheoretical} />
           <Label htmlFor="theoretical-curve">Show Theoretical Curve</Label>
        </div>
    </motion.div>
  );

  return (
    <div className="w-full space-y-8 p-4 md:p-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* --- Left Panel --- */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>The Population</CardTitle>
            <CardDescription>The messy, unpredictable dataset we start with.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={populationBinned} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} interval="auto"/>
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[0, 'dataMax']} />
                <Bar dataKey="value" fill="hsl(var(--secondary))" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            {scene === 'SCENE_4_LAB' && <LabControls />}
          </CardContent>
        </Card>

        {/* --- Right Panel --- */}
        <div className="space-y-8 lg:col-span-2">
          <Card className="flex min-h-[400px] flex-col items-center justify-center">
            <CardContent className="pt-6 w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={scene}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="w-full"
                >
                  {scene === 'SCENE_1_CHAOS' && <Scene1Content />}
                  {scene === 'SCENE_2_FIRST_SPOONFUL' && <Scene2Content />}
                  {scene === 'SCENE_3_MAGIC_TRICK' && <Scene3Content />}
                  {scene === 'SCENE_4_LAB' && <Scene3Content />}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
          
          <AnimatePresence>
          {scene !== 'SCENE_1_CHAOS' && (
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 1}}>
                 <Card>
                    <CardHeader>
                        <CardTitle>Distribution of Sample Averages</CardTitle>
                        <CardDescription>
                            {isSimulating ? "Watching the pattern emerge..." : "The final result of our experiment."}
                            <span className="font-bold text-primary ml-4">Samples: {sampleMeans.length.toLocaleString()}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={sampleMeansBinned} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <XAxis dataKey="name" type="number" domain={['dataMin', 'dataMax']} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false}/>
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[0, 'dataMax']}/>
                                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
                                {showTheoretical && theoreticalCurveData.length > 0 && (
                                    <Line
                                        data={theoreticalCurveData}
                                        type="monotone"
                                        dataKey="y"
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
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
