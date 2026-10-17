'use client';

import { Clock3, Flame, Search, TrendingUp, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Product } from '@/types';

interface SearchBarProps {
  query: string;
  products: Product[];
  onChange: (value: string) => void;
  onSubmit: () => void;
  onPick: (value: string) => void;
  onSuggestionsChange?: (open: boolean) => void;
}

const quickFilters = ['Retro', 'Home', 'Away', '90s'];
const trendingSearches = ['Zidane Real Madrid', 'Brazil 2002', 'Man United 99'];
const suggestedSearches = ['Messi', 'Real Madrid', 'Retro jerseys'];

type Suggestion = { id: string; kind: 'Players' | 'Clubs' | 'Shirts'; product: Product; secondary: string };

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const parts = text.split(new RegExp(`(${escapeRegExp(query.trim())})`, 'ig'));
  return <>{parts.map((part, index) => part.toLowerCase() === query.trim().toLowerCase() ? <mark key={`${part}-${index}`} className="bg-transparent text-emerald-300">{part}</mark> : part)}</>;
}

export default function SearchBar({ query, products, onChange, onSubmit, onPick, onSuggestionsChange }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [recent, setRecent] = useState<string[]>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const setOpen = useCallback((open: boolean) => { setSuggestionsOpen(open); onSuggestionsChange?.(open); }, [onSuggestionsChange]);

  useEffect(() => {
    try { // eslint-disable-next-line react-hooks/set-state-in-effect
      setRecent(JSON.parse(window.localStorage.getItem('headbutt-recent-searches') || '[]').slice(0, 5));
    } catch { setRecent([]); }
  }, []);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (suggestionsOpen && rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, [setOpen, suggestionsOpen]);

  useEffect(() => {
    const timer = window.setTimeout(() => { setDebouncedQuery(query); setLoading(false); }, 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  const suggestions = useMemo<Suggestion[]>(() => {
    const value = debouncedQuery.trim().toLowerCase();
    if (!value) return [];
    const matches = products.filter((product) => [product.name, product.team, product.player, product.league, product.category].filter(Boolean).join(' ').toLowerCase().includes(value));
    const players = matches.filter((product) => product.player).slice(0, 4).map((product) => ({ id: `player-${product.id}`, kind: 'Players' as const, product, secondary: product.team }));
    const clubs = matches.filter((product) => !product.player && product.team).slice(0, 4).map((product) => ({ id: `club-${product.id}`, kind: 'Clubs' as const, product, secondary: product.league || 'Football club' }));
    const shirts = matches.slice(0, 5).map((product) => ({ id: `shirt-${product.id}`, kind: 'Shirts' as const, product, secondary: `${product.team}${product.category ? ` · ${product.category}` : ''}` }));
    return [...players, ...clubs, ...shirts].filter((item, index, all) => all.findIndex((candidate) => candidate.product.id === item.product.id) === index);
  }, [debouncedQuery, products]);

  const saveRecent = (value: string) => {
    const next = [value, ...recent.filter((item) => item.toLowerCase() !== value.toLowerCase())].slice(0, 5);
    setRecent(next);
    window.localStorage.setItem('headbutt-recent-searches', JSON.stringify(next));
  };
  const choose = (value: string) => { saveRecent(value); onPick(value); setOpen(false); };
  const clearRecent = () => { setRecent([]); window.localStorage.removeItem('headbutt-recent-searches'); };
  const removeRecent = (value: string) => { const next = recent.filter((item) => item !== value); setRecent(next); window.localStorage.setItem('headbutt-recent-searches', JSON.stringify(next)); };
  const toggleFilter = (filter: string) => setSelectedFilters((current) => current.includes(filter) ? current.filter((item) => item !== filter) : [...current, filter]);
  const submit = () => { const value = query.trim() || selectedFilters.join(' '); if (!value) return; if (!query.trim()) { choose(value); return; } saveRecent(value); onSubmit(); setOpen(false); };

  const options = query.trim() ? suggestions : [];
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') { event.stopPropagation(); setOpen(false); inputRef.current?.blur(); return; }
    if (!query.trim() || !options.length) return;
    if (event.key === 'ArrowDown') { event.preventDefault(); setActiveIndex((index) => Math.min(index + 1, options.length - 1)); }
    if (event.key === 'ArrowUp') { event.preventDefault(); setActiveIndex((index) => Math.max(index - 1, 0)); }
    if (event.key === 'Enter' && options[activeIndex]) { event.preventDefault(); choose(options[activeIndex].product.name); }
  };

  const groupedKinds = [...new Set(options.map((item) => item.kind))];
  const showResults = query.trim().length > 0;

  return (
    <div ref={rootRef} className="relative z-20 mx-auto w-full">
      <form onSubmit={(event) => { event.preventDefault(); submit(); }} role="search">
        <div className={`flex min-h-16 items-center gap-3 rounded-2xl border bg-white/10 px-4 shadow-[0_16px_45px_rgba(0,0,0,.28)] transition sm:min-h-[76px] sm:rounded-3xl sm:px-6 ${suggestionsOpen ? 'border-emerald-300 ring-4 ring-emerald-300/20' : 'border-white/20 focus-within:border-emerald-300 focus-within:ring-4 focus-within:ring-emerald-300/20'}`}>
          <Search className="shrink-0 text-emerald-300" size={23} aria-hidden="true" />
          <input ref={inputRef} value={query} onFocus={() => setOpen(true)} onChange={(event) => { onChange(event.target.value); setLoading(true); setActiveIndex(0); setOpen(true); }} onKeyDown={handleKeyDown} aria-label="Search players, clubs and shirts" aria-activedescendant={options[activeIndex] ? `search-option-${options[activeIndex].id}` : undefined} placeholder="Search players, clubs or shirts" className="min-w-0 flex-1 bg-transparent text-lg font-bold text-white caret-emerald-300 outline-none placeholder:text-white/50 sm:text-2xl" />
          {query && <button type="button" onClick={() => onChange('')} aria-label="Clear search" className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"><X size={19} /></button>}
          <button type="submit" className="hidden min-h-11 shrink-0 items-center gap-2 rounded-xl bg-emerald-300 px-5 text-sm font-black text-[#071b12] transition hover:bg-emerald-200 sm:flex">Search <span aria-hidden="true">↵</span></button>
        </div>
      </form>

      {suggestionsOpen && <div className="absolute left-0 right-0 top-full z-50 mt-3 max-h-[420px] overflow-y-auto rounded-2xl border border-white/15 bg-[#22304f] p-4 text-white shadow-2xl backdrop-blur-2xl animate-[searchRiseIn_150ms_ease-out_both]" role="listbox" aria-label="Search suggestions" onMouseDown={(event) => event.preventDefault()}>
        {showResults ? loading ? <div className="space-y-3" aria-label="Loading search results">{[1, 2, 3].map((item) => <div key={item} className="h-12 animate-pulse rounded-xl bg-white/10" />)}</div> : options.length ? <div className="space-y-4">{groupedKinds.map((kind) => <section key={kind}><p className="mb-2 text-[11px] font-black uppercase tracking-[.16em] text-emerald-300/80">{kind}</p><div className="space-y-1">{options.filter((item) => item.kind === kind).map((item) => { const index = options.indexOf(item); return <button key={item.id} id={`search-option-${item.id}`} type="button" role="option" aria-selected={index === activeIndex} onClick={() => choose(item.product.name)} className={`group relative flex min-h-12 w-full items-center gap-3 rounded-xl px-2 text-left transition ${index === activeIndex ? 'bg-white/[0.08]' : 'hover:bg-white/[0.05]'}`}><span className={`absolute bottom-1 left-0 top-1 w-0.5 rounded-full bg-emerald-300 transition-opacity ${index === activeIndex ? 'opacity-100' : 'opacity-0'}`} /><span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white/10"><Image src={item.product.image_url} alt="" width={40} height={40} sizes="40px" loading="lazy" className="h-full w-full object-cover" /></span><span className="min-w-0"><span className="block truncate text-sm font-bold"><Highlight text={item.product.player || item.product.name} query={debouncedQuery} /></span><span className="block truncate text-xs text-white/60"><Highlight text={item.secondary} query={debouncedQuery} /></span></span></button>; })}</div></section>)}</div> : <div><p className="py-2 text-sm font-bold">No results for “{query}”</p><p className="mb-3 text-xs text-white/60">Try one of these:</p><div className="flex flex-wrap gap-2">{suggestedSearches.map((item) => <button key={item} type="button" onClick={() => choose(item)} className="min-h-8 rounded-full border border-white/20 px-3 text-xs font-bold text-white transition hover:border-emerald-300 hover:bg-emerald-300/10 hover:text-emerald-200">{item}</button>)}</div></div> : <div className="space-y-4">
          <section><div className="mb-2 flex items-center justify-between"><p className="text-[11px] font-black uppercase tracking-[.16em] text-emerald-300/80">Quick filters</p><span className="text-[10px] text-white/40">Multi-select</span></div><div className="flex flex-wrap gap-2">{quickFilters.map((filter) => { const selected = selectedFilters.includes(filter); return <button key={filter} type="button" onClick={() => toggleFilter(filter)} aria-pressed={selected} className={`h-8 rounded-full border px-3 text-sm font-bold transition ${selected ? 'border-emerald-300 bg-emerald-300/15 text-emerald-200' : 'border-white/20 text-white hover:border-emerald-300 hover:bg-emerald-300/10 hover:text-emerald-200'}`}>{filter}</button>; })}</div></section>
          <section className="border-t border-white/10 pt-3"><div className="mb-2 flex items-center justify-between"><p className="text-[11px] font-black uppercase tracking-[.16em] text-emerald-300/80">Recent searches</p>{recent.length > 0 && <button type="button" onClick={clearRecent} className="text-xs font-bold text-emerald-300 transition hover:text-emerald-200">Clear all</button>}</div>{recent.length ? <div className="space-y-1">{recent.map((item) => <div key={item} className="group flex min-h-10 items-center gap-3 rounded-xl px-2 text-sm font-bold text-white transition hover:bg-white/[0.05]"><button type="button" role="option" aria-selected="false" onClick={() => choose(item)} className="flex min-w-0 flex-1 items-center gap-3 text-left"><Clock3 size={16} className="shrink-0 text-emerald-300" /><span className="truncate">{item}</span></button><button type="button" onClick={() => removeRecent(item)} aria-label={`Remove recent search ${item}`} className="grid h-8 w-8 place-items-center rounded-full text-white/40 opacity-0 transition hover:bg-white/10 hover:text-white focus-visible:opacity-100 group-hover:opacity-100"><X size={14} /></button></div>)}</div> : <p className="text-xs text-white/60">Your recent searches will appear here.</p>}</section>
          <section className="border-t border-white/10 pt-3"><p className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-[.16em] text-emerald-300/80"><TrendingUp size={14} /> Trending now</p><div className="flex flex-wrap gap-2">{trendingSearches.map((item) => <button key={item} type="button" onClick={() => choose(item)} className="flex min-h-8 items-center gap-1.5 rounded-full border border-white/20 px-3 text-xs font-bold text-white transition hover:border-emerald-300 hover:bg-emerald-300/10 hover:text-emerald-200"><Flame size={13} className="text-emerald-300" />{item}</button>)}</div></section>
        </div>}
        <div className="mt-4 border-t border-white/10 pt-3 text-[11px] font-semibold text-white/40">↑↓ navigate&nbsp;&nbsp; ↵ select&nbsp;&nbsp; esc close</div>
      </div>}
    </div>
  );
}
