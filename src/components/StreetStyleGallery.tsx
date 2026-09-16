'use client';

import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';

const looks = [
  { title: 'Barcelona classics', shirt: '90s match-day rotation', image: '/756436518_18103895371999396_4894283240947071173_n.jpg' },
  { title: 'Milan away day', shirt: 'AC Milan 2006/07', image: '/756857788_18103895326999396_4513381999901559894_n.jpg' },
  { title: 'The number nine', shirt: 'Brazil 2002 Ronaldo', image: '/757954847_18103895350999396_5983842247708972129_n.jpg' },
  { title: 'Boca after dark', shirt: 'Boca Juniors 2000', image: '/758006664_18103895362999396_7962434200034526890_n.jpg' },
  { title: 'Streetwear, matchwear', shirt: 'Argentina 1994 retro', image: '/756833144_18103895335999396_8990120619776430882_n.jpg' },
];

interface StreetStyleGalleryProps {
  onShopNow: () => void;
}

export default function StreetStyleGallery({ onShopNow }: StreetStyleGalleryProps) {
  const [activeLook, setActiveLook] = useState(0);

  return (
    <section className="bg-[#f6f1e8] py-16 text-[#172033] sm:py-24" aria-labelledby="street-style-heading">
      <div className="mx-auto max-w-[1648px] px-4 sm:px-6 lg:px-8">
        <div className="mb-9 flex flex-col justify-between gap-4 sm:mb-12 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-700">Worn beyond the stadium</p>
            <h2 id="street-style-heading" className="mt-3 text-4xl font-black uppercase tracking-[-0.045em] sm:text-6xl">The street lineup</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-slate-600">Hover over a fit to see the full look, the shirt behind it, and where to find it.</p>
        </div>

        <div className="scrollbar-hide flex h-[560px] snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:h-[590px] sm:snap-none sm:gap-2 sm:overflow-hidden sm:pb-0 lg:h-[800px]">
          {looks.map((look, index) => {
            const isActive = activeLook === index;

            return (
            <article key={look.title} onMouseEnter={() => setActiveLook(index)} onFocus={() => setActiveLook(index)} onClick={() => setActiveLook(index)} className={`group relative min-w-[82vw] snap-center flex-none overflow-hidden rounded-sm bg-slate-900 transition-[flex] duration-500 ease-out sm:min-w-0 sm:flex-1 ${isActive ? 'sm:flex-[3.3]' : 'sm:flex-1'}`}>
              <Image src={look.image} alt={`${look.title} football shirt fit`} fill sizes="(max-width: 640px) 150px, (max-width: 1024px) 25vw, 48vw" className="object-cover transition duration-700 ease-out group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/5 transition group-hover:from-black/75" />
              <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-opacity duration-300 ${isActive ? 'opacity-0' : 'opacity-100'}`}>
                <p className="text-2xl font-black uppercase tracking-[-0.04em] text-white [writing-mode:vertical-rl] rotate-180 sm:text-3xl">
                  {look.title}
                </p>
              </div>
              <p aria-hidden="true" className={`absolute left-6 top-6 text-4xl font-black uppercase leading-[0.9] tracking-[-0.05em] text-white transition-all duration-500 sm:left-7 sm:top-7 sm:text-5xl ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}>
                {look.title}
              </p>
              <div className={`absolute inset-x-0 bottom-0 p-6 text-white transition-all duration-500 sm:p-7 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">Worn in Barcelona</p>
                <h3 className="mt-2 text-xl font-bold">{look.shirt}</h3>
                <button type="button" onClick={onShopNow} className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-slate-950 transition hover:bg-emerald-300">
                  Shop the look <ArrowUpRight size={15} />
                </button>
              </div>
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
