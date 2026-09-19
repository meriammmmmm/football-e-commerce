'use client';

import { ChevronLeft, ChevronRight, ExternalLink, Star, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

type Review = {
  name: string;
  initials: string;
  age: string;
  copy: string;
  rating?: number;
  photo?: string;
  avatarClass: string;
};

const reviews: Review[] = [
  {
    name: 'Stefan Winkler',
    initials: 'SW',
    age: 'last month',
    copy: 'Great and friendly store with a great selection of jerseys. My son was in heaven 😄',
    photo: '/products/080B6C0F-BF0C-4050-A339-FD6CD3FB37A7.JPG',
    avatarClass: 'bg-slate-700 text-slate-100',
  },
  {
    name: 'Bijal Patel',
    initials: 'BP',
    age: '2 months ago',
    copy: 'Nick was so helpful and patient! Got amazing Ronaldo jerseys in almost pristine condition.',
    photo: '/products/0DB5904D-372D-4D8E-A2F9-3BFF07454CA6.JPG',
    avatarClass: 'bg-amber-500/20 text-amber-300',
  },
  {
    name: 'Wojtek Puchta',
    initials: 'WP',
    age: '2 months ago',
    copy: 'If you want to rizz up or just talk football, come through and say hello to the kick off vintage crew, they are amazing.',
    photo: '/products/65CF9DBA-07AA-483A-9C96-58761782AE26.JPG',
    avatarClass: 'bg-emerald-500/20 text-emerald-300',
  },
  {
    name: 'Gustavo Quilantan Mustafa',
    initials: 'GQ',
    age: '2 days ago',
    copy: 'Colección increíble! Jerseys en excelentes condiciones y hacen envíos internacionales. Seguro me verán de nuevo.',
    photo: '/products/AFFE99A3-9EED-4E8E-B6A2-C6117759DBA5.JPG',
    avatarClass: 'bg-rose-500/20 text-rose-300',
  },
  {
    name: 'Marcel Roca',
    initials: 'MR',
    age: 'a week ago',
    copy: 'A proper treasure trove for football shirt lovers. The team know their history and helped me find the perfect Barça classic.',
    photo: '/products/B8E00567-0DD3-4F13-99C8-7848DA0A0FE3.JPG',
    avatarClass: 'bg-violet-500/20 text-violet-300',
  },
];

const StarRow = ({ rating = 5 }: { rating?: number }) => (
  <div className="flex items-center gap-0.5 text-[#ffb35c]" aria-label="5 out of 5 stars">
    {Array.from({ length: 5 }, (_, index) => <Star key={index} size={14} fill={index < rating ? 'currentColor' : 'none'} />)}
  </div>
);

export default function GoogleReviews() {
  const [startIndex, setStartIndex] = useState(0);
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
  const [submittedReviews, setSubmittedReviews] = useState<Review[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ name: '', rating: 5, copy: '' });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const allReviews = [...submittedReviews, ...reviews];
  const visibleReviews = allReviews.slice(startIndex, startIndex + 4);
  const canGoBack = startIndex > 0;
  const canGoForward = startIndex + 4 < allReviews.length;

  const goBack = () => setStartIndex((current) => Math.max(0, current - 1));
  const goForward = () => setStartIndex((current) => Math.min(allReviews.length - 4, current + 1));
  const submitReview = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setFormError(''); setIsSubmitting(true);
    try {
      const response = await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not submit your review.');
      setSubmittedReviews((current) => [{ name: data.review.name, initials: data.review.name.split(/\s+/).map((part: string) => part[0]).join('').slice(0, 2).toUpperCase(), age: 'just now', copy: data.review.copy, rating: data.review.rating, avatarClass: 'bg-emerald-500/20 text-emerald-300' }, ...current]);
      setForm({ name: '', rating: 5, copy: '' }); setStartIndex(0); setFormOpen(false);
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
                  <span className="font-bold text-[#ffb35c]">4.9</span>
                  <StarRow />
                  <span className="text-xs text-slate-400">152 reviews on <span className="font-semibold text-slate-200">Google</span></span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2"><button type="button" onClick={() => { setFormError(''); setFormOpen(true); }} className="inline-flex items-center justify-center rounded-md bg-emerald-400 px-4 py-2 text-xs font-bold text-[#081120] transition hover:bg-emerald-300">Share your review</button><a href="https://www.google.com/maps/place/Headbutt+Barcelona+Vintage+Football+Store/@41.3812711,2.1748955,17z/data=!4m17!1m8!3m7!1s0x12a4a3cc4350d87b:0x438cad57a0ffff8e!2sHeadbutt+Barcelona+Vintage+Football+Store!8m2!3d41.3812711!4d2.1748955!10e1!16s%2Fg%2F11npqm4k_0!3m7!1s0x12a4a3cc4350d87b:0x438cad57a0ffff8e!8m2!3d41.3812711!4d2.1748955!9m1!1b1!16s%2Fg%2F11npqm4k_0!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDkxMy4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-md bg-[#243044] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#33435b]"><ExternalLink size={14} className="text-emerald-400" /> Google review</a></div>
          </div>
        </div>

        <div className="relative mt-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visibleReviews.map((review) => (
              <article key={review.name} className="flex min-h-[196px] flex-col rounded-2xl border border-white/[0.05] bg-[#111b2b] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold ${review.avatarClass}`}>{review.initials}</div>
                    <div className="min-w-0">
                      <h3 className="truncate text-xs font-bold text-white">{review.name}</h3>
                      <p className="mt-0.5 text-[10px] text-slate-400">{review.age}</p>
                    </div>
                  </div>
                  <span className="font-bold text-[15px] text-[#4285f4]" aria-label="Google">G</span>
                </div>
                <div className="mt-3 flex items-center gap-2"><StarRow rating={review.rating} /><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /></div>
                <div className="mt-3 flex flex-1 gap-3">
                  <p className={`${expandedReview === review.name ? '' : 'line-clamp-4'} text-xs leading-5 text-slate-200`}>{review.copy}</p>
                  {review.photo && <Image src={review.photo} alt="" width={44} height={44} className="h-11 w-11 shrink-0 rounded-md object-cover" />}
                </div>
                <button type="button" onClick={() => setExpandedReview((current) => current === review.name ? null : review.name)} className="mt-3 w-fit text-xs font-bold text-white transition hover:text-emerald-300">
                  {expandedReview === review.name ? 'Show less' : 'Show more'}
                </button>
              </article>
            ))}
          </div>
          <div className="absolute inset-y-0 -left-3 hidden items-center lg:flex">
            <button type="button" onClick={goBack} disabled={!canGoBack} aria-label="Previous reviews" className="grid h-7 w-7 place-items-center rounded-full bg-slate-800 text-white shadow-lg transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-30"><ChevronLeft size={16} /></button>
          </div>
          <div className="absolute inset-y-0 -right-3 hidden items-center lg:flex">
            <button type="button" onClick={goForward} disabled={!canGoForward} aria-label="Next reviews" className="grid h-7 w-7 place-items-center rounded-full bg-slate-800 text-white shadow-lg transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-30"><ChevronRight size={16} /></button>
          </div>
          <div className="mt-4 flex justify-end gap-2 lg:hidden">
            <button type="button" onClick={goBack} disabled={!canGoBack} aria-label="Previous reviews" className="grid h-9 w-9 place-items-center rounded-full bg-slate-800 text-white disabled:opacity-30"><ChevronLeft size={16} /></button>
            <button type="button" onClick={goForward} disabled={!canGoForward} aria-label="Next reviews" className="grid h-9 w-9 place-items-center rounded-full bg-slate-800 text-white disabled:opacity-30"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
      {formOpen && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020611]/75 p-4 backdrop-blur-sm" onClick={() => setFormOpen(false)}><form onSubmit={submitReview} onClick={(event) => event.stopPropagation()} className="w-full max-w-lg rounded-3xl bg-[#f4f0e7] p-6 text-[#11192d] shadow-2xl sm:p-8"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">Headbutt Barcelona</p><h2 className="mt-2 text-3xl font-black tracking-[-0.05em]">Share your review</h2></div><button type="button" onClick={() => setFormOpen(false)} aria-label="Close review form" className="grid h-11 w-11 place-items-center rounded-full bg-[#11192d]/10"><X size={22} /></button></div><p className="mt-3 text-sm text-[#11192d]/60">Your feedback helps the Headbutt community find its next great shirt.</p><input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required placeholder="Your name" className="mt-6 h-12 w-full rounded-xl border border-[#11192d]/15 bg-white px-4 font-semibold outline-none focus:border-emerald-600" /><div className="mt-4"><p className="text-sm font-black">Your rating</p><div className="mt-2 flex gap-1">{Array.from({ length: 5 }, (_, index) => <button key={index} type="button" onClick={() => setForm((current) => ({ ...current, rating: index + 1 }))} aria-label={`${index + 1} stars`} className="text-[#ffb35c]"><Star size={27} fill={index < form.rating ? 'currentColor' : 'none'} /></button>)}</div></div><textarea value={form.copy} onChange={(event) => setForm((current) => ({ ...current, copy: event.target.value }))} required minLength={10} rows={4} placeholder="Tell us about your visit or your shirt…" className="mt-4 w-full resize-none rounded-xl border border-[#11192d]/15 bg-white p-4 font-semibold outline-none focus:border-emerald-600" />{formError && <p role="alert" className="mt-3 text-sm font-bold text-red-700">{formError}</p>}<button disabled={isSubmitting} type="submit" className="mt-5 w-full rounded-xl bg-emerald-500 py-4 font-black text-[#081120] transition hover:bg-emerald-400 disabled:opacity-60">{isSubmitting ? 'Sending…' : 'Submit review'}</button><p className="mt-3 text-center text-xs font-semibold text-[#11192d]/45">For a public Google review, use the Google review button.</p></form></div>}
    </section>
  );
}
