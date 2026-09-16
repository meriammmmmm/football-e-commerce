import { useState, useMemo, useEffect } from 'react';
import type { Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import { SlidersHorizontal, X } from 'lucide-react';

interface ShopPageProps {
  onSelectProduct: (product: Product) => void;
  searchQuery: string;
}

const LEAGUES = ['All', 'National Team', 'Premier League', 'Argentina', 'Serie A', 'Legends'];
const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export function ShopPage({ onSelectProduct, searchQuery }: ShopPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeague, setSelectedLeague] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - replace with Supabase later
  useEffect(() => {
    const mockProducts: Product[] = [
      { 
        id: '1', 
        name: 'Boca Juniors #10 Maradona - Quilmes', 
        league: 'Argentina', 
        team: 'Boca Juniors',
        price: 129.99, 
        rating: 5.0, 
        reviews_count: 312, 
        image_url: '/800084945_28296201710045314_5696377547558753768_n.jpg',
        is_featured: true,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Blue', 'Yellow']
      },
      { 
        id: '2', 
        name: 'Man United #10 Van Nistelrooy', 
        league: 'Premier League', 
        team: 'Manchester United',
        price: 94.99, 
        rating: 4.8, 
        reviews_count: 203, 
        image_url: '/800594036_1428287385865418_5380508176128630865_n.jpg',
        is_featured: true,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Red', 'Black']
      },
     
      { 
        id: '4', 
        name: 'Man United #10 Van Nistelrooy - Short Sleeve', 
        league: 'Premier League', 
        team: 'Manchester United',
        price: 89.99, 
        rating: 4.8, 
        reviews_count: 198, 
        image_url: '/803539669_2111356956434067_4943158849259072036_n.jpg',
        is_featured: true,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Red', 'Black']
      },
      { 
        id: '5', 
        name: 'Netherlands #8 Bergkamp', 
        league: 'National Team', 
        team: 'Netherlands',
        price: 109.99, 
        rating: 4.9, 
        reviews_count: 124, 
        image_url: '/805876259_1769531613923629_3124609060888587814_n.jpg',
        is_new: true,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Orange', 'Black']
      },
      { 
        id: '6', 
        name: 'Argentina #10 Maradona Classic', 
        league: 'National Team', 
        team: 'Argentina',
        price: 134.99, 
        rating: 5.0, 
        reviews_count: 256, 
        image_url: '/806159190_1817067686129823_5538669484468410465_n.jpg',
        is_new: true,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Blue', 'White']
      },
      { 
        id: '7', 
        name: 'Classic Jersey Collection', 
        league: 'Legends', 
        team: 'Various',
        price: 99.99, 
        rating: 4.8, 
        reviews_count: 178, 
        image_url: '/808264817_3243795792472566_9045503013690706812_n.jpg',
        is_new: true,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Various']
      },
    ];

    setProducts(mockProducts);
    setLoading(false);
  }, []);

  const filtered = useMemo(() => {
    let result = [...products];

    if (selectedLeague !== 'All') {
      result = result.filter((p) => p.league.toLowerCase() === selectedLeague.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.team.toLowerCase().includes(q) ||
          p.league.toLowerCase().includes(q),
      );
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    }

    return result;
  }, [products, selectedLeague, sortBy, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 pt-[76px]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">The Shirt Edit</h1>
          <p className="mt-2 text-gray-600">
            Barcelona-curated football shirts, made for match days and memories.{' '}
            {loading ? '' : `${filtered.length} shirts available`}
          </p>
        </div>

        {/* Controls */}
        <div className="mb-8 space-y-4">
          <div className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
            {LEAGUES.map((league) => (
              <button
                key={league}
                onClick={() => setSelectedLeague(league)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedLeague === league
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-400'
                }`}
              >
                {league}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-400 lg:hidden"
            >
              <SlidersHorizontal size={16} />
              Sort
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="hidden rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition focus:border-emerald-500 focus:outline-none lg:block"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active search indicator */}
        {searchQuery.trim() && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <span>
              Showing results for: <strong>"{searchQuery}"</strong>
            </span>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white py-20 text-center">
            <p className="text-lg font-semibold text-gray-700">No jerseys found</p>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your filters or search query.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onSelect={onSelectProduct} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile sort overlay */}
      {showFilters && (
        <div
          className="fixed inset-0 z-50 bg-black/40 lg:hidden"
          onClick={() => setShowFilters(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Sort By</h3>
              <button onClick={() => setShowFilters(false)}>
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="space-y-2">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setSortBy(opt.value);
                    setShowFilters(false);
                  }}
                  className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                    sortBy === opt.value
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-50 text-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
