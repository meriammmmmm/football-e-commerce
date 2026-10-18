'use client';

import { ArrowRight, Truck, ShieldCheck, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform } from 'framer-motion';
import MagneticButton from './MagneticButton';

const ShirtScene = dynamic(() => import('./ShirtScene'), { ssr: false });

interface HeroProps {
  heroImage?: string;
  videoUrl?: string;
  iframeUrl?: string;
  posterUrl?: string;
  secondSlideImage?: string;
  onShopNow?: () => void;
}

export default function Hero({ heroImage, videoUrl, iframeUrl, posterUrl, secondSlideImage, onShopNow }: HeroProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const hasSecondSlide = Boolean(secondSlideImage);
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 700], [0, 110]);
  const backgroundScale = useTransform(scrollY, [0, 700], [1, 1.08]);

  useEffect(() => {
    if (!hasSecondSlide) return;
    const timer = window.setInterval(() => setActiveSlide((slide) => (slide + 1) % 2), 6500);
    return () => window.clearInterval(timer);
  }, [hasSecondSlide]);

  return (
    <section className="relative flex min-h-[680px] items-center overflow-hidden bg-[#0a1628] [perspective:1600px] sm:min-h-screen">
      <motion.div style={{ y: backgroundY, scale: backgroundScale }} className="absolute inset-0 transform-gpu [transform:translateZ(-40px)_scale(1.04)]">
        {iframeUrl ? (
          <div className={`h-full w-full overflow-hidden transition-opacity duration-700 ${activeSlide === 0 ? 'opacity-100' : 'opacity-0'}`}>
            <iframe
              src={iframeUrl}
              title="Hero Video"
              className="pointer-events-none absolute left-1/2 top-1/2 border-0"
              style={{ 
                width: '300vw',
                height: '300vh',
                transform: 'translate(-50%, -50%)',
              }}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              loading="lazy"
            />
          </div>
        ) : videoUrl ? (
          <video
            className="h-full w-full object-cover opacity-50"
            autoPlay
            loop
            muted
            playsInline
            poster={posterUrl}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : (
          <img
            src={heroImage}
            alt="Football background"
            className="h-full w-full object-cover opacity-50"
          />
        )}
        {secondSlideImage && (
          <motion.img 
            initial={{ opacity: 0 }}
            animate={{ opacity: activeSlide === 1 ? 0.6 : 0 }}
            transition={{ duration: 0.7 }}
            src={secondSlideImage} 
            alt="Headbutt football shirts collection" 
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/80 to-gray-950/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-[#0a1628]/60" />
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-28 pt-20 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8">
        <div className="max-w-2xl">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-sm font-medium text-emerald-300 backdrop-blur-sm"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            Barcelona-born · Curated for football people
          </motion.span>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-white min-[375px]:text-[2.75rem] sm:mt-6 sm:text-6xl lg:text-7xl"
          >
            Wear the
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-lime-300 to-orange-300 bg-clip-text text-transparent">
              Beautiful Game
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-5 max-w-lg text-base leading-relaxed text-gray-300 sm:mt-6 sm:text-lg"
          >
            Headbutt Barcelona is a football shirt store born in the city that lives and breathes the game.
            Discover standout kits, timeless stories, and match-day energy delivered to your door.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 flex flex-col items-stretch gap-3 min-[375px]:flex-row min-[375px]:flex-wrap min-[375px]:items-center min-[375px]:gap-4"
          >
            <MagneticButton
              onClick={onShopNow}
              className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-full bg-emerald-500 px-6 py-3.5 text-base font-semibold text-gray-950 transition-all hover:bg-emerald-400 active:scale-95 after:absolute after:inset-y-0 after:-left-1/2 after:w-1/3 after:skew-x-[-20deg] after:bg-white/40 after:transition-transform after:duration-700 hover:after:translate-x-[420%] sm:px-8 sm:py-4"
            >
              Shop Now
              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-1"
              />
            </MagneticButton>
            <button
              onClick={onShopNow}
              className="rounded-full border border-white/20 px-6 py-3.5 text-center text-base font-medium text-white transition hover:bg-white/10 sm:px-8 sm:py-4"
            >
              Browse Collection
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-10 grid gap-3 min-[375px]:flex min-[375px]:flex-wrap min-[375px]:gap-x-8 min-[375px]:gap-y-4 sm:mt-12"
          >
            {[
              { icon: Truck, label: 'Free shipping over €100' },
              { icon: ShieldCheck, label: 'Curated in Barcelona' },
              { icon: RefreshCw, label: '30-day easy returns' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-gray-300">
                <Icon size={18} className="text-emerald-400" />
                {label}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
     
      {hasSecondSlide && (
        <>
          {/* Navigation Arrows */}
          <div className="absolute bottom-6 left-4 z-20 sm:left-6 sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2 lg:left-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => setActiveSlide((slide) => (slide === 0 ? 1 : 0))}
              aria-label="Previous slide"
              className="touch-manipulation flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/30 bg-black/50 text-white shadow-lg backdrop-blur-md transition-all hover:border-emerald-400 hover:bg-emerald-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] sm:h-12 sm:w-12"
            >
              <ChevronLeft size={22} className="sm:h-6 sm:w-6" />
            </motion.button>
          </div>
          <div className="absolute bottom-6 right-4 z-20 sm:right-6 sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2 lg:right-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => setActiveSlide((slide) => (slide === 0 ? 1 : 0))}
              aria-label="Next slide"
              className="touch-manipulation flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/30 bg-black/50 text-white shadow-lg backdrop-blur-md transition-all hover:border-emerald-400 hover:bg-emerald-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] sm:h-12 sm:w-12"
            >
              <ChevronRight size={22} className="sm:h-6 sm:w-6" />
            </motion.button>
          </div>
          
          {/* Slide Indicators */}
          <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:bottom-8 sm:left-auto sm:right-8 sm:translate-x-0" aria-label="Hero slides">
            {[0, 1].map((slide) => (
              <button
                key={slide}
                type="button"
                onClick={() => setActiveSlide(slide)}
                aria-label={`Show slide ${slide + 1}`}
                aria-current={activeSlide === slide}
                className={`h-2.5 rounded-full transition-all ${
                  activeSlide === slide ? 'w-8 bg-emerald-400' : 'w-2.5 bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
