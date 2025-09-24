'use client';

import { motion, MotionValue, useTransform } from 'framer-motion';
import React from 'react';
import ModuleGrid from './ModuleGrid';

const VisualPlaceholder = ({
  children,
}: {
  children?: React.ReactNode;
}) => (
  <div
    className="absolute inset-0 flex items-center justify-center"
  >
    {children}
  </div>
);

const BGChaos = () => (
    <div className="absolute inset-0 z-0 overflow-hidden rounded-lg opacity-10">
      <svg width="100%" height="100%">
        <defs>
          <pattern
            id="chaos-grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
            patternTransform="translate(-1, -1)"
          >
            <motion.path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="0.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#chaos-grid)" />
      </svg>
    </div>
  );

const ChaosVisual = () => (
  <VisualPlaceholder>
    <BGChaos />
    <div className="grid h-full w-full grid-cols-20 grid-rows-20">
      {Array.from({ length: 400 }).map((_, i) => (
        <motion.div
          key={i}
          className="h-1 w-1 rounded-full bg-muted/20"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: Math.random() * 1.2 + 0.1,
            opacity: Math.random() * 0.4 + 0.1,
          }}
          transition={{
            duration: 0.8,
            delay: Math.random() * 2,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  </VisualPlaceholder>
);

const LinearAlgebraVisual = () => (
  <VisualPlaceholder>
    <svg
      width="200"
      height="200"
      viewBox="-100 -100 200 200"
      className="opacity-20"
    >
      {/* Axes */}
      <line
        x1="-100"
        y1="0"
        x2="100"
        y2="0"
        stroke="hsl(var(--secondary))"
        strokeWidth="0.5"
      />
      <line
        x1="0"
        y1="-100"
        x2="0"
        y2="100"
        stroke="hsl(var(--secondary))"
        strokeWidth="0.5"
      />

      {/* Grid lines */}
      {Array.from({ length: 9 }).map((_, i) => (
        <React.Fragment key={i}>
          <line
            x1="-100"
            y1={-80 + i * 20}
            x2="100"
            y2={-80 + i * 20}
            stroke="hsl(var(--border))"
            strokeWidth="0.2"
          />
          <line
            x1={-80 + i * 20}
            y1="-100"
            x2={-80 + i * 20}
            y2="100"
            stroke="hsl(var(--border))"
            strokeWidth="0.2"
          />
        </React.Fragment>
      ))}

      {/* Vector */}
      <motion.line
        x1="0"
        y1="0"
        stroke="hsl(var(--primary))"
        strokeWidth="3"
        initial={{ x2: 60, y2: -40 }}
        animate={{ x2: [-60, 60, -60], y2: [40, -40, 40] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
      />
    </svg>
  </VisualPlaceholder>
);
const StatisticsVisual = () => (
  <VisualPlaceholder>
    <svg
      width="200"
      height="100"
      viewBox="0 0 200 100"
      className="opacity-20"
      preserveAspectRatio="none"
    >
      <motion.path
        d="M 0 100 C 50 100, 75 20, 100 50 S 150 100, 200 80"
        stroke="hsl(var(--secondary))"
        fill="transparent"
        strokeWidth="2"
        initial={{ pathLength: 0, stroke: 'hsl(var(--primary))' }}
        animate={{ pathLength: 1, stroke: 'hsl(var(--secondary))' }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />
    </svg>
  </VisualPlaceholder>
);
const TimeSeriesVisual = () => (
  <VisualPlaceholder>
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
        transition={{
          duration: 2,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />
    </svg>
  </VisualPlaceholder>
);
const PythonVisual = () => (
  <VisualPlaceholder>
    <motion.code
      className="font-headline text-4xl text-primary opacity-30"
      initial={{ opacity: 0.3 }}
      animate={{ opacity: [0.3, 0.8, 0.3] }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {'< >'}
    </motion.code>
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
  const scale = useTransform(scrollYProgress, range, [0.9, 1]);
  return <motion.div style={{ opacity, scale }} className="absolute inset-0">{children}</motion.div>;
};

export default function VisualsContainer({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const finalGridY = useTransform(scrollYProgress, [0.95, 1], ['100vh', '0vh']);
  const finalGridOpacity = useTransform(scrollYProgress, [0.95, 1], [0, 1]);

  return (
    <div className="sticky top-0 h-screen w-full overflow-hidden">
      <FirstVisual scrollYProgress={scrollYProgress} />
      <Visual scrollYProgress={scrollYProgress} range={[0.2, 0.4]}>
        <LinearAlgebraVisual />
      </Visual>
      <Visual scrollYProgress={scrollYProgress} range={[0.4, 0.6]}>
        <StatisticsVisual />
      </Visual>
      <Visual scrollYProgress={scrollYProgress} range={[0.6, 0.8]}>
        <TimeSeriesVisual />
      </Visual>
      <Visual scrollYProgress={scrollYProgress} range={[0.8, 0.95]}>
        <PythonVisual />
      </Visual>
       <ModuleGridVisual scrollYProgress={scrollYProgress}>
        <motion.div style={{ y: finalGridY, opacity: finalGridOpacity }}>
          <ModuleGrid />
        </motion.div>
      </ModuleGridVisual>
    </div>
  );
}

const ModuleGridVisual = ({
  scrollYProgress,
  children,
}: {
  scrollYProgress: MotionValue<number>;
  children: React.ReactNode;
}) => {
  const opacity = useTransform(scrollYProgress, [0.95, 1], [0, 1]);
  return (
    <motion.div style={{ opacity }} className="absolute inset-0">
      <ChaosVisual />
      {children}
    </motion.div>
  );
};


const FirstVisual = ({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) => {
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  return (
    <motion.div style={{ opacity, scale }} className="absolute inset-0">
      <ChaosVisual />
    </motion.div>
  );
};
