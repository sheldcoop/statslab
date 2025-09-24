'use server';
/**
 * @fileOverview A statistics utility flow for generating data distributions.
 *
 * - generateDistribution - A function that generates data for a specified statistical distribution.
 * - DistributionInputSchema - The input type for the generateDistribution function.
 * - DistributionOutputSchema - The return type for the generateDistribution function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  randomNormal,
  randomUniform,
  randomBeta,
} from 'd3-random';

export const DistributionInputSchema = z.object({
  distribution: z.enum(['normal', 'uniform', 'beta', 'bimodal', 'positive-skew', 'negative-skew']),
  mean: z.number().optional(),
  stdDev: z.number().optional(),
  alpha: z.number().optional(),
  beta: z.number().optional(),
  count: z.number(),
});

export type DistributionInput = z.infer<typeof DistributionInputSchema>;

export const DistributionOutputSchema = z.object({
  data: z.array(z.number()),
});

export type DistributionOutput = z.infer<typeof DistributionOutputSchema>;

function generateData(input: DistributionInput): number[] {
  const { distribution, count, mean = 5, stdDev = 1.5, alpha = 2, beta = 5 } = input;
  switch (distribution) {
    case 'normal':
      return Array.from({ length: count }, randomNormal(mean, stdDev));
    case 'uniform':
       const halfRange = (stdDev || 1) * Math.sqrt(3);
       const min = (mean || 5) - halfRange;
       const max = (mean || 5) + halfRange;
      return Array.from({ length: count }, randomUniform(min, max));
    case 'beta':
      return Array.from({ length: count }, randomBeta(alpha, beta));
    case 'bimodal':
      const bimodal = () => (Math.random() < 0.5 ? randomNormal(mean-stdDev*1.2, stdDev*0.8)() : randomNormal(mean+stdDev*1.2, stdDev*0.8)());
      return Array.from({ length: count }, bimodal);
    case 'positive-skew':
       const logNormalMean = Math.log(mean) - 0.5 * Math.log(1 + (stdDev*stdDev) / (mean*mean));
       const logNormalStdDev = Math.sqrt(Math.log(1 + (stdDev*stdDev) / (mean*mean)));
      return Array.from({ length: count }, randomNormal(logNormalMean, logNormalStdDev)).map(v => Math.exp(v));
    case 'negative-skew':
      const negSkewGenerator = randomBeta(5, 2);
      return Array.from({ length: count }, () => mean + (negSkewGenerator() * stdDev * 3) - stdDev * 1.5);
    default:
      return [];
  }
}


export const generateDistribution = ai.defineFlow(
  {
    name: 'generateDistribution',
    inputSchema: DistributionInputSchema,
    outputSchema: DistributionOutputSchema,
  },
  async (input) => {
    const data = generateData(input);
    return { data };
  }
);
