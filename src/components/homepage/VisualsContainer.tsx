"use client";

import { motion, type MotionValue, useTransform } from "framer-motion";
import Image from "next/image";

// Placeholder visual components
const ChaosVisual = ({ opacity }: { opacity: MotionValue<number> }) => (
  <motion.div
    style={{ opacity }}
    className="absolute inset-0 flex items-center justify-center"
  >
    <Image
      src="https://picsum.photos/seed/chaos/1200/800"
      alt="Abstract representation of chaos"
      width={1200}
      height={800}
      data-ai-hint="abstract chaos"
      className="h-full w-full object-cover"
    />
  </motion.div>
);

const LinearAlgebraVisual = ({
  opacity,
}: {
  opacity: MotionValue<number>;
}) => (
  <motion.div
    style={{ opacity }}
    className="absolute inset-0 flex items-center justify-center"
  >
    <Image
      src="https://picsum.photos/seed/linalg/1200/800"
      alt="Geometric representation of linear algebra"
      width={1200}
      height={800}
      data-ai-hint="geometric structure"
      className="h-full w-full object-cover"
    />
  </motion.div>
);

const StatisticsVisual = ({ opacity }: { opacity: MotionValue<number> }) => (
  <motion.div
    style={{ opacity }}
    className="absolute inset-0 flex items-center justify-center"
  >
    <Image
      src="https://picsum.photos/seed/stats/1200/800"
      alt="Representation of statistical patterns"
      width={1200}
      height={800}
      data-ai-hint="data patterns"
      className="h-full w-full object-cover"
    />
  </motion.div>
);

const TimeSeriesVisual = ({ opacity }: { opacity: MotionValue<number> }) => (
  <motion.div
    style={{ opacity }}
    className="absolute inset-0 flex items-center justify-center"
  >
    <Image
      src="https://picsum.photos/seed/timeseries/1200/800"
      alt="Representation of time series analysis"
      width={1200}
      height={800}
      data-ai-hint="future trends"
      className="h-full w-full object-cover"
    />
  </motion.div>
);

interface VisualsContainerProps {
  scrollYProgress: MotionValue<number>;
}

export default function VisualsContainer({
  scrollYProgress,
}: VisualsContainerProps) {
  const chaosOpacity = useTransform(scrollYProgress, [0, 0.1, 0.2, 0.25], [1, 1, 0.5, 0]);
  const linearAlgebraOpacity = useTransform(scrollYProgress, [0.2, 0.3, 0.4, 0.45], [0, 1, 1, 0]);
  const statisticsOpacity = useTransform(scrollYProgress, [0.4, 0.5, 0.6, 0.65], [0, 1, 1, 0]);
  const timeSeriesOpacity = useTransform(scrollYProgress, [0.6, 0.7, 0.8, 0.85], [0, 1, 1, 0]);

  return (
    <div className="sticky top-0 h-screen w-full overflow-hidden">
      <ChaosVisual opacity={chaosOpacity} />
      <LinearAlgebraVisual opacity={linearAlgebraOpacity} />
      <StatisticsVisual opacity={statisticsOpacity} />
      <TimeSeriesVisual opacity={timeSeriesOpacity} />
    </div>
  );
}
