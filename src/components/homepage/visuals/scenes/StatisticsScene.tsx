'use client';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Text } from '@react-three/drei';
import { normal } from 'd3-random';
import * as THREE from 'three';

const BAR_COUNT = 50;
const X_RANGE = 5;

function generateBinnedData() {
  const data = Array.from({ length: 1000 }, normal(0, 1));
  const bins = new Array(BAR_COUNT).fill(0);
  data.forEach((d) => {
    const index = Math.floor(((d + X_RANGE) / (X_RANGE * 2)) * BAR_COUNT);
    if (index >= 0 && index < BAR_COUNT) {
      bins[index]++;
    }
  });
  return bins.map((count) => count / 200); // Scale heights
}

export default function StatisticsScene() {
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const data = useMemo(generateBinnedData, []);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    if (!instancedMeshRef.current) return;
    const time = clock.getElapsedTime();

    data.forEach((height, i) => {
      const x = (i / BAR_COUNT) * X_RANGE * 2 - X_RANGE;
      const animatedHeight =
        height * (0.6 + 0.4 * Math.sin(i * 0.5 + time));
      dummy.position.set(x, animatedHeight / 2, 0);
      dummy.scale.set(
        (X_RANGE * 2) / BAR_COUNT,
        Math.max(0.01, animatedHeight),
        0.2
      );
      dummy.updateMatrix();
      instancedMeshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <Text
        position={[-2, 2, 0]}
        fontSize={0.3}
        font="var(--font-headline)"
        color="white"
        anchorX="center"
        anchorY="middle"
        rotation={[0, Math.PI / 4, 0]}
      >
        DISTRIBUTION
      </Text>
      <group position={[-2, 0, 0]} rotation={[0, Math.PI / 4, 0]}>
        <instancedMesh
          ref={instancedMeshRef}
          args={[undefined, undefined, BAR_COUNT]}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#A850FF" />
        </instancedMesh>
      </group>
    </>
  );
}

    