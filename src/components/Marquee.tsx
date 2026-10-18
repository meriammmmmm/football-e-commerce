'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export default function Marquee({ children, reverse = false }: { children: ReactNode; reverse?: boolean }) {
  return <div className="overflow-hidden"><motion.div className="flex w-max gap-4" animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}>{children}{children}</motion.div></div>;
}
