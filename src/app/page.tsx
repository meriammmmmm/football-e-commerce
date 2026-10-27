'use client';

import { useState, useEffect } from 'react';
import { HomePage } from '@/views/HomePage';
import { ShopPage } from '@/views/ShopPage';
import { ProductDetail } from '@/views/ProductDetail';
import { CheckoutPage } from '@/views/CheckoutPage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import CartDrawer from '@/components/CartDrawer';
import type { CartItem, Product } from '@/types';

// Inject the shop PWA manifest only on shop pages (React 19 hoists this to <head>).
// The admin layout injects its own manifest, so each URL gets the right PWA scope.
const ShopManifest = () => <link rel="manifest" href="/manifest.webmanifest" />;

const HERO_IFRAME = 'https://customer-lx9ld4quur3dic2x.cloudflarestream.com/9a1e319c031e68dbd67156531b462957/iframe?muted=true&preload=true&loop=true&autoplay=true&controls=false&poster=https%3A%2F%2Fcustomer-lx9ld4quur3dic2x.cloudflarestream.com%2F9a1e319c031e68dbd67156531b462957%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600';
const HERO_POSTER = 'https://customer-lx9ld4quur3dic2x.cloudflarestream.com/9a1e319c031e68dbd67156531b462957/thumbnails/thumbnail.jpg?time=&height=600';

type Page = 'home' | 'shop' | 'product' | 'checkout';

export default function Home() {
  const [page, setPage] = useState<Page>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const navigate = (newPage: 'home' | 'shop') => {
    setPage(newPage);
  };

  const selectProduct = (product: Product) => {
    setSelectedProduct(product);
    setPage('product');
  };

  const handleAddToCart = (product: Product, size: string, quantity: number) => {
    setCartItems((items) => {
      const matchingIndex = items.findIndex((item) => item.product.id === product.id && item.size === size);
      if (matchingIndex === -1) return [...items, { product, size, quantity }];
      return items.map((item, index) => index === matchingIndex ? { ...item, quantity: item.quantity + quantity } : item);
    });
    setCartOpen(true);
  };
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const showFooter = page !== 'product';

  return (
    <div className="flex flex-col min-h-screen bg-[#0a1628]" style={{ margin: 0, padding: 0, width: '100%' }}>
      {/* Inject shop manifest here so it only appears on shop pages, not /admin pages */}
      <ShopManifest />
      <Header onNavigate={navigate} currentPage={page} onSearch={setSearchQuery} onSelectProduct={selectProduct} cartItemCount={cartItemCount} onOpenCart={() => setCartOpen(true)} />

      {page === 'home' && (
        <div style={{ margin: 0, padding: 0, width: '100%' }}>
          <Hero
            iframeUrl={HERO_IFRAME}
            posterUrl={HERO_POSTER}
            secondSlideImage="/757954847_18103895350999396_5983842247708972129_n.jpg"
            onShopNow={() => navigate('shop')}
          />
          <HomePage
            onShopNow={() => navigate('shop')}
            onSelectProduct={selectProduct}
          />
        </div>
      )}

      {page === 'shop' && (
        <ShopPage onSelectProduct={selectProduct} searchQuery={searchQuery} />
      )}

      {page === 'product' && selectedProduct && (
        <ProductDetail
          key={selectedProduct.id}
          product={selectedProduct}
          onBack={() => navigate('shop')}
          onAddToCart={handleAddToCart}
          onSelectProduct={selectProduct}
        />
      )}
      {page === 'checkout' && <CheckoutPage items={cartItems} onBack={() => navigate('shop')} onOrderPlaced={() => setCartItems([])} />}

      {showFooter && <Footer />}
      <CartDrawer isOpen={cartOpen} items={cartItems} onClose={() => setCartOpen(false)} onUpdateQuantity={(index, quantity) => quantity > 0 && setCartItems((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, quantity } : item))} onRemove={(index) => setCartItems((items) => items.filter((_, itemIndex) => itemIndex !== index))} onCheckout={() => { setCartOpen(false); setPage('checkout'); }} />
    </div>
  );
}
