'use client';
import { Canvas, useThree } from '@react-three/fiber';
import { MotionValue, useTransform } from 'framer-motion';
import { motion as m } from 'framer-motion-3d';
import { CameraControls, Environment } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { Vector3 } from 'three';

import LinearAlgebraScene from './scenes/LinearAlgebraScene';
import StatisticsScene from './scenes/StatisticsScene';
import TimeSeriesScene from './scenes/TimeSeriesScene';

function Camera({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const controlsRef = useRef<CameraControls>(null);

  const { scene } = useThree();
  const cameraPosition = useTransform(
    scrollProgress,
    [0, 0.2, 0.4, 0.6],
    [
      new Vector3(0, 0, 8),
      new Vector3(0, 0, 5),
      new Vector3(-2, 0, 8),
      new Vector3(0, 3, 7),
    ]
  );
  const cameraTarget = useTransform(
    scrollProgress,
    [0, 0.2, 0.4, 0.6],
    [
      new Vector3(0, 0, 0),
      new Vector3(0, 0, 0),
      new Vector3(-2, 0, 0),
      new Vector3(0, 0, 0),
    ]
  );

  useEffect(() => {
    if (!controlsRef.current) return;
    cameraPosition.on('change', (latest) => {
      controlsRef.current?.camera.position.set(latest.x, latest.y, latest.z);
    });
    cameraTarget.on('change', (latest) => {
      controlsRef.current?.setTarget(latest.x, latest.y, latest.z, true);
    });
  }, [cameraPosition, cameraTarget, scene]);

  return <CameraControls ref={controlsRef} smoothTime={0.2} />;
}

export default function Scene({
  scrollProgress,
}: {
  scrollProgress: MotionValue<number>;
}) {
  return (
    <Canvas>
      <m.group>
        <Camera scrollProgress={scrollProgress} />

        <m.group
          style={{
            opacity: useTransform(scrollProgress, [0.15, 0.2, 0.4, 0.45], [0, 1, 1, 0]),
          }}
        >
          <LinearAlgebraScene />
        </m.group>

        <m.group
          style={{
            opacity: useTransform(
              scrollProgress,
              [0.35, 0.4, 0.6, 0.65],
              [0, 1, 1, 0]
            ),
          }}
        >
          <StatisticsScene />
        </m.group>

        <m.group
          style={{
            opacity: useTransform(scrollProgress, [0.55, 0.6, 0.8, 0.85], [0, 1, 1, 0]),
          }}
        >
          <TimeSeriesScene />
        </m.group>
      </m.group>

      <Environment preset="city" />
    </Canvas>
  );
}

    