"use client";

import { useRef, useMemo } from 'react';
import type { MotionValue } from 'framer-motion';
import { Arrow, Plane } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { MeshStandardMaterial } from 'three';

interface SceneLinearAlgebraProps {
  opacity: MotionValue<number>;
}

export function SceneLinearAlgebra({ opacity }: SceneLinearAlgebraProps) {
  const groupRef = useRef<THREE.Group>(null);
  const material = useMemo(() => new THREE.MeshStandardMaterial({
      color: new THREE.Color('hsl(var(--primary))'),
      transparent: true,
      opacity: 0,
      emissive: new THREE.Color('hsl(var(--primary))'),
      emissiveIntensity: 2
  }), []);

  const planeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
      color: new THREE.Color('hsl(var(--primary))'),
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
  }), []);

  useFrame(() => {
    const currentOpacity = opacity.get();
    material.opacity = currentOpacity;
    planeMaterial.opacity = currentOpacity * 0.2;
    if (groupRef.current) {
      groupRef.current.visible = currentOpacity > 0;
    }
  });

  const arrows = useMemo(() => {
    const arr = [];
    const length = 10;
    const step = 2;
    for (let x = -length / 2; x <= length / 2; x += step) {
      for (let z = -length / 2; z <= length / 2; z += step) {
        arr.push(
          <Arrow
            key={`arrow-${x}-${z}`}
            position={[x, 0, z]}
            args={[new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1.5, 0)]}
            material={material}
            length={1.5}
            headWidth={0.5}
            headLength={0.5}
          />
        );
      }
    }
    return arr;
  }, [material]);

  return (
    <group ref={groupRef}>
      {arrows}
      <Plane args={[12, 12]} rotation-x={-Math.PI / 2} material={planeMaterial}>
      </Plane>
    </group>
  );
}
