'use client';

import { motion, MotionValue, useTransform } from 'framer-motion';
import React from 'react';
import ModuleGrid from './ModuleGrid';

const VisualPlaceholder = ({
  color,
  children,
}: {
  color: string;
  children?: React.ReactNode;
}) => (
  <div
    className="absolute inset-0 flex items-center justify-center"
    style={{ backgroundColor: color }}
  >
    {children}
  </div>
);

const ChaosVisual = () => (
  <VisualPlaceholder color="transparent">
    <div className="grid grid-cols-20 grid-rows-20 w-full h-full">
      {Array.from({ length: 400 }).map((_, i) => (
        <div
          key={i}
          className="w-1 h-1 bg-muted/20 rounded-full"
          style={{
            transform: `scale(${Math.random() * 1.5 + 0.2})`,
            opacity: Math.random() * 0.5 + 0.1,
          }}
        />
      ))}
    </div>
  </VisualPlaceholder>
);
const LinearAlgebraVisual = () => (
  <VisualPlaceholder color="transparent">
    <svg
      width="200"
      height="200"
      viewBox="-100 -100 200 200"
      className="opacity-20"
    >
      <line x1="-100" y1="0" x2="100" y2="0" stroke="hsl(var(--secondary))" />
      <line x1="0" y1="-100" x2="0" y2="100" stroke="hsl(var(--secondary))" />
      <motion.line
        x1="0"
        y1="0"
        x2="50"
        y2="-50"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
      />
    </svg>
  </VisualPlaceholder>
);
const StatisticsVisual = () => (
  <VisualPlaceholder color="transparent">
    <svg
      width="200"
      height="100"
      viewBox="0 0 200 100"
      className="opacity-20"
      preserveAspectRatio="none"
    >
      <path
        d="M 0 100 C 50 100, 75 20, 100 50 S 150 100, 200 80"
        stroke="hsl(var(--secondary))"
        fill="transparent"
        strokeWidth="2"
      />
    </svg>
  </VisualPlaceholder>
);
const TimeSeriesVisual = () => (
  <VisualPlaceholder color="transparent">
    <svg
      width="200"
      height="100"
      viewBox="0 0 200 100"
      className="opacity-20"
      preserveAspectRatio="none"
    >
      <motion.path
        d="M 0 50 Q 25 20, 50 50 T 100 50 T 150 50 T 200 50"
        stroke="hsl(var(--secondary))"
        fill="transparent"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />
    </svg>
  </VisualPlaceholder>
);
const PythonVisual = () => (
  <VisualPlaceholder color="transparent">
    <code className="text-4xl text-primary opacity-30 font-headline">
      {'< >'}
    </code>
  </VisualPlaceholder>
);

const Visual = ({
  scrollYProgress,
  range,
  children,
}: {
  scrollYProgress: MotionValue<number>;
  range: [number, number];
  children: React.ReactNode;
}) => {
  const opacity = useTransform(scrollYProgress, range, [0, 1]);
  return <motion.div style={{ opacity }}>{children}</motion.div>;
};

export default function VisualsContainer({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  return (
    <div className="sticky top-0 h-screen w-full">
      <Visual scrollYProgress={scrollYProgress} range={[0, 0.1]}>
        <ChaosVisual />
      </Visual>
      <Visual scrollYProgress={scrollYProgress} range={[0.1, 0.25]}>
        <LinearAlgebraVisual />
      </Visual>
      <Visual scrollYProgress={scrollYProgress} range={[0.25, 0.4]}>
        <StatisticsVisual />
      </Visual>
      <Visual scrollYProgress={scrollYProgress} range={[0.4, 0.55]}>
        <TimeSeriesVisual />
      </Visual>
      <Visual scrollYProgress={scrollYProgress} range={[0.55, 0.7]}>
        <PythonVisual />
      </Visual>
      <Visual scrollYProgress={scrollYProgress} range={[0.8, 1]}>
        <ModuleGrid />
      </Visual>
    </div>
  );
}
