'use client';

import { useRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

export default function MagneticButton({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null);

  const move = (event: React.PointerEvent<HTMLButtonElement>) => {
    const node = ref.current;
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.matchMedia('(pointer: fine)').matches) return;
    const rect = node.getBoundingClientRect();
    node.style.transform = `translate(${(event.clientX - (rect.left + rect.width / 2)) * 0.12}px, ${(event.clientY - (rect.top + rect.height / 2)) * 0.12}px)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = ''; };

  return <button ref={ref} data-cursor="interactive" onPointerMove={move} onPointerLeave={reset} className={`transition-transform duration-200 ${className}`} {...props}>{children}</button>;
}
