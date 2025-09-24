'use client';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import SceneLinearAlgebra from './SceneLinearAlgebra';

export default function LinearAlgebraVisual() {
  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0, 0, 3.5], fov: 50 }}>
        <Suspense fallback={null}>
          <SceneLinearAlgebra />
        </Suspense>
      </Canvas>
    </div>
  );
}
