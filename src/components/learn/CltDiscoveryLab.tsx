
'use client';

import {
  randomBates,
  randomBernoulli,
  randomBeta,
  randomCauchy,
  randomExponential,
  randomGamma,
  randomGeometric,
  randomInt,
  randomIrwinHall,
  randomLogNormal,
  randomNormal,
  randomPareto,
  randomPoisson,
  randomUlam,
  randomUniform,
  randomWeibull,
} from 'd3-random';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Play, RotateCw } from 'lucide-react';
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
  Label as RechartsLabel,
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
import {
  Tooltip as UiTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// --- Types & Helper Functions ---

type DistributionShape =
  | 'positive-skew'
  | 'negative-skew'
  | 'bimodal'
  | 'uniform'
  | 'normal'
  | 'exponential'
  | 'lognormal'
  | 'poisson'
  | 'chi-squared';

  const binData = (data: number[], numBins: number) => {
    if (!data || data.length === 0) return [];
  
    const sortedData = [...data].sort((a, b) => a - b);
    const min = sortedData[0];
    const max = sortedData[sortedData.length - 1];
    
    // Use percentiles for range to protect against extreme outliers in skewed distributions
    const percentileMin = sortedData[Math.floor(0.01 * sortedData.length)];
    const percentileMax = sortedData[Math.floor(0.99 * sortedData.length)];
  
    const displayMin = Math.min(min, percentileMin);
    const displayMax = Math.max(max, percentileMax);
  
    if (displayMin === displayMax) return [{ x: displayMin, value: data.length }];
  
    const binSize = (displayMax - displayMin) / numBins;
    if (binSize <= 0) return [];
  
    const bins = Array.from({ length: numBins }, (_, i) => ({
      x: displayMin + (i + 0.5) * binSize,
      value: 0,
    }));
  
    for (const d of data) {
      if (d >= displayMin && d < displayMax) {
        const binIndex = Math.min(Math.floor((d - displayMin) / binSize), numBins - 1);
        if (bins[binIndex]) {
          bins[binIndex].value++;
        }
      }
    }
    // Add the max value to the last bin
    const maxBinIndex = bins.length -1;
    if(bins[maxBinIndex]) {
        const maxValueCount = data.filter(d => d === max).length;
        bins[maxBinIndex].value += maxValueCount;
    }
  
    return bins;
  };

// --- Custom Hooks for Logic Separation ---

const usePopulationControls = () => {
  const [shape, setShape] = useState<DistributionShape>('normal');
  const [mean, setMean] = useState(6);
  const [stdDev, setStdDev] = useState(1.5);
  const [sampleSize, setSampleSize] = useState(30);
  const [numSamples, setNumSamples] = useState(5000);
  const [animationSpeed, setAnimationSpeed] = useState(100);

  const controls = {
    shape,
    setShape,
    mean,
    setMean,
    stdDev,
    setStdDev,
    sampleSize,
    setSampleSize,
    numSamples,
    setNumSamples,
    animationSpeed,
    setAnimationSpeed,
  };

  const reset = () => {
    setShape('normal');
    setMean(6);
    setStdDev(1.5);
    setSampleSize(30);
    setNumSamples(5000);
    setAnimationSpeed(100);
  };

  return { controls, reset };
};

const usePopulation = (
  shape: DistributionShape,
  mean: number,
  stdDev: number
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [populationData, setPopulationData] = useState<number[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const count = 20000;

    const generatePopulationData = () => {
      // Chi-squared needs special handling for its parameters
      if (shape === 'chi-squared') {
        const k = Math.max(1, Math.round(mean)); // degrees of freedom must be integer >= 1
        const standardNormal = randomNormal(0, 1);
        return Array.from({ length: count }, () => {
          let sum = 0;
          for (let i = 0; i < k; i++) {
            sum += Math.pow(standardNormal(), 2);
          }
          return sum;
        });
      }

      switch (shape) {
        case 'positive-skew':
          return Array.from({ length: count }, randomLogNormal(Math.log(mean) - 0.5 * Math.log(1 + Math.pow(stdDev, 2) / Math.pow(mean, 2)), Math.sqrt(Math.log(1 + Math.pow(stdDev, 2) / Math.pow(mean, 2)))));
        case 'negative-skew':
          const logNormalGen = randomLogNormal(Math.log(mean) - 0.5 * Math.log(1 + Math.pow(stdDev, 2) / Math.pow(mean, 2)), Math.sqrt(Math.log(1 + Math.pow(stdDev, 2) / Math.pow(mean, 2))));
          return Array.from({ length: count }, () => mean * 2 - logNormalGen());
        case 'bimodal': {
          const mean1 = mean - stdDev * 1.5;
          const mean2 = mean + stdDev * 1.5;
          const dist1 = Array.from({ length: count / 2 }, randomNormal(mean1, stdDev * 0.6));
          const dist2 = Array.from({ length: count / 2 }, randomNormal(mean2, stdDev * 0.6));
          return [...dist1, ...dist2];
        }
        case 'uniform':
          const range = stdDev * Math.sqrt(12);
          const min = mean - range / 2;
          return Array.from({ length: count }, () => min + Math.random() * range);
        case 'exponential':
            return Array.from({ length: count }, randomExponential(1 / mean));
        case 'lognormal':
            return Array.from({ length: count }, randomLogNormal(Math.log(mean) - 0.5 * Math.log(1 + Math.pow(stdDev, 2) / Math.pow(mean, 2)), Math.sqrt(Math.log(1 + Math.pow(stdDev, 2) / Math.pow(mean, 2)))));
        case 'poisson':
            return Array.from({ length: count }, randomPoisson(mean));
        case 'normal':
        default:
          return Array.from({ length: count }, randomNormal(mean, stdDev));
      }
    };
    
    setPopulationData(generatePopulationData());
    setIsLoading(false);
  }, [shape, mean, stdDev]);

  const { populationMean, populationStdDev } = useMemo(() => {
    if (!populationData || populationData.length === 0) return { populationMean: 0, populationStdDev: 0 };
    const mean = populationData.reduce((a, b) => a + b, 0) / populationData.length;
    const variance = populationData.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / populationData.length;
    return { populationMean: mean, populationStdDev: Math.sqrt(variance) };
  }, [populationData]);

  return { populationData, populationMean, populationStdDev, isLoading };
};

const useSimulation = (
    populationData: number[], 
    sampleSize: number, 
    numSamples: number,
    animationSpeed: number
) => {
    const [sampleMeans, setSampleMeans] = useState<number[]>([]);
    const [isSimulating, setIsSimulating] = useState(false);
    const simulationRef = useRef<{ stop: boolean; timeoutId?: NodeJS.Timeout }>({ stop: false });

    const runSimulation = useCallback(() => {
        if (isSimulating || populationData.length === 0) return;
    
        simulationRef.current.stop = false;
        setSampleMeans([]);
        setIsSimulating(true);
    
        let means: number[] = [];
        const delay = 500 / animationSpeed; // Higher speed = lower delay

        const simulationStep = () => {
          if (simulationRef.current.stop || means.length >= numSamples) {
            setIsSimulating(false);
            simulationRef.current.timeoutId = undefined;
            return;
          }
    
          const sample = Array.from(
            { length: sampleSize },
            () => populationData[Math.floor(Math.random() * populationData.length)]
          );
          const mean = sample.reduce((a, b) => a + b, 0) / sampleSize;

          means = [...means, mean];
          setSampleMeans(means);
    
          simulationRef.current.timeoutId = setTimeout(simulationStep, delay);
        };
    
        simulationStep();
      }, [sampleSize, numSamples, populationData, isSimulating, animationSpeed]);

    const stopSimulation = useCallback(() => {
        simulationRef.current.stop = true;
        if (simulationRef.current.timeoutId) {
          clearTimeout(simulationRef.current.timeoutId);
          simulationRef.current.timeoutId = undefined;
        }
        setIsSimulating(false);
    }, []);

    const resetSimulation = useCallback(() => {
        stopSimulation();
        setSampleMeans([]);
    }, [stopSimulation]);

    const { simulatedMean, simulatedStdDev } = useMemo(() => {
        if (!sampleMeans || sampleMeans.length < 2) return { simulatedMean: NaN, simulatedStdDev: NaN };
        const mean = sampleMeans.reduce((a, b) => a + b, 0) / sampleMeans.length;
        const variance = sampleMeans.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / sampleMeans.length;
        return { simulatedMean: mean, simulatedStdDev: Math.sqrt(variance) };
    }, [sampleMeans]);

    return { 
        sampleMeans, 
        isSimulating, 
        runSimulation, 
        resetSimulation, 
        simulatedMean, 
        simulatedStdDev
    };
};

// --- Child Components ---

const Section = ({ children, ...props }: React.ComponentProps<typeof motion.div>) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        {...props}
    >
        {children}
    </motion.div>
);

const AnalysisStat = ({ label, value, theoreticalValue }: { label: string; value: number; theoreticalValue?: number }) => (
    <div className="flex items-baseline justify-between text-sm">
        <p className="text-muted-foreground">{label}</p>
        <div className="flex items-baseline gap-2 font-mono">
            {theoreticalValue !== undefined && !isNaN(theoreticalValue) && (
                <p className="text-xs text-muted-foreground/80" title="Theoretical Value">
                    ({theoreticalValue.toFixed(3)})
                </p>
            )}
            <p className="font-bold text-foreground">{!isNaN(value) ? value.toFixed(3) : '...'}</p>
        </div>
    </div>
);

const SliderWithTooltip = ({ label, value, onValueChange, ...props }: Omit<React.ComponentProps<typeof Slider>, 'onValueChange'> & { label: string; onValueChange: (value: number) => void; }) => (
    <TooltipProvider>
      <UiTooltip>
        <TooltipTrigger className="w-full">
          <div>
              <Label>{label}: {value[0].toLocaleString()}</Label>
              <Slider value={value} onValueChange={(values) => onValueChange(values[0])} {...props} />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{value[0].toLocaleString()}</p>
        </TooltipContent>
      </UiTooltip>
    </TooltipProvider>
);

const LabControls = ({ controls, isSimulating, onRun, onReset }: { controls: any, isSimulating: boolean, onRun: () => void, onReset: () => void }) => {
    const { shape, setShape, mean, setMean, stdDev, setStdDev, sampleSize, setSampleSize, numSamples, setNumSamples, animationSpeed, setAnimationSpeed } = controls;
    const [showTheoretical, setShowTheoretical] = useState(true);

    const handleParamChange = (setter: (value: number) => void) => (value: number) => {
        onReset();
        setter(value);
    };

    const handleShapeChange = (newShape: DistributionShape) => {
        onReset();
        setShape(newShape);
    }
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>The Laboratory</CardTitle>
                <CardDescription>The engine of discovery.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
                <div>
                    <Label>Population Shape</Label>
                    <Select value={shape} onValueChange={handleShapeChange} disabled={isSimulating}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="positive-skew">Skewed (Positive)</SelectItem>
                            <SelectItem value="negative-skew">Skewed (Negative)</SelectItem>
                            <SelectItem value="bimodal">Bimodal</SelectItem>
                            <SelectItem value="uniform">Uniform</SelectItem>
                            <SelectItem value="exponential">Exponential</SelectItem>
                            <SelectItem value="lognormal">Lognormal</SelectItem>
                            <SelectItem value="poisson">Poisson</SelectItem>
                            <SelectItem value="chi-squared">Chi-squared</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <SliderWithTooltip
                  label="Population Mean"
                  value={[mean]}
                  onValueChange={handleParamChange(setMean)}
                  min={shape === 'chi-squared' ? 1 : 0} max={12} step={0.5}
                  disabled={isSimulating}
                />
                <SliderWithTooltip
                  label="Population Std. Dev"
                  value={[stdDev]}
                  onValueChange={handleParamChange(setStdDev)}
                  min={0.5} max={5} step={0.1}
                  disabled={isSimulating || shape === 'poisson' || shape === 'chi-squared'}
                />
                <SliderWithTooltip
                  label="Sample Size"
                  value={[sampleSize]}
                  onValueChange={handleParamChange(setSampleSize)}
                  min={2} max={200} step={1}
                  disabled={isSimulating}
                />
                <SliderWithTooltip
                  label="Number of Samples"
                  value={[numSamples]}
                  onValueChange={handleParamChange(setNumSamples)}
                  min={100} max={20000} step={100}
                  disabled={isSimulating}
                />
                 <SliderWithTooltip
                  label="Animation Speed (Batches)"
                  value={[animationSpeed]}
                  onValueChange={setAnimationSpeed}
                  min={10} max={500} step={10}
                  disabled={isSimulating}
                />

                <div className="space-y-2 pt-2">
                    <Button onClick={onRun} disabled={isSimulating} className="w-full">
                        {isSimulating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Simulating...</> : <><Play className="mr-2 h-4 w-4" />Run New Simulation</>}
                    </Button>
                    <Button onClick={onReset} className="w-full" variant="outline"><RotateCw className="mr-2 h-4 w-4" />Reset</Button>
                </div>
                <div className="flex items-center space-x-2 pt-4">
                    <Switch id="theoretical-curve" checked={showTheoretical} onCheckedChange={setShowTheoretical}/>
                    <Label htmlFor="theoretical-curve">Show Theoretical Curve</Label>
                </div>
            </CardContent>
        </Card>
    );
};

const PopulationChart = React.memo(({ data, mean, stdDev, isLoading }: { data: number[], mean: number, stdDev: number, isLoading: boolean }) => {
    const binnedData = useMemo(() => binData(data, 20), [data]);
    return (
        <Card>
            <CardHeader>
                <CardTitle>Population Distribution</CardTitle>
                <CardDescription>
                    This is the world our data lives in. μ = {mean.toFixed(2)}, σ = {stdDev.toFixed(2)}
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[200px] pr-4">
                {isLoading ? (
                     <div className="flex h-full items-center justify-center text-muted-foreground">
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        Generating Population...
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={binnedData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                            <XAxis dataKey="x" type="number" domain={['dataMin', 'dataMax']} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => Number(value).toFixed(1)} />
                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => (v > 0 ? v : '')} width={30} />
                            <Tooltip cursor={{ fill: 'hsla(var(--muted) / 0.1)' }} contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)', }} labelFormatter={(label) => `~ ${Number(label).toFixed(2)}`} />
                            <Bar dataKey="value" fill="hsl(var(--secondary))" radius={[2, 2, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
});
PopulationChart.displayName = 'PopulationChart';

const SampleMeansChart = React.memo(({
  data,
  theoreticalMean,
  theoreticalStdErr,
  showTheoreticalCurve,
  isSimulating,
}: {
  data: number[];
  theoreticalMean: number;
  theoreticalStdErr: number;
  showTheoreticalCurve: boolean;
  isSimulating: boolean;
}) => {
  const binnedData = useMemo(() => binData(data, 20), [data]);

  const normalPDF = (x: number, mean: number, stdDev: number) => {
    if (stdDev <= 0) return 0;
    return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
  };

  const theoreticalCurveData = useMemo(() => {
    if (!binnedData.length || !data.length || !theoreticalStdErr || binnedData.length < 2) return [];
    const binSize = binnedData[1].x - binnedData[0].x;
    const scale = data.length * binSize;
    return binnedData.map(bin => ({
      x: bin.x,
      y: normalPDF(bin.x, theoreticalMean, theoreticalStdErr) * scale
    }));
  }, [binnedData, theoreticalMean, theoreticalStdErr, data.length]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={binnedData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
        <XAxis dataKey="x" type="number" domain={['dataMin', 'dataMax']} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => Number(value).toFixed(1)} />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} width={40} tickFormatter={(v) => (v > 0 ? v : '')} />
        <Tooltip cursor={{ fill: 'hsla(var(--muted) / 0.1)' }} contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)', }} labelFormatter={(label) => `~ ${Number(label).toFixed(2)}`} />
        <Bar dataKey="value" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} maxBarSize={40} animationDuration={isSimulating ? 0 : 300} />
        {showTheoreticalCurve && theoreticalMean > 0 && (
          <ReferenceLine x={theoreticalMean} stroke="hsl(var(--accent))" strokeDasharray="3 3" strokeWidth={2}>
            <RechartsLabel value="μ" fill="hsl(var(--accent))" position="insideTop" />
          </ReferenceLine>
        )}
        {showTheoreticalCurve && theoreticalCurveData.length > 1 && (
          <Line dataKey="y" data={theoreticalCurveData} type="monotone" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} animationDuration={300} />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
});
SampleMeansChart.displayName = 'SampleMeansChart';


// --- Main Component ---
export default function CltDiscoveryLab() {
    const { controls, reset: resetControls } = usePopulationControls();
    const [showTheoretical, setShowTheoretical] = useState(true);

    const { populationData, populationMean, populationStdDev, isLoading } = usePopulation(controls.shape, controls.mean, controls.stdDev);

    const { 
        sampleMeans, 
        isSimulating, 
        runSimulation, 
        resetSimulation,
        simulatedMean,
        simulatedStdDev
    } = useSimulation(populationData, controls.sampleSize, controls.numSamples, controls.animationSpeed);

    const theoreticalStdErr = useMemo(() => populationStdDev / Math.sqrt(controls.sampleSize), [populationStdDev, controls.sampleSize]);
    
    const handleFullReset = () => {
        resetSimulation();
        resetControls();
    };

    return (
        <div className="w-full space-y-8 p-4 md:p-8">
            <Section key="lab" className="text-center">
                <h2 className="font-headline text-4xl text-primary md:text-5xl">The Discovery Lab</h2>
                <p className="mx-auto mt-4 max-w-3xl text-muted-foreground">From chaos comes order. Change the population, adjust the sample size, and see how the Central Limit Theorem works its magic every time.</p>
            </Section>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <motion.div 
                    className="lg:col-span-1"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                    <LabControls 
                        controls={controls}
                        isSimulating={isSimulating}
                        onRun={runSimulation}
                        onReset={resetSimulation}
                    />
                </motion.div>
                
                <div className="space-y-8 lg:col-span-2">
                    <PopulationChart data={populationData} mean={populationMean} stdDev={populationStdDev} isLoading={isLoading} />
                    
                    <Section key="sample_means_chart">
                        <Card>
                            <CardHeader>
                                <CardTitle>Distribution of Sample Averages</CardTitle>
                                <AnimatePresence>
                                {sampleMeans.length > 1 && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                                        <CardDescription>Analysis of {sampleMeans.length.toLocaleString()} sample averages.</CardDescription>
                                    </motion.div>
                                )}
                                </AnimatePresence>
                            </CardHeader>
                            <CardContent className="h-[300px] pl-2 pr-6">
                                <SampleMeansChart
                                  data={sampleMeans}
                                  theoreticalMean={populationMean}
                                  theoreticalStdErr={theoreticalStdErr}
                                  showTheoreticalCurve={showTheoretical}
                                  isSimulating={isSimulating}
                                />
                            </CardContent>
                            <AnimatePresence>
                                {sampleMeans.length > 1 && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto', transition: { delay: 0.3 } }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                        <CardContent className="border-t pt-4 space-y-2">
                                            <AnalysisStat label="Simulated Mean" value={simulatedMean} theoreticalValue={populationMean} />
                                            <AnalysisStat label="Simulated Std. Error" value={simulatedStdDev} theoreticalValue={theoreticalStdErr} />
                                        </CardContent>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Card>
                    </Section>
                </div>
            </div>
        </div>
    );
}
