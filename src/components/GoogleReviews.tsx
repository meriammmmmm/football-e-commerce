'use client';

import { ChevronLeft, ChevronRight, ExternalLink, Star, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Marquee from './Marquee';

type Review = {
  id?: string;
  name: string;
  initials: string;
  age: string;
  copy: string;
  rating?: number;
  avatar?: string;
  photo?: string;
  photos?: string[];
  avatarClass: string;
};

const reviews: Review[] = [
  {
    name: 'Adriano Mladenovič',
    initials: 'AM',
    age: '2 months ago',
    copy: 'An excellent shop for vintage football jerseys, with fantastic staff🔥🙌🏼',
    photos: [
      'https://lh3.googleusercontent.com/grass-cs/AABkmLfGbBO5l_9XxB34Nex44o-IPCUlrZz0xFbu2tm2ojsfjLCLSrsTrXXgdUU635wd2TovYmFHcheTL4WAfiNEZ_PIN7611VcqcF5nuzbYbUG5e2K1wbKlOADLDLrqHyZaFiRH7W6I8Qq1rQY1=k-no',
      'https://lh3.googleusercontent.com/grass-cs/AABkmLe6QghtKekwmUhDGJi5j8543LHcLoFVnluI6HPoWwir-BdTNvVGIMiSAMEAFJpLz5IV67nObTGTc6MfkV4L6us6yh3WMiIy-kGCWD3BBtBuaK5-w_dLBZulSe5wdJHYjZKK8Ax2-APHjjKn=k-no',
      'https://lh3.googleusercontent.com/grass-cs/AABkmLd_8BRoCbPlfXhC6UZvl-Mt99zdMEbqG1bG_dWWjUtTbZMkAAmZFwwaWM8ymFb-MGI-TaAA_MFK96qOsQ7KAbpvI6NlCoG1BTEaKLD95vtr0mGw_cTRCid8xnF5Zb8HVCWDFr6yDtNP-Iq1=k-no',
    ],
    avatarClass: 'bg-slate-700 text-slate-100',
  },
  {
    name: 'collin brown',
    initials: 'CB',
    age: 'Edited 3 months ago',
    copy: "Hidden gem in the Gothic Quarter. Small shop packed with unique soccer kits. The owners' energy and enthusiasm make this a must-visit for families looking for a unique shopping experience and one-of-a-kind souvenir.",
    photos: [
      'https://lh3.googleusercontent.com/grass-cs/AABkmLew5HlTiNnh5_sPWn7rAtt9qFE-0CCoQfwq8VXxtikfNAzQEyX4mv9pLXOvOsPL_6XGO1-U2rmKIBdeSKpZeIPBlYl0c9E1KhzsyoZ8jjPxpu8a4vN_m97kpj98wvswp9Hu7YJGKm_jLTWs=k-no',
      'https://lh3.googleusercontent.com/grass-cs/AABkmLdFFa3GHvCxRpwv__coqUhqja7pGIlRAnzEC0LdQskUeUD7UJpG6ruytFmL68jog7TO9g8QCKL7mU1a5whGMeYofrgW77umNWVrLYdh33GgPCzU7NK-T5Av5Y29aAEd5gVhP5mrenexVaD_=k-no',
      'https://lh3.googleusercontent.com/grass-cs/AABkmLdviAFaZE2BHiTYlsPeDF69Jql-L0CALeBv5Mx-7Re47ekUft0OiFbUWntG5Q4NRSAdLxaSg4WIrhRVdsjbt5UdOsWmW0q_we7FVes0po9aT7YG_GUBUhRBSuMMbTa5f4QbWtKCG-3CnEbF=k-no',
      'https://lh3.googleusercontent.com/grass-cs/AABkmLfF-nZRHPhJFwjNM44dbz4cpW8tkJNUgEq0jwOSvt8VXmGkkYx4cGoSJXg9O6bgiaBYOd4zmfT5rrKTB6Dw7AqytrbihETwyoaFIS4w_WF1wEDNUxyHg2QUNNSTe_ntVjsN9TTcKHWFeYPs=k-no',
    ],
    avatarClass: 'bg-amber-500/20 text-amber-300',
  },
  {
    name: 'HJW',
    initials: 'HJ',
    age: '3 months ago',
    copy: 'Unreal football shop with amazing service would 100% recommend',
    avatarClass: 'bg-emerald-500/20 text-emerald-300',
  },
  {
    name: 'Nikita Koval (DJ Niksu)',
    initials: 'NK',
    age: 'a month ago',
    copy: 'Great shop for original vintage kits!',
    photo: 'https://lh3.googleusercontent.com/grass-cs/AABkmLd_vJEi57hbKGXU4CciTiGFBEmug0rMOjXAJ_THapLtw0r9QKG0y5a-w03-Zza-8hjZR69X7bIT5kSIDRZQHP7gaqoawwOUcJokT7gsrxzYpnQ8o1Eg9_Ffz4WTAW7TNDVZLfq0IrEIvis=k-no',
    avatarClass: 'bg-rose-500/20 text-rose-300',
  },
  {
    name: 'Zain Anwar',
    initials: 'ZA',
    age: 'a month ago',
    copy: 'Its a very good store. Its very aesthetic store also the stuff is original you should must visit this store',
    avatarClass: 'bg-violet-500/20 text-violet-300',
  },
  {
    name: 'Vik De neys',
    initials: 'VD',
    age: 'a month ago',
    copy: 'Amazing and chill guy. Also crazy good and beautiful vintage shirts',
    avatarClass: 'bg-cyan-500/20 text-cyan-300',
  },
  {
    name: 'Ko. Kasami',
    initials: 'KK',
    age: 'a month ago',
    copy: 'Really good store👍 Great communication with the staff 😊',
    avatarClass: 'bg-orange-500/20 text-orange-300',
  },
  {
    name: 'Nozomi Tatsuzawa',
    initials: 'NT',
    age: '2 months ago',
    copy: 'This is hands down the best place for vintage jerseys. They’ve got jerseys from all kinds of legends, including rare pieces you won’t find anywhere else. If you’re looking for a vintage jersey, this is the place to come',
    photos: [
      'https://lh3.googleusercontent.com/grass-cs/AABkmLeiQeXx2obnh9kgP1Rp9zpWchG32iaejeE6BHOzd2T1g8cbQU-n4rfQyqHA6H6IXQqMX4_Ci2Pufv0EXFrYPHiMrKAXfV75v9jkgXLm3GDuEHArgmcr1WxmEF7_9axYImLBEm92HpSfDRox=k-no',
    ],
    avatarClass: 'bg-fuchsia-500/20 text-fuchsia-300',
  },
  {
    name: 'Henry',
    initials: 'HE',
    age: 'a month ago',
    copy: 'Friendly owners and good prices. Has shirts from a lot of teams with good quality',
    avatarClass: 'bg-blue-500/20 text-blue-300',
  },
  {
    name: 'Lorenzo San Antonio',
    initials: 'LS',
    age: '2 months ago',
    copy: 'really cool place, lots of really clean vintage jerseys and the guy there helped me to make my purchase',
    avatarClass: 'bg-indigo-500/20 text-indigo-300',
  },
  {
    name: 'roni tujula',
    initials: 'RT',
    age: 'a month ago',
    copy: 'So nice owner and good shirts i would recommend',
    avatarClass: 'bg-pink-500/20 text-pink-300',
  },
  {
    name: '신채환',
    initials: '신',
    age: 'a month ago',
    copy: 'Crazy good price and quality. Absolute hidden gem in bcn.',
    avatarClass: 'bg-teal-500/20 text-teal-300',
  },
  {
    name: 'Stephen Fulco',
    initials: 'SF',
    age: '2 months ago',
    copy: 'Awesome shop with vintage national and club jerseys!',
    avatarClass: 'bg-yellow-500/20 text-yellow-300',
  },
  {
    name: '張太祐',
    initials: '張',
    age: '3 months ago',
    copy: 'Here is the best football shop I’ve ever been to.',
    avatarClass: 'bg-lime-500/20 text-lime-300',
  },
  {
    name: 'Adam Issett',
    initials: 'AI',
    age: '2 months ago',
    copy: 'Ali is a great guy with a great selection of vintage football shirts. Definitely worth a visit.',
    avatarClass: 'bg-sky-500/20 text-sky-300',
  },
  {
    name: 'Gallame',
    initials: 'GA',
    age: 'a month ago',
    copy: 'Really cool. Nice jersey and old school one',
    avatarClass: 'bg-purple-500/20 text-purple-300',
  },
];

const googleReviewsUrl = 'https://www.google.com/maps/place/Headbutt+Barcelona+Vintage+Football+Store/@41.3812711,2.1748955,17z/data=!4m17!1m8!3m7!1s0x12a4a3cc4350d87b:0x438cad57a0ffff8e!2sHeadbutt+Barcelona+Vintage+Football+Store!8m2!3d41.3812711!4d2.1748955!10e1!16s%2Fg%2F11npqm4k_0!3m7!1s0x12a4a3cc4350d87b:0x438cad57a0ffff8e!8m2!3d41.3812711!4d2.1748955!9m1!1b1!16s%2Fg%2F11npqm4k_0?entry=ttu';

const StarRow = ({ rating = 5 }: { rating?: number }) => (
  <div className="flex items-center gap-0.5 text-[#ffb35c]" aria-label="5 out of 5 stars">
    {Array.from({ length: 5 }, (_, index) => <Star key={index} size={14} fill={index < rating ? 'currentColor' : 'none'} />)}
  </div>
);

/** Reviewer photo when Google provides one, initials when it does not (or the image fails to load). */
function ReviewAvatar({ review }: { review: Review }) {
  const [failed, setFailed] = useState(false);
  if (!review.avatar || failed) {
    return (
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold ${review.avatarClass}`}>
        {review.initials}
      </div>
    );
  }
  return (
    <img
      src={review.avatar}
      alt=""
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="h-8 w-8 shrink-0 rounded-lg bg-slate-800 object-cover"
    />
  );
}

/** Photo the reviewer attached to the review, if any. */
function ReviewPhoto({ src, onOpen }: { src: string; onOpen: () => void }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Open review photo"
      className="group relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-slate-800 ring-1 ring-white/[0.08] transition hover:ring-emerald-300/70 focus:outline-none focus:ring-2 focus:ring-emerald-300 sm:h-11 sm:w-11"
    >
      <img
        src={src}
        alt="Review photo"
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover transition duration-200 group-hover:scale-110"
      />
      <span className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
    </button>
  );
}

export default function GoogleReviews() {
  const reviewsTrackRef = useRef<HTMLDivElement>(null);
  const [googleReviews, setGoogleReviews] = useState<Review[] | null>(null);
  const [googleReviewCount, setGoogleReviewCount] = useState(162);
  const [googleRating, setGoogleRating] = useState(4.9);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
  const [submittedReviews, setSubmittedReviews] = useState<Review[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ name: '', rating: 5, copy: '' });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    let cancelled = false;
    fetch('/api/google-reviews')
      .then((response) => response.ok ? response.json() : null)
      .then((data: { reviews?: Review[]; totalReviewCount?: number; averageRating?: number } | null) => {
        if (cancelled || !data?.reviews?.length) return;
        // Normalize both API versions and preserve any locally-known Google
        // photos when an API response omits media for the same reviewer.
        const liveReviews = data.reviews
          .map((review) => {
            const responseName = review.name?.trim() || '';
            const fallback = reviews.find((candidate) => candidate.name.toLowerCase() === responseName.toLowerCase());
            return {
              ...fallback,
              ...review,
              name: responseName || fallback?.name || 'Google user',
              initials: review.initials || fallback?.initials || 'GU',
              age: review.age?.trim() || fallback?.age || 'Google review',
              copy: review.copy?.trim() || fallback?.copy || 'No written comment.',
              rating: review.rating || fallback?.rating || 5,
              avatar: review.avatar || fallback?.avatar,
              photo: review.photo || fallback?.photo,
              photos: review.photos?.length ? review.photos : fallback?.photos,
              avatarClass: review.avatarClass || fallback?.avatarClass || 'bg-slate-700 text-slate-100',
            };
          })
          .filter((review, index, source) => source.findIndex((candidate) => candidate.name === review.name && candidate.copy === review.copy) === index);
        setGoogleReviews(liveReviews);
        if (data.totalReviewCount) setGoogleReviewCount(data.totalReviewCount);
        if (typeof data.averageRating === 'number') setGoogleRating(data.averageRating);
      })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, []);
  useEffect(() => {
    if (!selectedPhoto) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedPhoto(null);
    };
    document.addEventListener('keydown', closeOnEscape);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedPhoto]);
  const allReviews = [...submittedReviews, ...(googleReviews ?? reviews)];
  const reviewKey = (review: Review, index: number) => review.id ?? `${review.name}-${index}`;
  const scrollReviews = (direction: 'back' | 'forward') => {
    const track = reviewsTrackRef.current;
    if (!track) return;
    track.scrollBy({ left: (direction === 'forward' ? 1 : -1) * Math.max(track.clientWidth / 4, 280), behavior: 'smooth' });
  };
  const submitReview = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setFormError(''); setIsSubmitting(true);
    try {
      const response = await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not submit your review.');
      setSubmittedReviews((current) => [{ name: data.review.name, initials: data.review.name.split(/\s+/).map((part: string) => part[0]).join('').slice(0, 2).toUpperCase(), age: 'just now', copy: data.review.copy, rating: data.review.rating, avatarClass: 'bg-emerald-500/20 text-emerald-300' }, ...current]);
      setForm({ name: '', rating: 5, copy: '' }); setFormOpen(false);
    } catch (error) { setFormError(error instanceof Error ? error.message : 'Could not submit your review.'); }
    finally { setIsSubmitting(false); }
  };

  return (
    <section className="bg-[#060b16] py-14 sm:py-20" aria-labelledby="reviews-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/[0.06] bg-[#121b2b] px-5 py-6 sm:px-7 sm:py-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-emerald-600 ring-1 ring-white/[0.1]">
                <Image src="/headbutt-logo.jpg" alt="Headbutt Barcelona" fill sizes="44px" className="object-cover" />
              </div>
              <div>
                <h2 id="reviews-heading" className="text-base font-bold tracking-tight text-white sm:text-lg">Headbutt Barcelona | Vintage Football Shirts</h2>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                  <span className="font-bold text-[#ffb35c]">{googleRating.toFixed(1)}</span>
                  <StarRow />
                  <span className="text-xs text-slate-400">{googleReviewCount} reviews on <span className="font-semibold text-slate-200">Google</span></span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2"><button type="button" onClick={() => { setFormError(''); setFormOpen(true); }} className="inline-flex items-center justify-center rounded-md bg-emerald-400 px-4 py-2 text-xs font-bold text-[#081120] transition hover:bg-emerald-300">Share your review</button><a href={googleReviewsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-md bg-[#243044] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#33435b]"><ExternalLink size={14} className="text-emerald-400" /> Google review</a></div>
          </div>
        </div>

        <div className="relative mt-5">
          <div ref={reviewsTrackRef} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {allReviews.map((review, index) => {
              const key = reviewKey(review, index);
              const isExpanded = expandedReview === key;
              const reviewCopy = review.copy?.trim() || 'No written comment.';
              const hasMoreText = reviewCopy.length > 110;
              const reviewPhotos = review.photos?.length ? review.photos : review.photo ? [review.photo] : [];
              return (
              <article key={key} className="flex min-h-[236px] w-[calc(100%-2rem)] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-white/[0.05] bg-[#111b2b] p-4 sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <ReviewAvatar review={review} />
                    <div className="min-w-0">
                      <h3 className="truncate text-xs font-bold text-white">{review.name}</h3>
                      <p className="mt-0.5 truncate whitespace-nowrap text-[10px] text-slate-400">{review.age}</p>
                    </div>
                  </div>
                  <span className="font-bold text-[15px] text-[#4285f4]" aria-label="Google">G</span>
                </div>
                <div className="mt-3 flex items-center gap-2"><StarRow rating={review.rating} /><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /></div>
                <div className="mt-3 min-w-0 overflow-hidden">
                  <p className={`${isExpanded || !hasMoreText ? '' : 'line-clamp-2'} min-w-0 text-xs leading-5 text-slate-200`}>{reviewCopy}</p>
                  {reviewPhotos.length > 0 && (
                    <div className="flex max-w-full gap-1 overflow-hidden" aria-label={`${reviewPhotos.length} review photos`}>
                      {reviewPhotos.slice(0, 4).map((photo, photoIndex) => (
                        <ReviewPhoto key={`${key}-photo-${photoIndex}`} src={photo} onOpen={() => setSelectedPhoto(photo)} />
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                  {hasMoreText ? (
                    <button type="button" onClick={() => setExpandedReview((current) => current === key ? null : key)} className="w-fit text-xs font-bold text-white transition hover:text-emerald-300">
                      {isExpanded ? 'Show less' : 'Show more'}
                    </button>
                  ) : <span />}
                  <a href={googleReviewsUrl} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-1 text-[11px] font-bold text-emerald-300 transition hover:text-emerald-200">
                    View on Google <ExternalLink size={12} />
                  </a>
                </div>
              </article>
              );
            })}
          </div>
          <div className="absolute inset-y-0 -left-3 hidden items-center lg:flex">
            <button type="button" onClick={() => scrollReviews('back')} aria-label="Previous reviews" className="grid h-8 w-8 place-items-center rounded-full bg-slate-800 text-white shadow-lg transition hover:bg-slate-700"><ChevronLeft size={16} /></button>
          </div>
          <div className="absolute inset-y-0 -right-3 hidden items-center lg:flex">
            <button type="button" onClick={() => scrollReviews('forward')} aria-label="Next reviews" className="grid h-8 w-8 place-items-center rounded-full bg-slate-800 text-white shadow-lg transition hover:bg-slate-700"><ChevronRight size={16} /></button>
          </div>
          <div className="mt-4 flex justify-end gap-2 lg:hidden">
            <button type="button" onClick={() => scrollReviews('back')} aria-label="Previous reviews" className="grid h-9 w-9 place-items-center rounded-full bg-slate-800 text-white"><ChevronLeft size={16} /></button>
            <button type="button" onClick={() => scrollReviews('forward')} aria-label="Next reviews" className="grid h-9 w-9 place-items-center rounded-full bg-slate-800 text-white"><ChevronRight size={16} /></button>
          </div>
        </div>
        {selectedPhoto && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Review photo preview"
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#02050b]/90 p-4 backdrop-blur-sm"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              aria-label="Close photo preview"
              className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            >
              <X size={20} />
            </button>
            <img
              src={selectedPhoto}
              alt="Expanded Google review photo"
              onClick={(event) => event.stopPropagation()}
              className="max-h-[88vh] max-w-[94vw] rounded-xl object-contain shadow-2xl"
            />
          </div>
        )}
        <div className="mt-6 overflow-hidden opacity-80" aria-label="Trust badges">
          <Marquee>
            <div className="flex shrink-0 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-4 mx-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">100% Authentic</h3>
                <p className="text-xs text-slate-400">Verified vintage</p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-4 mx-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Best Quality</h3>
                <p className="text-xs text-slate-400">Hand-picked gems</p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-4 mx-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                  <path d="M6 3h12l4 6-10 13L2 9Z"/>
                  <path d="M11 3 8 9l4 13 4-13-3-6"/>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Rare Finds</h3>
                <p className="text-xs text-slate-400">Unique collection</p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-4 mx-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                  <rect width="20" height="14" x="2" y="5" rx="2"/>
                  <line x1="2" x2="22" y1="10" y2="10"/>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Secure Payment</h3>
                <p className="text-xs text-slate-400">Safe checkout</p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-4 mx-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                  <path d="M16 3h5v5"/>
                  <path d="M8 3H3v5"/>
                  <path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3"/>
                  <path d="m15 9 6-6"/>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Fast Shipping</h3>
                <p className="text-xs text-slate-400">Worldwide</p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-4 mx-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                  <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/>
                  <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/>
                  <path d="M12 3v6"/>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Easy Returns</h3>
                <p className="text-xs text-slate-400">30 days</p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-4 mx-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                  <path d="M12 2v20M2 12h20"/>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Expert Curated</h3>
                <p className="text-xs text-slate-400">Passionate team</p>
              </div>
            </div>
          </Marquee>
        </div>
      </div>
      {formOpen && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020611]/75 p-4 backdrop-blur-sm" onClick={() => setFormOpen(false)}><form onSubmit={submitReview} onClick={(event) => event.stopPropagation()} className="w-full max-w-lg rounded-3xl bg-[#f4f0e7] p-6 text-[#11192d] shadow-2xl sm:p-8"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">Headbutt Barcelona</p><h2 className="mt-2 text-3xl font-black tracking-[-0.05em]">Share your review</h2></div><button type="button" onClick={() => setFormOpen(false)} aria-label="Close review form" className="grid h-11 w-11 place-items-center rounded-full bg-[#11192d]/10"><X size={22} /></button></div><p className="mt-3 text-sm text-[#11192d]/60">Your feedback helps the Headbutt community find its next great shirt.</p><input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required placeholder="Your name" className="mt-6 h-12 w-full rounded-xl border border-[#11192d]/15 bg-white px-4 font-semibold outline-none focus:border-emerald-600" /><div className="mt-4"><p className="text-sm font-black">Your rating</p><div className="mt-2 flex gap-1">{Array.from({ length: 5 }, (_, index) => <button key={index} type="button" onClick={() => setForm((current) => ({ ...current, rating: index + 1 }))} aria-label={`${index + 1} stars`} className="text-[#ffb35c]"><Star size={27} fill={index < form.rating ? 'currentColor' : 'none'} /></button>)}</div></div><textarea value={form.copy} onChange={(event) => setForm((current) => ({ ...current, copy: event.target.value }))} required minLength={10} rows={4} placeholder="Tell us about your visit or your shirt…" className="mt-4 w-full resize-none rounded-xl border border-[#11192d]/15 bg-white p-4 font-semibold outline-none focus:border-emerald-600" />{formError && <p role="alert" className="mt-3 text-sm font-bold text-red-700">{formError}</p>}<button disabled={isSubmitting} type="submit" className="mt-5 w-full rounded-xl bg-emerald-500 py-4 font-black text-[#081120] transition hover:bg-emerald-400 disabled:opacity-60">{isSubmitting ? 'Sending…' : 'Submit review'}</button><p className="mt-3 text-center text-xs font-semibold text-[#11192d]/45">For a public Google review, use the Google review button.</p></form></div>}
    </section>
  );
}
