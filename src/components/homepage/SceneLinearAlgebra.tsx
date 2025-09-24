"use client";

import { useRef, useMemo } from 'react';
import type { MotionValue } from 'framer-motion';
import { Plane } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { MeshStandardMaterial } from 'three';

// Custom Arrow component since the one from drei is deprecated
const Arrow = ({
  direction,
  position,
  color,
}: {
  direction: THREE.Vector3;
  position: THREE.Vector3;
  color: string;
}) => {
  const arrowRef = useRef<THREE.ArrowHelper>(null);
  useFrame(() => {
    if (arrowRef.current) {
      arrowRef.current.setDirection(direction.normalize());
    }
  });
  return (
    <arrowHelper
      ref={arrowRef}
      args={[direction.normalize(), position, direction.length(), color, 0.2, 0.1]}
    />
  );
};


const Vector = ({
  to,
  color,
  opacity,
}: {
  to: THREE.Vector3;
  color: string;
  opacity?: MotionValue<number>;
}) => {
  const materialRef = useRef<MeshStandardMaterial>(null);

  useFrame(() => {
    if (materialRef.current && opacity) {
      materialRef.current.opacity = opacity.get();
    }
  });

  return (
    <>
      <Arrow
        direction={to}
        position={new THREE.Vector3(0, 0, 0)}
        color={color}
      />
      <mesh position={to}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial
          ref={materialRef}
          color={color}
          transparent
          opacity={1}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
    </>
  );
};

function Scene() {
  const basisVectors = useMemo(
    () => [
      { to: new THREE.Vector3(1, 0, 0), color: '#888' },
      { to: new THREE.Vector3(0, 1, 0), color: '#888' },
      { to: new THREE.Vector3(0, 0, 1), color: '#888' },
    ],
    []
  );

  const mainVector = useMemo(
    () => ({ to: new THREE.Vector3(1, 1, 1), color: 'hsl(var(--primary))' }),
    []
  );

  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
      groupRef.current.rotation.x += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {basisVectors.map((vec, i) => (
        <Vector key={i} {...vec} />
      ))}
      <Vector {...mainVector} />
       <Plane args={[10, 10]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
         <meshStandardMaterial color="#222" transparent opacity={0.1} />
       </Plane>
    </group>
  );
}


export default function SceneLinearAlgebra() {
  return (
    <Canvas
      camera={{ position: [2, 2, 2], fov: 50 }}
      style={{ pointerEvents: 'none' }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[3, 5, 4]} intensity={3} />
      <Scene />
    </Canvas>
  );
}
