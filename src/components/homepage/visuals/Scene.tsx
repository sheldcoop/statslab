'use client';

import React from 'react';
import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion-3d';
import LinearAlgebra from './LinearAlgebra';
import Statistics from './Statistics';
import TimeSeries from './TimeSeries';

export default function Scene() {
  const scroll = useScroll();

  useFrame((state, delta) => {
    // Animate camera or other global elements based on scroll
    state.camera.position.z = 5 - scroll.offset * 10;
    state.camera.position.y = -scroll.offset * 2;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambient_light intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {/* Scene 1: Intro / Linear Algebra */}
      <motion.group
        animate={{
          opacity: scroll.offset < 0.33 ? 1 : 0,
        }}
        transition={{ duration: 0.5 }}
      >
        <LinearAlgebra />
      </motion.group>

      {/* Scene 2: Statistics */}
      <motion.group
        animate={{
          opacity: scroll.offset >= 0.33 && scroll.offset < 0.66 ? 1 : 0,
        }}
        transition={{ duration: 0.5 }}
      >
        <Statistics />
      </motion.group>

      {/* Scene 3: Time Series */}
      <motion.group
         animate={{
          opacity: scroll.offset >= 0.66 ? 1 : 0,
        }}
        transition={{ duration: 0.5 }}
      >
        <TimeSeries />
      </motion.group>
    </>
  );
}
