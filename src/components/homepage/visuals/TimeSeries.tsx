'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';

function generateTimeSeries() {
    const points = [];
    let value = 0;
    for (let i = 0; i < 100; i++) {
        value += (Math.random() - 0.5) * 0.5;
        points.push([i / 20 - 2.5, value, 0]);
    }
    return points as [number, number, number][];
}


export default function TimeSeries() {
    const lineRef = useRef<any>();
    
    const points1 = useMemo(() => generateTimeSeries(), []);
    const points2 = useMemo(() => generateTimeSeries(), []);
    const points3 = useMemo(() => generateTimeSeries(), []);

    useFrame(({ clock }) => {
        if(lineRef.current) {
            lineRef.current.rotation.y = clock.getElapsedTime() * 0.1;
            lineRef.current.position.z = Math.sin(clock.getElapsedTime() * 0.5) * 2;
        }
    })

    return (
        <group ref={lineRef}>
            <Line points={points1} color="hsl(var(--primary))" lineWidth={5} position={[0, 1, 0]}/>
            <Line points={points2} color="hsl(var(--secondary))" lineWidth={5} position={[0, 0, 0]}/>
            <Line points={points3} color="hsl(var(--accent))" lineWidth={5} position={[0, -1, 0]}/>
        </group>
    )
}
