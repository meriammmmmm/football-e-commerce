'use client';

import { useRef, type ReactNode } from 'react';

export default function TiltCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!ref.current || event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform = `perspective(1000px) rotateX(${y * -8}deg) rotateY(${x * 8}deg) translateY(-6px)`;
    ref.current.style.setProperty('--tilt-x', `${(x + 0.5) * 100}%`);
    ref.current.style.setProperty('--tilt-y', `${(y + 0.5) * 100}%`);
  };
  const reset = () => { if (ref.current) ref.current.style.transform = ''; };
  return <div ref={ref} onPointerMove={move} onPointerLeave={reset} className={`tilt-card ${className}`}>{children}</div>;
}
