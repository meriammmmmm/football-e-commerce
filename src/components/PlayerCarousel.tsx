'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { Product } from '@/types';

interface PlayerCarouselProps { players: Product[]; onPick: (value: string) => void; }
const blurData = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

export default function PlayerCarousel({ players, onPick }: PlayerCarouselProps) {
  const [loaded, setLoaded] = useState<string[]>([]);
  return <section className="mt-16 border-t border-white/10 pt-8" aria-labelledby="popular-players-heading"><div className="flex items-end justify-between gap-4"><div><p className="text-[11px] font-black uppercase tracking-[.18em] text-emerald-300">The legends</p><h2 id="popular-players-heading" className="mt-2 text-xl font-black text-white sm:text-2xl">Popular players</h2><p className="mt-1 text-sm font-semibold text-white/70">The shirts behind the stories</p></div><span className="text-xs font-bold text-white/70">Swipe to explore</span></div><div className="scrollbar-hide mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3">{players.map((product) => { const isLoaded = loaded.includes(product.id); return <button key={product.id} type="button" onClick={() => onPick(product.player || product.name)} className="group w-[104px] shrink-0 snap-start rounded-2xl border border-white/15 bg-white/[0.08] p-2.5 text-center transition hover:-translate-y-1 hover:border-emerald-300/60 hover:bg-white/[0.12] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/50 sm:w-[120px]"><span className={`relative mx-auto block aspect-square w-full overflow-hidden rounded-full border-2 border-white/15 bg-[#111a2e] shadow-lg transition duration-300 group-hover:scale-105 group-hover:border-emerald-300 ${!isLoaded ? 'animate-pulse' : ''}`}><Image src={product.image_url} alt={`${product.player || product.name} shirt`} fill sizes="(max-width: 640px) 104px, 120px" loading="lazy" placeholder="blur" blurDataURL={blurData} onLoad={() => setLoaded((items) => items.includes(product.id) ? items : [...items, product.id])} className="object-cover" /></span><span className="mt-3 block truncate text-sm font-black text-white">{product.player || product.name}</span><span className="mt-1 block truncate text-xs font-semibold text-white/70">{product.team} · Retro</span></button>; })}</div></section>;
}
