'use client';

import { ChevronRight } from 'lucide-react';

interface LeagueCardProps {
  league: string;
  teamCount: number;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export default function LeagueCard({ league, teamCount, expanded, onToggle, children }: LeagueCardProps) {
  const initials = league === 'Premier League' ? 'PL' : league === 'International' ? 'INT' : league.slice(0, 2).toUpperCase();
  return <article className={`group overflow-hidden rounded-2xl border [perspective:1000px] [transform-style:preserve-3d] transition duration-300 ${expanded ? 'border-emerald-300/60 bg-white/[0.08] shadow-[0_12px_28px_rgba(0,0,0,.2)] sm:col-span-2' : 'border-white/15 bg-white/[0.08] hover:-translate-y-0.5 hover:rotate-[0.15deg] hover:border-emerald-300/60 hover:bg-white/[0.12] hover:shadow-[0_14px_32px_rgba(0,0,0,.18)]'}`}>
    <button type="button" onClick={onToggle} aria-expanded={expanded} className={`flex min-h-16 w-full items-center gap-3 px-4 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200/80 focus-visible:ring-inset sm:min-h-[72px] sm:px-5 ${expanded ? 'bg-[#286436]' : ''}`}>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-300 to-emerald-700 text-[11px] font-black text-[#071b12] shadow-[0_0_20px_rgba(62,207,142,.16)] sm:h-11 sm:w-11">{initials}</span>
      <span className="min-w-0 flex-1"><span className="block truncate text-sm font-black text-white sm:text-base">{league}</span><span className="mt-0.5 block text-xs font-bold text-white/70">{teamCount} teams</span></span>
      <ChevronRight size={19} className={`shrink-0 text-white/60 transition-transform duration-300 group-hover:translate-x-1 ${expanded ? 'rotate-90 text-emerald-300' : ''}`} />
    </button>
    {expanded && children}
  </article>;
}
