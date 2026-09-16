'use client';

import { useState, useEffect } from 'react';
import { HomePage } from '@/pages/HomePage';
import { ShopPage } from '@/pages/ShopPage';
import { ProductDetail } from '@/pages/ProductDetail';
import { CheckoutPage } from '@/pages/CheckoutPage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import CartDrawer from '@/components/CartDrawer';
import type { CartItem, Product } from '@/types';

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
      <Header onNavigate={navigate} currentPage={page} onSearch={setSearchQuery} cartItemCount={cartItemCount} onOpenCart={() => setCartOpen(true)} />

      {page === 'home' && (
        <div style={{ margin: 0, padding: 0, width: '100%' }}>
          <Hero
            iframeUrl={HERO_IFRAME}
            posterUrl={HERO_POSTER}
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
