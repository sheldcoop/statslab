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


// --- Logo Component ---
const StatSparkLogo = ({ progress }: { progress: MotionValue<number> }) => {
    const characters = 'StatSpark'.split('');
    const dotPositions: { [key: string]: { x: number; y: number }[] } = {
        'S': [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:0,y:1},{x:1,y:2},{x:2,y:3},{x:1,y:4},{x:0,y:4}],
        't': [{x:1,y:0},{x:1,y:1},{x:0,y:2},{x:1,y:2},{x:2,y:2},{x:1,y:3},{x:1,y:4}],
        'a': [{x:1,y:0},{x:0,y:1},{x:2,y:1},{x:0,y:2},{x:1,y:2},{x:2,y:2},{x:0,y:3},{x:2,y:3}],
        'S_2': [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:0,y:1},{x:1,y:2},{x:2,y:3},{x:1,y:4},{x:0,y:4}],
        'p': [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:0,y:1},{x:2,y:1},{x:0,y:2},{x:1,y:2},{x:2,y:2},{x:0,y:3},{x:0,y:4}],
        'r': [{x:0,y:0},{x:1,y:0},{x:0,y:1},{x:0,y:2},{x:1,y:2},{x:2,y:3},{x:2,y:4}],
        'k': [{x:0,y:0},{x:2,y:0},{x:0,y:1},{x:1,y:2},{x:0,y:3},{x:2,y:4},{x:0,y:4}],
    };

    const logoOpacity = useTransform(progress, [0, 0.5], [1, 0]);
    const scale = useTransform(progress, [0, 0.5], [1, 0.5]);


    return (
        <motion.div className="flex items-center justify-center h-full" style={{ opacity: logoOpacity, scale }}>
            <div className="grid grid-cols-9 gap-x-4 gap-y-2" style={{ transform: 'scale(2)'}}>
                {characters.map((char, charIndex) => (
                    <div key={charIndex} className="w-12 h-20 relative">
                        {(dotPositions[char === 'S' && charIndex > 0 ? 'S_2' : char] || []).map((pos, dotIndex) => {
                            const randomX = React.useMemo(() => (Math.random() - 0.5) * 2000, []);
                            const randomY = React.useMemo(() => (Math.random() - 0.5) * 1000, []);
                            
                            const x = useTransform(progress, [0, 1], [0, randomX]);
                            const y = useTransform(progress, [0, 1], [0, randomY]);

                            return (
                                <motion.div
                                    key={dotIndex}
                                    className="absolute w-2 h-2 bg-primary rounded-full"
                                    style={{ 
                                        left: pos.x * 20, 
                                        top: pos.y * 20,
                                        x,
                                        y,
                                    }}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
        </motion.div>
    );
};


const BGChaos = () => (
    <div className="absolute inset-0 z-0 overflow-hidden rounded-lg opacity-20">
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

const ChaosVisual = ({ scrollYProgress }: { scrollYProgress: MotionValue<number>}) => {
    const logoProgress = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
    const chaosOpacity = useTransform(logoProgress, [0.5, 1], [0, 1]);

    return (
        <VisualPlaceholder>
            <BGChaos />
            <StatSparkLogo progress={logoProgress} />
            <motion.div 
                style={{ opacity: chaosOpacity }}
                className="grid h-full w-full grid-cols-20 grid-rows-20"
            >
                {Array.from({ length: 400 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="h-1 w-1 rounded-full bg-muted/20"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                            scale: Math.random() * 1.2 + 0.1,
                            opacity: Math.random() * 0.7 + 0.2,
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
            </motion.div>
        </VisualPlaceholder>
    );
};

const LinearAlgebraVisual = () => (
  <VisualPlaceholder>
    <svg
      width="200"
      height="200"
      viewBox="-100 -100 200 200"
      className="opacity-50"
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
          <motion.line
            x1="-100"
            y1={-80 + i * 20}
            x2="100"
            y2={-80 + i * 20}
            stroke="hsl(var(--border))"
            strokeWidth="0.2"
             initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.1,
                ease: 'easeInOut',
            }}
          />
          <motion.line
            x1={-80 + i * 20}
            y1="-100"
            x2={-80 + i * 20}
            y2="100"
            stroke="hsl(var(--border))"
            strokeWidth="0.2"
             initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.1 + 0.5,
                ease: 'easeInOut',
            }}
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
  const overlap = 0.05;
  const start = range[0];
  const end = range[1];

  const opacity = useTransform(
    scrollYProgress,
    [start, start + overlap, end - overlap, end],
    [0, 1, 1, 0]
  );
  const scale = useTransform(
    scrollYProgress,
    [start, start + overlap, end - overlap, end],
    [0.95, 1, 1, 0.95]
  );
  return <motion.div style={{ opacity, scale }} className="absolute inset-0">{children}</motion.div>;
};

const ModuleGridVisual = ({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) => {
    const y = useTransform(scrollYProgress, [0.8, 1], ['100vh', '0vh']);
    const opacity = useTransform(scrollYProgress, [0.8, 1], [0, 1]);

    return (
        <motion.div style={{ y, opacity }} className="absolute inset-0">
            <ChaosVisual scrollYProgress={scrollYProgress}/>
            <ModuleGrid />
        </motion.div>
    );
};

export default function VisualsContainer({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {

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
        <PythonVisual />
      </Visual>
       <ModuleGridVisual scrollYProgress={scrollYProgress} />
    </div>
  );
}

const FirstVisual = ({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) => {
  const range: [number, number] = [0.0, 0.2];
  const overlap = 0.05;
  const start = range[0];
  const end = range[1];
  
  const opacity = useTransform(
    scrollYProgress,
    [end - overlap, end],
    [1, 0]
  );
  const scale = useTransform(
    scrollYProgress,
    [end - overlap, end],
    [1, 0.95]
  );

  return (
    <motion.div style={{ opacity, scale }} className="absolute inset-0">
      <ChaosVisual scrollYProgress={scrollYProgress} />
    </motion.div>
  );
};
