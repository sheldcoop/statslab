'use client';

import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  Cpu,
  Database,
  FunctionSquare,
  Sigma,
  TrendingUp,
  Variable,
  Waypoints,
  TestTube2,
  BrainCircuit,
  Scaling,
  Timer,
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import React from 'react';

// --- Animation Variants ---
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98, filter: 'blur(3px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

// --- Page Data ---
const pageData: { [key: string]: any } = {
  statistics: {
    title: 'Statistics & Probability',
    description:
      'Master the art of quantifying uncertainty and finding the signal in the noise. This is the foundation of data-driven decision-making in finance.',
    sections: [
      {
        title: 'Foundations of Data (Beginner)',
        description:
          'Start with the absolute essentials. These concepts are the building blocks for everything that follows.',
        items: [
          {
            icon: Calculator,
            title: 'Descriptive Statistics',
            description:
              'Summarizing data with mean, median, mode, and variance.',
            href: '/learn/statistics/descriptive-statistics',
          },
          {
            icon: Database,
            title: 'Data Visualization',
            description: 'The power of histograms, box plots, and scatter plots.',
            href: '/learn/statistics/data-visualization',
          },
          {
            icon: Sigma,
            title: 'Probability Theory',
            description: 'Understanding the laws of chance and likelihood.',
            href: '/learn/statistics/probability-theory',
          },
          {
            icon: TrendingUp,
            title: 'Common Distributions',
            description:
              'Normal, Binomial, and Poisson distributions explained.',
            href: '/learn/statistics/common-distributions',
          },
        ],
      },
      {
        title: 'Inferential Statistics (Intermediate)',
        description:
          'Bridge the gap between describing data and making predictions from it. This is the core of practical data science.',
        items: [
          {
            icon: Scaling,
            title: 'Sampling and Estimation',
            description: 'Using samples to estimate population parameters and confidence intervals.',
            href: '/learn/statistics/sampling-and-estimation',
          },
          {
            icon: TestTube2,
            title: 'Hypothesis Testing',
            description:
              'Formulating and testing claims with data (p-values, A/B tests).',
            href: '/learn/statistics/hypothesis-testing',
          },
          {
            icon: Waypoints,
            title: 'Regression Analysis',
            description: 'Modeling the relationship between variables.',
            href: '/learn/statistics/regression-analysis',
          },
          {
            icon: Variable,
            title: 'Correlation vs. Causation',
            description: 'A critical distinction for any data scientist.',
            href: '/learn/statistics/correlation-vs-causation',
          },
        ],
      },
      {
        title: 'Advanced Financial Modeling (Advanced)',
        description:
          'Explore specialized methods essential for modern quantitative finance.',
        items: [
          {
            icon: Cpu,
            title: 'Monte Carlo Simulation',
            description: 'Modeling outcomes for complex, random systems.',
            href: '/learn/statistics/monte-carlo-simulation',
          },
          {
            icon: Timer,
            title: 'Time Series Analysis',
            description: 'Analyzing data points indexed in time (stationarity, ARIMA).',
            href: '/learn/statistics/time-series-analysis',
          },
          {
            icon: BrainCircuit,
            title: 'Bayesian Statistics',
            description: 'Updating beliefs in light of new evidence.',
            href: '/learn/statistics/bayesian-statistics',
          },
          {
            icon: FunctionSquare,
            title: 'Stochastic Processes',
            description: 'Understanding random walks and time-dependent systems.',
            href: '/learn/statistics/stochastic-processes',
          },
        ],
      },
    ],
  },
};

const GenericPage = ({ title }: { title: string }) => (
  <div className="flex flex-1 flex-col items-center justify-center p-4 text-center md:p-6">
    <div className="space-y-4">
      <h1 className="font-headline text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl">
        {title}
      </h1>
      <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
        This is a placeholder page for the {title} module. Content will be
        added here soon.
      </p>
    </div>
  </div>
);

const StatisticsPage = () => {
  const data = pageData.statistics;
  return (
    <div className="flex-1 overflow-x-hidden">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="w-full py-24 md:py-32 lg:py-48"
      >
        <div className="container mx-auto px-4 text-center md:px-6">
          <div className="mx-auto max-w-4xl">
            <h1 className="font-headline text-5xl font-bold tracking-tighter sm:text-7xl md:text-8xl">
              {data.title}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              {data.description}
            </p>
          </div>
        </div>
      </motion.section>

      {/* Sections */}
      {data.sections.map((section: any, index: number) => (
        <motion.section
          key={index}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          className={`w-full py-16 md:py-24 ${
            index % 2 === 1 ? 'bg-card/50' : ''
          }`}
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <h2 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
                {section.title}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                {section.description}
              </p>
            </div>
            <motion.div
              variants={gridVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            >
              {section.items.map((item: any) => {
                const Icon = item.icon;
                return (
                  <Link href={item.href} key={item.title} className="block h-full">
                    <motion.div variants={cardVariants}>
                       <motion.div
                        whileHover={{ scale: 1.04, y: -5 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="h-full"
                      >
                        <Card className="flex h-full flex-col border-transparent transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
                          <CardHeader>
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                              <Icon className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle>{item.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="flex-grow">
                            <CardDescription>{item.description}</CardDescription>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </motion.div>
                  </Link>
                );
              })}
            </motion.div>
          </div>
        </motion.section>
      ))}

      {/* CTA Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={sectionVariants}
        className="w-full py-20 md:py-28"
      >
        <div className="container mx-auto text-center">
          <h2 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
            Ready to Dive In?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            The best way to learn is by doing. Launch the terminal to start
            experimenting with these concepts right away.
          </p>
          <motion.div
            whileHover={{ scale: 1.05, boxShadow: '0px 10px 30px -5px hsla(var(--primary), 0.3)' }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="mt-8 inline-block"
          >
            <Button size="lg" className="font-headline text-lg shadow-lg shadow-primary/20">
              Launch Terminal <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default function ModulePage({ params }: { params: { slug: string } }) {
  if (!params || !params.slug) {
    return null; // or a loading skeleton
  }

  const title = params.slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const renderContent = () => {
    switch (params.slug) {
      case 'statistics':
        return <StatisticsPage />;
      default:
        return <GenericPage title={title} />;
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background/90 px-4 backdrop-blur-sm md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold text-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Home
        </Link>
      </header>
      <main className="flex flex-1 flex-col">{renderContent()}</main>
    </div>
  );
}
