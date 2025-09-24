"use client";

import { useRef, useMemo } from 'react';
import type { MotionValue } from 'framer-motion';
import { Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SceneTimeSeriesProps {
  opacity: MotionValue<number>;
}

export function SceneTimeSeries({ opacity }: SceneTimeSeriesProps) {
  const lineRef = useRef<any>(null);

  const points = useMemo(() => {
    const p = [];
    for (let i = 0; i < 50; i++) {
      p.push(new THREE.Vector3(i - 25, Math.sin(i * 0.5) * 2 * Math.cos(i*0.2), 0));
    }
    return p;
  }, []);

  useFrame(() => {
    if (lineRef.current) {
        const currentOpacity = opacity.get();
        lineRef.current.material.opacity = currentOpacity;
        lineRef.current.visible = currentOpacity > 0;
    }
  });

  return (
    <Line
      ref={lineRef}
      points={points}
      color="hsl(var(--primary))"
      lineWidth={10}
      dashed={false}
      material-transparent={true}
      material-opacity={0}
      material-emissive="hsl(var(--primary))"
      material-emissiveIntensity={2}
    />
  );
}
