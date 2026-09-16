'use client';

import { ProductCard } from './ProductCard';
import type { Product } from '@/types';

interface ProductGridProps {
  title: string;
  products: Product[];
}

export default function ProductGrid({ title, products }: ProductGridProps) {
  const handleSelectProduct = (product: Product) => {
    console.log('Selected product:', product);
  };

  return (
    <section className="container mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
        <a href="#" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">VIEW ALL →</a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onSelect={handleSelectProduct} 
          />
        ))}
      </div>
    </section>
  );
}