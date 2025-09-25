'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  Text,
  Plane,
  Vector,
  Grid,
} from '@react-three/drei';

export default function LinearAlgebraScene() {
  const vecRef = useRef<any>();
  const basisVec1Ref = useRef<any>();
  const basisVec2Ref = useRef<any>();

  useFrame(({ clock }) => {
    if (vecRef.current && basisVec1Ref.current && basisVec2Ref.current) {
      const time = clock.getElapsedTime();
      const iHat = [Math.cos(time * 0.5), Math.sin(time * 0.5), 0];
      const jHat = [-Math.sin(time * 0.5), Math.cos(time * 0.5), 0];

      basisVec1Ref.current.set(iHat);
      basisVec2Ref.current.set(jHat);

      const v1 = 2;
      const v2 = 1;
      const transformedVec = [
        v1 * iHat[0] + v2 * jHat[0],
        v1 * iHat[1] + v2 * jHat[1],
        0,
      ];
      vecRef.current.set(transformedVec);
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
        TRANSFORMATION
      </Text>
      {/* Main vector */}
      <Vector ref={vecRef} args={[2, 1, 0]} color="#A850FF" />

      {/* Basis vectors */}
      <Vector ref={basisVec1Ref} args={[1, 0, 0]} color="#2E5CB8" />
      <Vector ref={basisVec2Ref} args={[0, 1, 0]} color="#2E5CB8" />

      <Grid
        args={[10, 10]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#666"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#2E5CB8"
        fadeDistance={25}
        fadeStrength={1}
        infiniteGrid
      />
    </>
  );
}

    