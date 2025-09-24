"use client";

import { useRef, useMemo } from 'react';
import type { MotionValue } from 'framer-motion';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SceneStatisticsProps {
  opacity: MotionValue<number>;
}

export function SceneStatistics({ opacity }: SceneStatisticsProps) {
  const groupRef = useRef<THREE.Group>(null);

  const data = useMemo(() => [0.5, 1.2, 2.5, 4, 5, 4.2, 3, 1.8, 0.8], []);

  const materials = useMemo(() => 
    data.map(() => new THREE.MeshStandardMaterial({ 
        color: new THREE.Color('hsl(var(--accent))'),
        transparent: true, 
        opacity: 0,
        emissive: new THREE.Color('hsl(var(--accent))'),
        emissiveIntensity: 1.5
    })),
  [data]);

  useFrame(() => {
    const currentOpacity = opacity.get();
    materials.forEach((mat) => (mat.opacity = currentOpacity));
    if (groupRef.current) {
        groupRef.current.visible = currentOpacity > 0;
    }
  });

  const bars = useMemo(() => {
    const barWidth = 0.8;
    const barGap = 0.2;
    const totalWidth = data.length * (barWidth + barGap) - barGap;
    return data.map((height, i) => (
      <mesh
        key={i}
        position={[i * (barWidth + barGap) - totalWidth / 2, height / 2, 0]}
        material={materials[i]}
      >
        <boxGeometry args={[barWidth, height, barWidth]} />
      </mesh>
    ));
  }, [data, materials]);

  return <group ref={groupRef}>{bars}</group>;
}
