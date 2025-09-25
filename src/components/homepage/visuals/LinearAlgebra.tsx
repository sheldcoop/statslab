'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Euler } from 'three';

const NUM_POINTS = 500;

function FatArrow({
  dir,
  origin = [0, 0, 0],
  length = 1,
  color = 'red',
}: {
  dir: [number, number, number];
  origin?: [number, number, number];
  length?: number;
  color?: string;
}) {
  const vec = useMemo(() => new Vector3(...dir), [dir]);
  const orientation = useMemo(() => new Euler().setFromVector3(vec), [vec]);

  return (
    <mesh position={origin} rotation={orientation}>
      <coneGeometry args={[0.05 * length, 0.2 * length, 8]} position={[0, length - 0.1 * length, 0]} />
      <meshStandardMaterial color={color} />
      <cylinderGeometry args={[0.02 * length, 0.02 * length, length]} position={[0, length / 2, 0]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export default function LinearAlgebra() {
  const pointsRef = useRef<any>();

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < NUM_POINTS; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const x = -1 + Math.random() * 2;
      const y = -1 + Math.random() * 2;
      const z = -1 + Math.random() * 2;

      temp.push({ t, factor, speed, x, y, z });
    }
    return temp;
  }, []);

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.001;
      pointsRef.current.rotation.x += 0.0005;
    }
  });

  return (
    <>
      <group ref={pointsRef}>
        {particles.map((particle, i) => (
          <mesh
            key={i}
            position={[particle.x * 2, particle.y * 2, particle.z * 2]}
            scale={[0.01, 0.01, 0.01]}
          >
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="hsl(var(--primary))" emissive="hsl(var(--primary))" emissiveIntensity={0.5} />
          </mesh>
        ))}
      </group>
      
      {/* Axes */}
      <FatArrow dir={[1, 0, 0]} length={2} color="#f25050" />
      <FatArrow dir={[0, 1, 0]} length={2} color="#50f250" />
      <FatArrow dir={[0, 0, 1]} length={2} color="#5050f2" />
    </>
  );
}
