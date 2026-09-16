import { useEffect, useState } from 'react';
import type { Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import { ArrowRight, TrendingUp, Sparkles } from 'lucide-react';
import CommunityFits from '@/components/CommunityFits';
import GoogleReviews from '@/components/GoogleReviews';
import NewsletterSection from '@/components/NewsletterSection';
import StreetStyleGallery from '@/components/StreetStyleGallery';

interface HomePageProps {
  onShopNow: () => void;
  onSelectProduct: (product: Product) => void;
}

export function HomePage({ onShopNow, onSelectProduct }: HomePageProps) {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [legends, setLegends] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now - replace with Supabase later
    const mockFeatured: Product[] = [
      { 
        id: '1', 
        name: 'Boca Juniors #10 Maradona - Quilmes', 
        league: 'ARGENTINA', 
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
        league: 'PREMIER LEAGUE', 
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
        id: '3', 
        name: 'Inter Milan #10 Ronaldo', 
        league: 'SERIE A', 
        team: 'Inter Milan',
        price: 119.99, 
        rating: 4.9, 
        reviews_count: 289, 
        image_url: '/inter-ronaldo-front.webp',
        hover_image_url: '/inter-ronaldo-back.webp',
        is_featured: true,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Blue', 'Black']
      },
      { 
        id: '4', 
        name: 'Man United #10 Van Nistelrooy - Short Sleeve', 
        league: 'PREMIER LEAGUE', 
        team: 'Manchester United',
        price: 89.99, 
        rating: 4.8, 
        reviews_count: 198, 
        image_url: '/803539669_2111356956434067_4943158849259072036_n.jpg',
        is_featured: true,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Red', 'Black']
      },
    ];

    const mockNewArrivals: Product[] = [
      { 
        id: '5', 
        name: 'Netherlands #8 Bergkamp', 
        league: 'NATIONAL TEAM', 
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
        league: 'NATIONAL TEAM', 
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
        league: 'LEGENDS', 
        team: 'Various',
        price: 99.99, 
        rating: 4.8, 
        reviews_count: 178, 
        image_url: '/808264817_3243795792472566_9045503013690706812_n.jpg',
        is_new: true,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Various']
      },
      { 
        id: '8', 
        name: 'Boca Juniors #10 Maradona', 
        league: 'ARGENTINA', 
        team: 'Boca Juniors',
        price: 129.99, 
        rating: 5.0, 
        reviews_count: 145, 
        image_url: '/800084945_28296201710045314_5696377547558753768_n.jpg',
        is_new: true,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Blue', 'Yellow']
      },
    ];

    const mockBestSellers: Product[] = [
      { 
        id: '9', 
        name: '1998-99 Man Utd Home', 
        league: 'PREMIER LEAGUE', 
        team: 'Manchester United',
        price: 79.99, 
        rating: 4.9, 
        reviews_count: 421, 
        image_url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&q=80',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Red', 'White']
      },
      { 
        id: '10', 
        name: '2002-03 Real Madrid Home', 
        league: 'LA LIGA', 
        team: 'Real Madrid',
        price: 84.99, 
        rating: 4.8, 
        reviews_count: 378, 
        image_url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&q=80',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['White']
      },
      { 
        id: '11', 
        name: '2010-11 Arsenal Home', 
        league: 'PREMIER LEAGUE', 
        team: 'Arsenal',
        price: 74.99, 
        rating: 4.7, 
        reviews_count: 289, 
        image_url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&q=80',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Red', 'White']
      },
      { 
        id: '12', 
        name: '1995-96 Liverpool Away', 
        league: 'PREMIER LEAGUE', 
        team: 'Liverpool',
        price: 69.99, 
        rating: 4.6, 
        reviews_count: 234, 
        image_url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&q=80',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['White', 'Green']
      },
    ];

    const mockLegends: Product[] = [
      { 
        id: '13', 
        name: '1986 Argentina Home - Maradona', 
        league: 'NATIONAL TEAM', 
        team: 'Argentina',
        price: 129.99, 
        rating: 5.0, 
        reviews_count: 512, 
        image_url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&q=80',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Blue', 'White']
      },
      { 
        id: '14', 
        name: '2007-08 AC Milan Home', 
        league: 'SERIE A', 
        team: 'AC Milan',
        price: 114.99, 
        rating: 4.9, 
        reviews_count: 389, 
        image_url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&q=80',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Red', 'Black']
      },
      { 
        id: '15', 
        name: '1994 Brazil Home - Romario', 
        league: 'NATIONAL TEAM', 
        team: 'Brazil',
        price: 134.99, 
        rating: 4.9, 
        reviews_count: 445, 
        image_url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&q=80',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Blue']
      },
      { 
        id: '16', 
        name: '2008-09 Barcelona Home - Messi', 
        league: 'LA LIGA', 
        team: 'Barcelona',
        price: 139.99, 
        rating: 5.0, 
        reviews_count: 678, 
        image_url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&q=80',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Blue', 'Red']
      },
    ];

    setFeatured(mockFeatured);
    setNewArrivals(mockNewArrivals);
    setBestSellers(mockBestSellers);
    setLegends(mockLegends);
    setLoading(false);
  }, []);

  return (
    <div className="bg-[#0a1628]">
      {/* Featured Products - Light Background */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-emerald-600">
                <TrendingUp size={18} />
                Barcelona Favorites
              </div>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Featured Shirts
              </h2>
            </div>
            <button
              onClick={onShopNow}
              className="hidden items-center gap-2 text-sm font-semibold text-gray-900 transition hover:text-emerald-600 sm:flex"
            >
              View All <ArrowRight size={16} />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] animate-pulse rounded-2xl bg-gray-100"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} onSelect={onSelectProduct} />
              ))}
            </div>
          )}
        </div>
      </section>

     

      {/* Community Fits Section */}
      <CommunityFits />

      {/* Street Style Gallery */}
      <StreetStyleGallery onShopNow={onShopNow} />

      {/* Google Reviews Section */}
      <GoogleReviews />

      {/* Newsletter Section */}
      <NewsletterSection />
     
    </div>
  );
}
