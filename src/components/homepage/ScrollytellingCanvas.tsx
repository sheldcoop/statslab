"use client";

import { useFrame } from '@react-three/fiber';
import { useTransform, type MotionValue } from 'framer-motion';
import * as THREE from 'three';
import { SceneChaos } from './SceneChaos';
import { SceneLinearAlgebra } from './SceneLinearAlgebra';
import { SceneStatistics } from './SceneStatistics';
import { SceneTimeSeries } from './SceneTimeSeries';

interface CameraRigProps {
  scrollYProgress: MotionValue<number>;
}

function CameraRig({ scrollYProgress }: CameraRigProps) {
  const cameraZ = useTransform(scrollYProgress, [0, 0.2], [15, 4]);
  const cameraY = useTransform(scrollYProgress, [0, 0.2], [0, 0]);
  const cameraLookAtY = useTransform(scrollYProgress, [0, 1], [0, 0.5]);

  useFrame((state) => {
    const newCameraZ = cameraZ.get();
    if (state.camera.position.z !== newCameraZ) {
        state.camera.position.z = newCameraZ;
    }

    const newCameraY = cameraY.get();
     if (state.camera.position.y !== newCameraY) {
        state.camera.position.y = newCameraY;
    }

    const newLookAtY = cameraLookAtY.get();
    state.camera.lookAt(0, newLookAtY, 0);
  });
  return null;
}

interface ScrollytellingCanvasProps {
  scrollYProgress: MotionValue<number>;
}

export default function ScrollytellingCanvas({ scrollYProgress }: ScrollytellingCanvasProps) {
  const chaosOpacity = useTransform(scrollYProgress, [0, 0.15, 0.2], [1, 1, 0]);
  const laOpacity = useTransform(scrollYProgress, [0.18, 0.25, 0.35, 0.4], [0, 1, 1, 0]);
  const statsOpacity = useTransform(scrollYProgress, [0.38, 0.45, 0.55, 0.6], [0, 1, 1, 0]);
  const tsOpacity = useTransform(scrollYProgress, [0.58, 0.65, 0.75, 0.8], [0, 1, 1, 0]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <SceneChaos opacity={chaosOpacity} />
      <SceneLinearAlgebra opacity={laOpacity} />
      <SceneStatistics opacity={statsOpacity} />
      <SceneTimeSeries opacity={tsOpacity} />
      <CameraRig scrollYProgress={scrollYProgress} />
    </>
  );
}
