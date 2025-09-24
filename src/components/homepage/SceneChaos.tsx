"use client";

import { useMemo, useRef, useState, useEffect } from 'react';
import type { MotionValue } from 'framer-motion';
import { Points, PointMaterial } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { Material } from 'three';

interface SceneChaosProps {
  opacity: MotionValue<number>;
}

export function SceneChaos({ opacity }: SceneChaosProps) {
  const materialRef = useRef<Material & { opacity: number }>();
  const [points, setPoints] = useState<Float32Array | null>(null);

  useEffect(() => {
    const numPoints = 5000;
    const newPoints = new Float32Array(numPoints * 3);
    for (let i = 0; i < numPoints; i++) {
      const i3 = i * 3;
      newPoints[i3] = (Math.random() - 0.5) * 10;
      newPoints[i3 + 1] = (Math.random() - 0.5) * 10;
      newPoints[i3 + 2] = (Math.random() - 0.5) * 10;
    }
    setPoints(newPoints);
  }, []);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.opacity = opacity.get();
    }
    state.camera.lookAt(0, 0, 0);
  });

  if (!points) {
    return null;
  }

  return (
    <Points positions={points}>
      <PointMaterial
        ref={materialRef as any}
        transparent
        color="#ffffff"
        size={0.015}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}
