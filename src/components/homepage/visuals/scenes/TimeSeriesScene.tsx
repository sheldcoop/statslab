'use client';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Text } from '@react-three/drei';
import * as THREE from 'three';

const POINT_COUNT = 100;
const X_RANGE = 10;
const Y_SCALE = 1.5;

function generatePoints() {
  const points: [number, number, number][] = [];
  let y = 0;
  for (let i = 0; i < POINT_COUNT; i++) {
    const x = (i / (POINT_COUNT - 1)) * X_RANGE - X_RANGE / 2;
    y += (Math.random() - 0.5) * 0.5; // Trend
    y *= 0.95; // Mean reversion
    const seasonality = Math.sin(i * 0.2) * 0.5;
    const noise = (Math.random() - 0.5) * 0.2;
    points.push([x, (y + seasonality + noise) * Y_SCALE, 0]);
  }
  return points;
}

export default function TimeSeriesScene() {
  const lineRef = useRef<any>();
  const points = useMemo(generatePoints, []);
  const animatedPoints = useRef(points.map(() => new THREE.Vector3()));

  useFrame(({ clock }) => {
    if (lineRef.current) {
      const time = clock.getElapsedTime();
      const progress = (Math.sin(time * 0.5) + 1) / 2; // 0 to 1 cycle
      const visiblePoints = Math.floor(progress * POINT_COUNT);

      const currentPoints = points.slice(0, visiblePoints).map(p => new THREE.Vector3(...p));

      // Add a dummy point to prevent the line from disappearing
      if (currentPoints.length < 2) {
        currentPoints.push(new THREE.Vector3(...points[0]));
        currentPoints.push(new THREE.Vector3(...points[0]));
      }

      lineRef.current.geometry.setFromPoints(currentPoints);
    }
  });

  return (
    <>
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.3}
        font="var(--font-headline)"
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        MARKET DATA
      </Text>
      <group position={[0, 0.5, 0]}>
        <Line ref={lineRef} points={[]} color="#A850FF" lineWidth={3} />
      </group>
    </>
  );
}

    