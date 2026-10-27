'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.2 });
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    // The admin app is a standalone tool, not part of the storefront shell.
    setHidden(window.location.pathname.startsWith('/admin'));
  }, []);

  if (hidden) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[120] h-0.5 origin-left bg-gradient-to-r from-emerald-400 via-lime-300 to-orange-300"
      style={{ scaleX }}
    />
  );
}
