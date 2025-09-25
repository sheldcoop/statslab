'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function gaussian(x: number, mu: number, sigma: number) {
  return Math.exp(-Math.pow(x - mu, 2) / (2 * Math.pow(sigma, 2)));
}

export default function Statistics() {
  const pointsRef = useRef<any>();
  const lineRef = useRef<any>();

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 5000; i++) {
      const x = (Math.random() - 0.5) * 5;
      const z = (Math.random() - 0.5) * 5;
      const y = gaussian(Math.sqrt(x ** 2 + z ** 2), 0, 1) * 2;
      
      if (Math.random() < y / 2) {
         temp.push(x, y, z);
      }
    }
    return new Float32Array(temp);
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={particles}
            count={particles.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.02} color="hsl(var(--secondary))" />
      </points>
    </>
  );
}
