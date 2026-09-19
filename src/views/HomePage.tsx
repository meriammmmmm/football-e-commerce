import { useEffect, useState } from 'react';
import type { Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import { ArrowRight, TrendingUp } from 'lucide-react';
import CommunityFits from '@/components/CommunityFits';
import GoogleReviews from '@/components/GoogleReviews';
import NewsletterSection from '@/components/NewsletterSection';
import StreetStyleGallery from '@/components/StreetStyleGallery';

interface HomePageProps {
  onShopNow: () => void;
  onSelectProduct: (product: Product) => void;
}

export function HomePage({ onShopNow, onSelectProduct }: HomePageProps) {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);

  useEffect(() => {
    // Fetch products from API and show first 5
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        const products = Array.isArray(data) ? data : data.products || [];
        setNewArrivals(products.slice(0, 5)); // Show first 5 products
      })
      .catch(() => setNewArrivals([]));
  }, []);

  return (
    <div className="bg-[#0a1628]">
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-emerald-600">
                <TrendingUp size={18} />
                Just arrived
              </div>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">New Arrivals</h2>
            </div>
            <button onClick={onShopNow} className="flex items-center gap-2 text-sm font-semibold text-emerald-600 transition hover:text-emerald-700">
              See All <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-5">
            {newArrivals.map((product) => <ProductCard key={product.id} product={product} onSelect={onSelectProduct} />)}
          </div>
        </div>
      </section>

      <CommunityFits />
      <StreetStyleGallery onShopNow={onShopNow} />
      <GoogleReviews />
      <NewsletterSection />
    </div>
  );
}
