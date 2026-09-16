import { ArrowRight, Truck, ShieldCheck, RefreshCw } from 'lucide-react';

interface HeroProps {
  heroImage?: string;
  videoUrl?: string;
  iframeUrl?: string;
  posterUrl?: string;
  onShopNow?: () => void;
}

export default function Hero({ heroImage, videoUrl, iframeUrl, posterUrl, onShopNow }: HeroProps) {
  return (
    <section className="relative flex min-h-[680px] items-center overflow-hidden bg-gray-950 sm:min-h-screen">
      <div className="absolute inset-0">
        {iframeUrl ? (
          <div className="h-full w-full overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-gray-950/40" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-sm font-medium text-emerald-300 backdrop-blur-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            Barcelona-born · Curated for football people
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-white min-[375px]:text-5xl sm:text-6xl lg:text-7xl">
            Wear the
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-lime-300 to-orange-300 bg-clip-text text-transparent">
              Beautiful Game
            </span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-gray-300 sm:mt-6 sm:text-lg">
            Headbutt Barcelona is a football shirt store born in the city that lives and breathes the game.
            Discover standout kits, timeless stories, and match-day energy delivered to your door.
          </p>

          <div className="mt-8 flex flex-col items-stretch gap-3 min-[375px]:flex-row min-[375px]:flex-wrap min-[375px]:items-center min-[375px]:gap-4">
            <button
              onClick={onShopNow}
              className="group flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3.5 text-base font-semibold text-gray-950 transition-all hover:bg-emerald-400 active:scale-95 sm:px-8 sm:py-4"
            >
              Shop Now
              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
            <button
              onClick={onShopNow}
              className="rounded-full border border-white/20 px-6 py-3.5 text-center text-base font-medium text-white transition hover:bg-white/10 sm:px-8 sm:py-4"
            >
              Browse Collection
            </button>
          </div>

          <div className="mt-10 grid gap-3 min-[375px]:flex min-[375px]:flex-wrap min-[375px]:gap-x-8 min-[375px]:gap-y-4 sm:mt-12">
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
          </div>
        </div>
      </div>
    </section>
  );
}
