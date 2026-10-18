import { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingBag, Check, Truck, ShieldCheck, RefreshCw, Minus, Plus, Star } from 'lucide-react';
import type { Product } from '@/types';
import { Rating } from '@/components/Rating';
import { ProductCard } from '@/components/ProductCard';
import { motion } from 'framer-motion';

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, size: string, quantity: number) => void;
  onSelectProduct: (product: Product) => void;
}

export function ProductDetail({ product, onBack, onAddToCart, onSelectProduct }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });
  const [reviewError, setReviewError] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const productImages = [product.image_url, product.hover_image_url].filter((image): image is string => Boolean(image));
  const [selectedImage, setSelectedImage] = useState(product.image_url);

  // Fetch related products from API
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        // Get 3 random products that are not the current product
        const allProducts = Array.isArray(data) ? data : data.products || [];
        const filtered = allProducts.filter((p: Product) => p.id !== product.id);
        const shuffled = filtered.sort(() => Math.random() - 0.5);
        setRelatedProducts(shuffled.slice(0, 3));
      })
      .catch(() => setRelatedProducts([]));
  }, [product.id]);

  // Fetch reviews
  useEffect(() => {
    // Reset reviews state first
    setReviews([]);
    // Load reviews from localStorage for this product
    const storedReviews = localStorage.getItem(`reviews-${product.id}`);
    if (storedReviews) {
      try {
        setReviews(JSON.parse(storedReviews));
      } catch (error) {
        console.error('Error loading reviews:', error);
        setReviews([]);
      }
    }
  }, [product.id]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');

    if (!newReview.name.trim()) {
      setReviewError('Please enter your name');
      return;
    }

    if (newReview.comment.trim() && newReview.comment.trim().length < 10) {
      setReviewError('Review must be at least 10 characters if provided');
      return;
    }

    setIsSubmittingReview(true);

    const review: Review = {
      id: Date.now().toString(),
      name: newReview.name.trim(),
      rating: newReview.rating,
      comment: newReview.comment.trim() || `Rated ${newReview.rating} stars`,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    };

    const updatedReviews = [review, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem(`reviews-${product.id}`, JSON.stringify(updatedReviews));

    // Reset form
    setNewReview({ name: '', rating: 5, comment: '' });
    setShowReviewForm(false);
    setIsSubmittingReview(false);
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : (product.rating || 0);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setError('Please select a size');
      return;
    }
    setError('');
    await onAddToCart(product, selectedSize, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="min-h-screen bg-white pt-[76px]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
        >
          <ArrowLeft size={18} />
          Back to Shop
        </button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Image gallery */}
          <div className="relative">
            <div className="sticky top-28">
              <div className="relative overflow-hidden rounded-3xl bg-gray-50">
                <img
                  src={selectedImage}
                  alt={`${product.name}${selectedImage === product.hover_image_url ? ' back view' : ' front view'}`}
                  className="aspect-[3/4] w-full object-cover"
                />
                {product.is_new && (
                  <span className="absolute left-4 top-4 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
                    NEW
                  </span>
                )}
              </div>
              {productImages.length > 1 && (
                <div className="mt-4 flex gap-3">
                  {productImages.map((image, index) => (
                    <button key={image} type="button" onClick={() => setSelectedImage(image)} aria-label={`Show image ${index + 1}`} className={`h-28 w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-gray-50 transition sm:h-32 sm:w-24 ${selectedImage === image ? 'border-emerald-500 shadow-md shadow-emerald-500/20' : 'border-transparent hover:border-gray-300'}`}>
                      <img src={image} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                {product.league}
              </span>
              <span className="text-gray-300">·</span>
              <span className="text-sm text-gray-500">{product.team}</span>
            </div>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-4 flex items-center gap-2">
              <Rating rating={averageRating} />
              {reviews.length > 0 && (
                <span className="text-sm text-gray-600">
                  {averageRating} · {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                </span>
              )}
            </div>

            <p className="mt-6 text-3xl font-bold text-gray-900">
              €{product.price.toFixed(2)}
            </p>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-2 text-sm font-semibold text-gray-900">Colors</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <span
                      key={color}
                      className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-700"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Select Size</h3>
                {error && <span className="text-xs font-medium text-red-500">{error}</span>}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes && product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      setError('');
                    }}
                    className={`min-w-12 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                      selectedSize === size
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3 rounded-full border border-gray-200 px-3 py-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="rounded-full p-1 text-gray-500 transition hover:bg-gray-100"
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="min-w-8 text-center font-semibold text-gray-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="rounded-full p-1 text-gray-500 transition hover:bg-gray-100"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex flex-1 items-center justify-center gap-2 rounded-full py-3.5 font-semibold text-white transition active:scale-[0.98] ${
                  added ? 'bg-emerald-500' : 'bg-gray-900 hover:bg-gray-700'
                }`}
              >
                {added ? (
                  <>
                    <Check size={20} /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={20} />
                    Add to Cart · €{(product.price * quantity).toFixed(2)}
                  </>
                )}
              </button>
            </div>

            {/* Trust badges */}
            <div className="mt-10 grid gap-4 border-t border-gray-100 pt-8 min-[375px]:grid-cols-3">
              {[
                { icon: Truck, label: 'Free shipping over €100' },
                { icon: ShieldCheck, label: 'Authentic & licensed' },
                { icon: RefreshCw, label: '30-day returns' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2 text-center">
                  <Icon size={22} className="text-emerald-600" />
                  <span className="text-xs text-gray-600">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <section className="mt-16 border-t border-gray-100 pt-12" aria-labelledby="reviews-heading">
          <div className="mb-8">
            <h2 id="reviews-heading" className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
              Customer Reviews
            </h2>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Rating rating={averageRating} />
                <span className="text-lg font-bold text-gray-900">{(averageRating || 0).toFixed(1)}</span>
              </div>
              <span className="text-sm text-gray-600">
                Based on {reviews.length + (product.reviews_count || 0)} reviews
              </span>
            </div>
          </div>

          {/* Add Review Button */}
          {!showReviewForm && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowReviewForm(true)}
              className="mb-8 flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              <Star size={18} />
              Write a Review
            </motion.button>
          )}

          {/* Review Form */}
          {showReviewForm && (
            <motion.form
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmitReview}
              className="mb-8 rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 p-6"
            >
              <h3 className="mb-4 text-xl font-bold text-gray-900">Write Your Review</h3>
              
              {/* Star Rating Selection */}
              <div className="mb-4">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Your Rating *
                </label>
                <div className="flex items-center gap-3">
                  <Rating 
                    rating={newReview.rating} 
                    interactive={true}
                    onRate={(rating) => setNewReview({ ...newReview, rating })}
                    size={32}
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    {newReview.rating} {newReview.rating === 1 ? 'star' : 'stars'}
                  </span>
                </div>
              </div>

              {/* Name Input */}
              <div className="mb-4">
                <label htmlFor="review-name" className="mb-2 block text-sm font-semibold text-gray-700">
                  Your Name *
                </label>
                <input
                  id="review-name"
                  type="text"
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  required
                />
              </div>

              {/* Comment Input */}
              <div className="mb-4">
                <label htmlFor="review-comment" className="mb-2 block text-sm font-semibold text-gray-700">
                  Your Review (Optional)
                </label>
                <textarea
                  id="review-comment"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Share your experience with this product..."
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <p className="mt-1 text-xs text-gray-500">Tell us about your experience</p>
              </div>

              {reviewError && (
                <p className="mb-4 text-sm font-semibold text-red-600">{reviewError}</p>
              )}

              {/* Form Buttons */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="flex-1 rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                >
                  {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewForm(false);
                    setReviewError('');
                    setNewReview({ name: '', rating: 5, comment: '' });
                  }}
                  className="rounded-full border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
                <Star size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-semibold text-gray-900">No reviews yet</p>
                <p className="mt-1 text-sm text-gray-600">Be the first to review this product!</p>
              </div>
            ) : (
              reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900">{review.name}</h4>
                      <p className="text-sm text-gray-500">{review.date}</p>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          className={`${
                            star <= review.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-gray-200 text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-700">{review.comment}</p>
                </motion.div>
              ))
            )}
          </div>
        </section>

        <section className="mt-20 border-t border-gray-100 pt-12" aria-labelledby="related-products-heading">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">Keep the rotation going</p>
              <h2 id="related-products-heading" className="mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">You may also like</h2>
            </div>
            <button type="button" onClick={onBack} className="text-sm font-bold text-emerald-700 transition hover:text-emerald-500">View all shirts →</button>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
            {relatedProducts.filter((related) => related.id !== product.id).map((related) => <ProductCard key={related.id} product={related} onSelect={onSelectProduct} />)}
          </div>
        </section>
      </div>
    </div>
  );
}
