"use client";

import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

const CustomArrow = ({
  direction,
  length,
  color,
}: {
  direction: THREE.Vector3;
  length: number;
  color: string;
}) => {
  const arrowRef = useRef<THREE.ArrowHelper>();

  const origin = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  return (
    <arrowHelper
      ref={arrowRef}
      args={[direction.normalize(), origin, length, color, 0.2, 0.1]}
    />
  );
};

const SceneLinearAlgebra = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      groupRef.current.rotation.x = Math.sin(t * 0.5) * 0.2;
      groupRef.current.rotation.y = Math.cos(t * 0.3) * 0.2;
    }
  });

  const axes = useMemo(
    () => [
      {
        direction: new THREE.Vector3(1, 0, 0),
        color: '#ff6b6b', // Red
      },
      {
        direction: new THREE.Vector3(0, 1, 0),
        color: '#4ecdc4', // Green
      },
      {
        direction: new THREE.Vector3(0, 0, 1),
        color: '#45b7d1', // Blue
      },
    ],
    []
  );

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1} />
      {axes.map((axis, i) => (
        <CustomArrow
          key={i}
          direction={axis.direction}
          length={1.5}
          color={axis.color}
        />
      ))}
    </group>
  );
};

export default SceneLinearAlgebra;
