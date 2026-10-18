'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, Environment } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import type { Mesh } from 'three';

function ShirtMesh({ image }: { image: string }) {
  const mesh = useRef<Mesh>(null);
  const texture = useTexture(image);
  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y += (Math.sin(state.clock.elapsedTime * 0.7) * 0.25 - mesh.current.rotation.y) * 0.02;
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
  });
  return <mesh ref={mesh} rotation={[0, -0.2, 0]}><planeGeometry args={[2.25, 2.8]} /><meshStandardMaterial map={texture} transparent roughness={0.7} metalness={0.08} /></mesh>;
}

export default function ShirtScene({ image }: { image: string }) {
  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!container.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.matchMedia('(min-width: 1024px)').matches) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '160px' });
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={container} className="h-[320px] w-full lg:h-[460px]" aria-label="Animated football shirt preview">{visible && <Canvas camera={{ position: [0, 0, 4.6], fov: 38 }} dpr={[1, 1.5]}><ambientLight intensity={1.2} /><directionalLight position={[2, 3, 4]} intensity={2} color="#b4ffe0" /><Environment preset="city" /><ShirtMesh image={image} /></Canvas>}</div>;
}
