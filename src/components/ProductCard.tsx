'use client';

import { Star, ArrowRight } from 'lucide-react';
import type { Product } from '@/types';
import { Rating } from './Rating';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <button
      onClick={() => onSelect(product)}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white text-left transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/60"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
        <img
          src={product.image_url}
          alt={product.name}
          className={`h-full w-full object-cover transition duration-500 ${product.hover_image_url ? 'group-hover:scale-105 group-hover:opacity-0' : 'group-hover:scale-105'}`}
          loading="lazy"
        />
        {product.hover_image_url && (
          <>
            <img
              src={product.hover_image_url}
              alt={`${product.name} back view`}
              className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition duration-500 group-hover:scale-100 group-hover:opacity-100"
              loading="lazy"
            />
            <span className="absolute bottom-3 left-3 rounded-full bg-gray-950/75 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
              Back view
            </span>
          </>
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          {product.is_new && (
            <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
              NEW
            </span>
          )}
          {product.is_featured && !product.is_new && (
            <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-bold text-white shadow-sm">
              FEATURED
            </span>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center bg-gradient-to-t from-gray-950/80 to-transparent p-4 transition-transform duration-300 group-hover:translate-y-0">
          <span className="flex items-center gap-2 text-sm font-semibold text-white">
            View Details <ArrowRight size={16} />
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-emerald-600">
            {product.league}
          </span>
          <Rating rating={product.rating} />
        </div>
        <h3 className="text-sm font-semibold leading-snug text-gray-900 transition-colors group-hover:text-emerald-700 sm:text-base">
          {product.name}
        </h3>
        <div className="mt-2 hidden items-center justify-between min-[375px]:flex">
          <div className="flex items-center gap-1.5">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium text-gray-600">
              {product.rating} · {product.reviews_count} reviews
            </span>
          </div>
        </div>
        <div className="mt-auto pt-3">
          <span className="text-base font-bold text-gray-900 sm:text-lg">
            €{product.price.toFixed(2)}
          </span>
        </div>
      </div>
    </button>
  );
}
