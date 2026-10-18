'use client';

import { Star, ArrowRight } from 'lucide-react';
import type { Product } from '@/types';
import { Rating } from './Rating';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  hideRating?: boolean;
}

export function ProductCard({ product, onSelect, hideRating = false }: ProductCardProps) {
  const [reviewCount, setReviewCount] = useState(0);
  const [averageRating, setAverageRating] = useState(product.rating);

  useEffect(() => {
    // Load review count and average rating from localStorage
    const storedReviews = localStorage.getItem(`reviews-${product.id}`);
    if (storedReviews) {
      try {
        const reviews = JSON.parse(storedReviews);
        setReviewCount(reviews.length);
        
        if (reviews.length > 0) {
          const avgRating = reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length;
          setAverageRating(Number(avgRating.toFixed(1)));
        }
      } catch (error) {
        setReviewCount(0);
        setAverageRating(product.rating);
      }
    }
  }, [product.id, product.rating]);

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8, rotateX: 2, rotateY: -2, scale: 1.01 }}
      onClick={() => onSelect(product)}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white text-left [perspective:1200px] [transform-style:preserve-3d] animate-[depthPulse_8s_ease-in-out_infinite] transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-950/15 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400/30"
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
          {!hideRating && <Rating rating={averageRating} />}
        </div>
        <h3 className="text-sm font-semibold leading-snug text-gray-900 transition-colors group-hover:text-emerald-700 sm:text-base">
          {product.name}
        </h3>
        {!hideRating && (
          <div className="mt-2 hidden items-center justify-between min-[375px]:flex">
            <div className="flex items-center gap-1.5">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              {reviewCount > 0 ? (
                <span className="text-sm font-medium text-gray-600">
                  {averageRating} · {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
                </span>
              ) : (
                <span className="text-sm font-medium text-gray-600">
                  No reviews yet
                </span>
              )}
            </div>
          </div>
        )}
        <div className="mt-auto pt-3">
          <span className="text-base font-bold text-gray-900 sm:text-lg">
            €{product.price.toFixed(2)}
          </span>
        </div>
      </div>
    </motion.button>
  );
}
