'use client';

import Image from 'next/image';
import { ArrowUpRight, ChevronRight, Sparkles, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Product } from '@/types';
import SearchBar from './SearchBar';
import LeagueCard from './LeagueCard';
import PlayerCarousel from './PlayerCarousel';

interface SearchOverlayProps {
  open: boolean;
  initialQuery?: string;
  onClose: () => void;
  onSearch: (query: string) => void;
  onSelectProduct: (product: Product) => void;
}

const popularCategories = ['New arrivals', 'Retro jerseys', 'Current season', 'Clearance'];
const fallbackLeagues = ['Premier League', 'Serie A', 'Bundesliga', 'La Liga', 'Ligue 1', 'International', 'MLS', 'Eredivisie'];
const internationalCountries = `Afghanistan|AF,Albania|AL,Algeria|DZ,Andorra|AD,Angola|AO,Antigua and Barbuda|AG,Argentina|AR,Armenia|AM,Australia|AU,Austria|AT,Azerbaijan|AZ,Bahamas|BS,Bahrain|BH,Bangladesh|BD,Barbados|BB,Belarus|BY,Belgium|BE,Belize|BZ,Benin|BJ,Bhutan|BT,Bolivia|BO,Bosnia and Herzegovina|BA,Botswana|BW,Brazil|BR,Brunei|BN,Bulgaria|BG,Burkina Faso|BF,Burundi|BI,Cabo Verde|CV,Cambodia|KH,Cameroon|CM,Canada|CA,Central African Republic|CF,Chad|TD,Chile|CL,China|CN,Colombia|CO,Comoros|KM,Congo|CG,Costa Rica|CR,Cote d'Ivoire|CI,Croatia|HR,Cuba|CU,Cyprus|CY,Czechia|CZ,Democratic Republic of the Congo|CD,Denmark|DK,Djibouti|DJ,Dominica|DM,Dominican Republic|DO,Ecuador|EC,Egypt|EG,El Salvador|SV,Equatorial Guinea|GQ,Eritrea|ER,Estonia|EE,Eswatini|SZ,Ethiopia|ET,Fiji|FJ,Finland|FI,France|FR,Gabon|GA,Gambia|GM,Georgia|GE,Germany|DE,Ghana|GH,Greece|GR,Grenada|GD,Guatemala|GT,Guinea|GN,Guinea-Bissau|GW,Guyana|GY,Haiti|HT,Honduras|HN,Hungary|HU,Iceland|IS,India|IN,Indonesia|ID,Iran|IR,Iraq|IE,Ireland|IE,Israel|IL,Italy|IT,Jamaica|JM,Japan|JP,Jordan|JO,Kazakhstan|KZ,Kenya|KE,Kiribati|KI,Kuwait|KW,Kyrgyzstan|KG,Laos|LA,Latvia|LV,Lebanon|LB,Lesotho|LS,Liberia|LR,Libya|LY,Liechtenstein|LI,Lithuania|LT,Luxembourg|LU,Madagascar|MG,Malawi|MW,Malaysia|MY,Maldives|MV,Mali|ML,Malta|MT,Marshall Islands|MH,Mauritania|MR,Mauritius|MU,Mexico|MX,Micronesia|FM,Moldova|MD,Monaco|MC,Mongolia|MN,Montenegro|ME,Morocco|MA,Mozambique|MZ,Myanmar|MM,Namibia|NA,Nauru|NR,Nepal|NP,Netherlands|NL,New Zealand|NZ,Nicaragua|NI,Niger|NE,Nigeria|NG,North Korea|KP,North Macedonia|MK,Norway|NO,Oman|OM,Pakistan|PK,Palau|PW,Panama|PA,Papua New Guinea|PG,Paraguay|PY,Peru|PE,Philippines|PH,Poland|PL,Portugal|PT,Qatar|QA,Romania|RO,Russia|RU,Rwanda|RW,Saint Kitts and Nevis|KN,Saint Lucia|LC,Saint Vincent and the Grenadines|VC,Samoa|WS,San Marino|SM,Sao Tome and Principe|ST,Saudi Arabia|SA,Senegal|SN,Serbia|RS,Seychelles|SC,Sierra Leone|SL,Singapore|SG,Slovakia|SK,Slovenia|SI,Solomon Islands|SB,Somalia|SO,South Africa|ZA,South Korea|KR,South Sudan|SS,Spain|ES,Sri Lanka|LK,Sudan|SD,Suriname|SR,Sweden|SE,Switzerland|CH,Syria|SY,Taiwan|TW,Tajikistan|TJ,Tanzania|TZ,Thailand|TH,Timor-Leste|TL,Togo|TG,Tonga|TO,Trinidad and Tobago|TT,Tunisia|TN,Turkey|TR,Turkmenistan|TM,Tuvalu|TV,Uganda|UG,Ukraine|UA,United Arab Emirates|AE,United Kingdom|GB,United States|US,Uruguay|UY,Uzbekistan|UZ,Vanuatu|VU,Vatican City|VA,Venezuela|VE,Vietnam|VN,Yemen|YE,Zambia|ZM,Zimbabwe|ZW,Kosovo|XK`.split(',').map((country) => country.split('|') as [string, string]);
const internationalCountryNames = internationalCountries.map(([name]) => name);
const leagueTeams: Record<string, string[]> = {
  'Premier League': ['Arsenal', 'Aston Villa', 'Bournemouth', 'Brentford', 'Brighton & Hove Albion', 'Chelsea', 'Coventry', 'Crystal Palace', 'Everton', 'Fulham', 'Hull City', 'Ipswich', 'Leeds United', 'Liverpool', 'Manchester City', 'Manchester United', 'Newcastle', 'Nottingham Forest', 'Sunderland', 'Tottenham'],
  'Serie A': ['AC Milan', 'Atalanta', 'Bologna', 'Cagliari', 'Fiorentina', 'Genoa', 'Inter Milan', 'Juventus', 'Lazio', 'Lecce', 'Napoli', 'Parma', 'Roma', 'Sassuolo', 'Torino', 'Udinese', 'Venezia'],
  Bundesliga: ['Bayer Leverkusen', 'Bayern Munich', 'Borussia Dortmund', 'Borussia Monchengladbach', 'Eintracht Frankfurt', 'FC Koln', 'FSV Mainz', 'Hamburg', 'RB Leipzig', 'Schalke', 'Stuttgart', 'TSG Hoffenheim', 'Union Berlin', 'Werder Bremen'],
  'La Liga': ['Alaves', 'Athletic Bilbao', 'Atletico Madrid', 'Barcelona', 'Celta Vigo', 'Deportivo de La Coruna', 'Elche', 'Espanyol', 'Getafe', 'Levante', 'Malaga', 'Rayo Vallecano', 'Real Betis', 'Real Madrid', 'Real Sociedad', 'Sevilla', 'Valencia', 'Villarreal'],
  'Ligue 1': ['Auxerre', 'Le Havre', 'Lens', 'Lille', 'Lorient', 'Lyon', 'Monaco', 'Olympique Marseille', 'Paris Saint-Germain', 'Strasbourg', 'Toulouse', 'Nice', 'Angers', 'Stade Rennais'],
  International: internationalCountryNames,
  MLS: ['Chicago Fire', 'DC United', 'Inter Miami', 'New York City', 'Orlando City', 'Philadelphia Union', 'Portland Timbers', 'San Jose Earthquakes', 'Seattle Sounders', 'Toronto FC', 'Vancouver Whitecaps', 'MLS Teams', 'Columbus Crew', 'FC Dallas', 'Houston Dynamo', 'LAFC', 'LA Galaxy', 'Montreal Impact', 'New York Red Bulls', 'Real Salt Lake', 'Sporting Kansas', 'New England Revolution'],
  Eredivisie: ['Ajax', 'AZ Alkmaar', 'FC Twente', 'Feyenoord', 'Groningen', 'PSV', 'Sparta Rotterdam', 'Utrecht', 'Willem II'],
};

const teamFlagColors: Record<string, string> = {
  Arsenal: 'linear-gradient(#ef1b2d 0 50%, #ffffff 50%)', 'Aston Villa': 'linear-gradient(90deg, #670b34 0 38%, #95bfe5 38%)', Bournemouth: 'linear-gradient(#d71920 0 50%, #111111 50%)', Brentford: '#e30613', 'Brighton & Hove Albion': 'linear-gradient(90deg, #0057b8 0 35%, #ffffff 35% 65%, #0057b8 65%)', Chelsea: '#034694', Coventry: '#1d9bd1', 'Crystal Palace': 'linear-gradient(#1b458f 0 50%, #c8102e 50%)', Everton: '#003399', Fulham: '#111111', 'Hull City': 'linear-gradient(#f5a800 0 50%, #111111 50%)', Ipswich: '#3b82c4', 'Leeds United': 'linear-gradient(#f2c500 0 50%, #0053a0 50%)', Liverpool: '#c8102e', 'Manchester City': '#6caddf', 'Manchester United': '#da291c', Newcastle: '#222222', 'Nottingham Forest': '#e53233', Sunderland: '#f43232', Tottenham: '#132257',
  'AC Milan': 'linear-gradient(#e30613 0 50%, #111111 50%)', Atalanta: 'linear-gradient(#0055a4 0 50%, #111111 50%)', Bologna: 'linear-gradient(#172b5b 0 50%, #e30613 50%)', Cagliari: 'linear-gradient(#c8102e 0 50%, #005ca9 50%)', Fiorentina: '#563d9c', Genoa: 'linear-gradient(#e30613 0 50%, #005ca9 50%)', Juventus: '#111111', 'Inter Milan': 'linear-gradient(#001e62 0 50%, #111111 50%)', Lazio: '#80d0ee', Lecce: '#e30613', Napoli: '#12a9e0', Parma: '#17469f', Roma: 'linear-gradient(#8e1f2f 0 50%, #f3c300 50%)', Sassuolo: 'linear-gradient(#009b62 0 50%, #111111 50%)', Torino: '#a52b18', Udinese: '#111111', Venezia: 'linear-gradient(#ff7919 0 50%, #00594f 50%)',
  Barcelona: 'linear-gradient(90deg, #a50044 0 50%, #004d98 50%)', 'Real Madrid': 'linear-gradient(#ffffff 0 50%, #f5c400 50%)', 'Atletico Madrid': '#29346f', 'Bayern Munich': 'linear-gradient(#dc052d 0 50%, #ffffff 50%)', 'Borussia Dortmund': 'linear-gradient(#fdeb00 0 50%, #111111 50%)', 'Paris Saint-Germain': 'linear-gradient(#004170 0 50%, #ed1b2f 50%)',
  'Bayer Leverkusen': 'linear-gradient(#111111 0 50%, #e30613 50%)', 'Borussia Monchengladbach': 'linear-gradient(#111111 0 50%, #ffffff 50%)', 'Eintracht Frankfurt': 'linear-gradient(#e30613 0 50%, #111111 50%)', 'FC Koln': '#e30613', 'FSV Mainz': '#d20a2e', Hamburg: '#0066b3', 'RB Leipzig': '#e50046', Schalke: '#005ca9', Stuttgart: '#e32219', 'TSG Hoffenheim': '#0066b3', 'Union Berlin': '#e30613', 'Werder Bremen': '#1aa98a',
  'Auxerre': '#005ca9', 'Le Havre': '#b9ddea', Lens: '#ed1b2f', Lille: '#e30613', Lorient: 'linear-gradient(#ff7900 0 50%, #111111 50%)', Lyon: 'linear-gradient(#005ca9 0 50%, #e30613 50%)', Monaco: '#ed1b2f', 'Olympique Marseille': '#3ca9d8', Strasbourg: '#164194', Toulouse: '#9482bd', Nice: 'linear-gradient(#111111 0 50%, #ed1b2f 50%)', Angers: '#111111', 'Stade Rennais': 'linear-gradient(#ed1b2f 0 50%, #111111 50%)',
  'Chicago Fire': '#17245b', 'DC United': '#e31837', 'Inter Miami': 'linear-gradient(#f7a8c4 0 50%, #111111 50%)', 'New York City': 'linear-gradient(#6cace4 0 50%, #17468f 50%)', 'Orlando City': 'linear-gradient(#5b2a86 0 50%, #ffca05 50%)', 'Philadelphia Union': 'linear-gradient(#006bb6 0 50%, #b9a36b 50%)', 'Portland Timbers': 'linear-gradient(#004812 0 50%, #f5d000 50%)', 'San Jose Earthquakes': 'linear-gradient(#006cb7 0 50%, #111111 50%)', 'Seattle Sounders': '#0052a5', 'Toronto FC': '#c8102e', 'Vancouver Whitecaps': 'linear-gradient(#00245d 0 50%, #9ac4e4 50%)', 'MLS Teams': 'linear-gradient(#b6292e 0 50%, #111111 50%)', 'Columbus Crew': 'linear-gradient(#f7d117 0 50%, #111111 50%)', 'FC Dallas': 'linear-gradient(#e31837 0 50%, #005ca9 50%)', 'Houston Dynamo': 'linear-gradient(#f26522 0 50%, #005ca9 50%)', LAFC: 'linear-gradient(#c5a977 0 50%, #111111 50%)', 'LA Galaxy': 'linear-gradient(#00245d 0 50%, #f5d000 50%)', 'Montreal Impact': '#17245b', 'New York Red Bulls': '#ed1b2f', 'Real Salt Lake': 'linear-gradient(#b30838 0 50%, #005ca9 50%)', 'Sporting Kansas': 'linear-gradient(#005ca9 0 50%, #ffffff 50%)', 'New England Revolution': 'linear-gradient(#0b1f41 0 50%, #ed1b2f 50%)',
  Ajax: 'linear-gradient(#ed1b2f 0 50%, #ffffff 50%)', 'AZ Alkmaar': '#ed3b32', 'FC Twente': '#ed1b2f', Feyenoord: '#ed1b2f', Groningen: '#008b5a', PSV: '#ed1b2f', 'Sparta Rotterdam': 'linear-gradient(#f5c04a 0 50%, #ffffff 50%)', Utrecht: '#d63b2f', 'Willem II': '#1769b0',
};

const getTeamFlagColor = (league: string, team: string) => {
  if (teamFlagColors[team]) return teamFlagColors[team];
  const leagueColors: Record<string, string> = { 'Premier League': '#e30613', 'Serie A': '#1683c8', Bundesliga: '#d00027', 'La Liga': '#f1b900', 'Ligue 1': '#172b85', International: 'linear-gradient(#0b5bbb 0 50%, #ffffff 50%)', MLS: '#d71920', Eredivisie: '#ed1c24' };
  return leagueColors[league] ?? '#286436';
};

const getCountryFlag = (country: string) => {
  const code = internationalCountries.find(([name]) => name === country)?.[1] ?? 'UN';
  return [...code].map((letter) => String.fromCodePoint(127397 + letter.charCodeAt(0))).join('');
};

export default function SearchOverlay({ open, initialQuery = '', onClose, onSearch, onSelectProduct }: SearchOverlayProps) {
  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState<Product[]>([]);
  const [expandedLeague, setExpandedLeague] = useState<string | null>(null);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const onCloseRef = useRef(onClose);
  const overlayRef = useRef<HTMLDivElement>(null);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current();
      if (event.key !== 'Tab' || !overlayRef.current) return;
      const focusable = overlayRef.current.querySelectorAll<HTMLElement>('button, input, [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      const first = focusable[0]; const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    void fetch('/api/products').then((response) => response.ok ? response.json() : []).then((data) => setProducts(Array.isArray(data) ? data : data.products || [])).catch(() => setProducts([]));
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handleKeyDown); };
  // The overlay owns its input state; rerunning this effect on every keystroke would reset it.
  }, [open]);

  const normalizedQuery = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!normalizedQuery) return [];
    return products.filter((product) => [product.name, product.team, product.player, product.league, product.category].filter(Boolean).join(' ').toLowerCase().includes(normalizedQuery)).slice(0, 6);
  }, [normalizedQuery, products]);

  const leagues = useMemo(() => [...new Set(products.map((product) => product.league).filter(Boolean) as string[])].slice(0, 6), [products]);
  const players = useMemo(() => products.filter((product) => product.player).slice(0, 7), [products]);

  const choose = (value: string) => { setQuery(value); onSearch(value); };
  const toggleLeague = (league: string) => setExpandedLeague((current) => current === league ? null : league);
  const handleQueryChange = (value: string) => { setQuery(value); onSearch(value); };
  const submit = () => { onSearch(query); onClose(); };

  if (!open) return null;

  return (
    <div ref={overlayRef} style={{ '--so-surface': 'rgba(255,255,255,.08)', '--so-border': 'rgba(255,255,255,.15)', '--so-hover': 'rgba(255,255,255,.12)', '--so-panel': '#22304f', '--so-mint': '#3ecf8e', backgroundImage: 'radial-gradient(circle at 92% 8%, rgba(62,207,142,.12), transparent 32%), radial-gradient(circle at 8% 90%, rgba(79,124,255,.10), transparent 36%), linear-gradient(180deg, #1a2540 0%, #111a2e 100%)' } as React.CSSProperties} className="search-overlay fixed inset-0 z-[9999] isolate overflow-y-auto text-white animate-[searchFadeIn_220ms_ease-out]" role="dialog" aria-modal="true" aria-label="Search Headbutt">
      <div className="relative mx-auto min-h-full max-w-6xl px-6 pb-16 pt-5 sm:pt-8">
        <div className="flex items-center justify-between animate-[searchDropIn_420ms_cubic-bezier(0.16,1,0.3,1)]">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-300"><Sparkles size={15} /> Find your shirt</div>
          <button type="button" onClick={onClose} aria-label="Close search" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.05] text-white transition hover:border-emerald-300 hover:bg-white/10"><X size={21} /></button>
        </div>

        <div className="mt-6 pb-2 sm:mt-8">
          <h1 className="mb-8 text-5xl font-black tracking-[-.05em] text-white md:text-6xl">Find your shirt</h1>
          <SearchBar query={query} products={products} onChange={handleQueryChange} onSubmit={submit} onPick={choose} onSuggestionsChange={setSuggestionsOpen} />
        </div>

        <div className={`mt-16 transition-opacity duration-200 ${suggestionsOpen ? 'pointer-events-none opacity-40' : 'opacity-100'}`}>
        {normalizedQuery ? (
          <section className="mt-8" aria-live="polite">
            <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">Search results</p><h2 className="mt-2 text-2xl font-black tracking-[-0.04em] sm:text-3xl">{results.length ? `${results.length} shirts for “${query}”` : `No shirts for “${query}”`}</h2></div>{results.length > 0 && <button type="button" onClick={() => { onSearch(query); onClose(); }} className="hidden items-center gap-1 text-sm font-bold text-emerald-300 sm:flex">View all <ArrowUpRight size={16} /></button>}</div>
            {results.length ? <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{results.map((product, index) => <button key={product.id} type="button" onClick={() => { onSelectProduct(product); onClose(); }} style={{ animationDelay: `${index * 55}ms` }} className="group flex animate-[searchRiseIn_420ms_cubic-bezier(0.16,1,0.3,1)_both] items-center gap-3 rounded-2xl border border-[var(--so-border)] bg-[var(--so-surface)] p-3 text-left transition hover:-translate-y-0.5 hover:border-emerald-300/60 hover:bg-[var(--so-hover)]"><div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-[#0b1220]"><Image src={product.image_url} alt="" fill sizes="64px" className="object-cover transition duration-500 group-hover:scale-105" /></div><span className="min-w-0"><span className="block truncate text-xs font-black uppercase tracking-wider text-emerald-300">{product.team}</span><span className="mt-1 block line-clamp-2 text-sm font-bold leading-snug text-white">{product.name}</span><span className="mt-2 block text-sm font-black text-white">€{product.price.toFixed(2)}</span></span><ChevronRight className="ml-auto shrink-0 text-white/50 transition group-hover:translate-x-1 group-hover:text-emerald-300" size={18} /></button>)}</div> : <div className="mt-5 rounded-2xl border border-dashed border-[var(--so-border)] bg-[var(--so-surface)] p-8 text-center animate-[searchRiseIn_350ms_ease-out_both]"><p className="font-bold text-white">Nothing found yet.</p><p className="mt-1 text-white/70">Try a player, club or category.</p></div>}
          </section>
        ) : (
          <div className="mt-8">
            <section aria-labelledby="browse-leagues-heading"><div className="flex items-end justify-between gap-4"><div><p className="text-[11px] font-black uppercase tracking-[.18em] text-emerald-300">Explore the collection</p><h2 id="browse-leagues-heading" className="mt-2 text-lg font-black text-white sm:text-xl">Browse by league</h2><p className="mt-1 text-sm font-semibold text-white/70">Choose a league to see its teams</p></div><span className="text-xs font-bold text-white/70">{(leagues.length ? leagues : fallbackLeagues).length} leagues</span></div><div className="mt-4 grid gap-4 sm:grid-cols-2">{(leagues.length ? leagues : fallbackLeagues).map((league) => <LeagueCard key={league} league={league} teamCount={(leagueTeams[league] ?? []).length} expanded={expandedLeague === league} onToggle={() => toggleLeague(league)}><div className="grid max-h-[min(65vh,720px)] animate-[searchRiseIn_280ms_ease-out_both] grid-cols-1 gap-2 overflow-y-auto p-3 sm:grid-cols-2">{(leagueTeams[league] ?? []).map((team, index) => <button key={team} type="button" onClick={() => choose(team)} style={{ animationDelay: `${Math.min(index, 24) * 18}ms` }} className="flex animate-[searchRiseIn_260ms_ease-out_both] min-h-12 items-center gap-3 rounded-lg border border-[var(--so-border)] bg-[var(--so-surface)] px-3 py-3 text-left text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--so-hover)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"><span aria-hidden="true" className="grid h-6 w-7 shrink-0 place-items-center rounded-md bg-emerald-50 text-base shadow-sm">{league === 'International' ? getCountryFlag(team) : <span className="h-3.5 w-5 rounded-[2px] shadow-sm" style={{ background: getTeamFlagColor(league, team) }} />}</span>{team}</button>)}</div></LeagueCard>)}</div></section>
            <PlayerCarousel players={players} onPick={choose} />
          </div>
        )}

        {!normalizedQuery && <section className="mt-16"><h2 className="text-lg font-black">Popular categories</h2><div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">{popularCategories.map((category, index) => <button key={category} type="button" onClick={() => choose(category)} className="shrink-0 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm font-bold text-white/80 transition hover:border-emerald-300/60 hover:bg-emerald-300/10"><span className="mr-1.5 text-emerald-300">0{index + 1}</span>{category}</button>)}</div></section>}
        </div>
      </div>
    </div>
  );
}
