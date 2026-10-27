'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Loader2, Pencil, Search, Trash2 } from 'lucide-react';
import type { Product } from '@/types';

export default function ProductList({ initialProducts }: { initialProducts: Product[] }) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [query, setQuery] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return products;
    return products.filter((product) =>
      [product.name, product.team, product.player, product.category, product.league]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(needle)),
    );
  }, [products, query]);

  const remove = async (product: Product) => {
    if (!window.confirm(`Remove "${product.name}" from the catalogue?`)) return;

    setBusyId(product.id);
    setError(null);
    try {
      const response = await fetch(`/api/products/${product.id}`, { method: 'DELETE' });
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        setError(data?.error ?? 'Could not remove this shirt.');
        return;
      }
      setProducts((current) => current.filter((item) => item.id !== product.id));
      router.refresh();
    } catch {
      setError('No connection to the server.');
    } finally {
      setBusyId(null);
    }
  };

  const toggleStock = async (product: Product) => {
    setBusyId(product.id);
    setError(null);
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: product.name,
          team: product.team,
          price: product.price,
          league: product.league,
          player: product.player,
          number: product.number,
          sleeveType: product.sleeveType,
          category: product.category,
          description: product.description,
          sizes: product.sizes,
          colors: product.colors,
          available: !product.available,
          is_new: product.is_new,
          is_featured: product.is_featured,
          rating: product.rating,
          reviews_count: product.reviews_count,
        }),
      });

      const data = (await response.json().catch(() => null)) as { product?: Product; error?: string } | null;
      if (!response.ok || !data?.product) {
        setError(data?.error ?? 'Could not update this shirt.');
        return;
      }
      setProducts((current) => current.map((item) => (item.id === data.product!.id ? data.product! : item)));
    } catch {
      setError('No connection to the server.');
    } finally {
      setBusyId(null);
    }
  };

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 px-6 py-12 text-center">
        <p className="text-sm font-bold text-white/70">The catalogue is empty.</p>
        <p className="mt-1 text-xs font-medium text-white/40">Add your first shirt from the Add tab.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search shirts"
          className="min-h-12 w-full rounded-xl border border-white/12 bg-[#162a45] pl-11 pr-4 text-base font-semibold text-white placeholder:text-white/30 outline-none focus:border-emerald-400/70"
        />
      </div>

      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
          <AlertCircle size={17} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <p className="px-1 text-xs font-bold uppercase tracking-wider text-white/40">
        {filtered.length} of {products.length} shirts
      </p>

      {filtered.length === 0 ? (
        <p className="px-1 py-6 text-center text-sm font-semibold text-white/50">
          Nothing matches “{query}”.
        </p>
      ) : (
        <ul className="space-y-2.5">
          {filtered.map((product) => {
            const busy = busyId === product.id;
            return (
              <li
                key={product.id}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#101f36] p-3"
              >
                <div className="h-16 w-13 shrink-0 overflow-hidden rounded-xl bg-[#162a45]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.image_url} alt="" className="h-full w-full object-cover" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-white">{product.name}</p>
                  <p className="mt-0.5 truncate text-xs font-semibold text-white/45">
                    {product.team} · €{product.price.toFixed(2)}
                  </p>
                  <button
                    type="button"
                    onClick={() => toggleStock(product)}
                    disabled={busy}
                    className={`mt-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider transition ${
                      product.available
                        ? 'bg-emerald-400/15 text-emerald-300'
                        : 'bg-white/10 text-white/45'
                    }`}
                  >
                    {busy ? 'Saving…' : product.available ? 'In stock' : 'Sold out'}
                  </button>
                </div>

                <div className="flex shrink-0 flex-col gap-2">
                  <Link
                    href={`/admin/products/${product.id}`}
                    aria-label={`Edit ${product.name}`}
                    className="grid h-10 w-10 place-items-center rounded-xl border border-white/12 text-white/70 transition active:scale-95"
                  >
                    <Pencil size={16} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(product)}
                    disabled={busy}
                    aria-label={`Remove ${product.name}`}
                    className="grid h-10 w-10 place-items-center rounded-xl border border-red-400/25 text-red-300/80 transition active:scale-95 disabled:opacity-40"
                  >
                    {busy ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
