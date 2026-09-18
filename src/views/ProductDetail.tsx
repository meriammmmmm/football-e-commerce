import { useState } from 'react';
import { ArrowLeft, ShoppingBag, Check, Truck, ShieldCheck, RefreshCw, Minus, Plus } from 'lucide-react';
import type { Product } from '@/types';
import { Rating } from '@/components/Rating';
import { ProductCard } from '@/components/ProductCard';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, size: string, quantity: number) => void;
  onSelectProduct: (product: Product) => void;
}

const relatedProducts: Product[] = [
  { id: 'related-1', name: 'Boca Juniors #10 Maradona', league: 'ARGENTINA', team: 'Boca Juniors', price: 129.99, rating: 5, reviews_count: 312, image_url: '/800084945_28296201710045314_5696377547558753768_n.jpg', sizes: ['S', 'M', 'L', 'XL'], colors: ['Blue', 'Yellow'] },
  { id: 'related-2', name: 'Man United #10 Van Nistelrooy', league: 'PREMIER LEAGUE', team: 'Manchester United', price: 94.99, rating: 4.8, reviews_count: 203, image_url: '/800594036_1428287385865418_5380508176128630865_n.jpg', sizes: ['S', 'M', 'L', 'XL'], colors: ['Red', 'Black'] },
  { id: 'related-3', name: 'Netherlands #8 Bergkamp', league: 'NATIONAL TEAM', team: 'Netherlands', price: 109.99, rating: 4.9, reviews_count: 124, image_url: '/805876259_1769531613923629_3124609060888587814_n.jpg', sizes: ['S', 'M', 'L', 'XL'], colors: ['Orange', 'Black'] },
];

export function ProductDetail({ product, onBack, onAddToCart, onSelectProduct }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');
  const [customize, setCustomize] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [playerNumber, setPlayerNumber] = useState('');
  const productImages = [product.image_url, product.hover_image_url].filter((image): image is string => Boolean(image));
  const [selectedImage, setSelectedImage] = useState(product.image_url);

  const customizationPrice = 15; // €15 for customization

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setError('Please select a size');
      return;
    }
    if (customize && (!playerName.trim() || !playerNumber.trim())) {
      setError('Please enter both name and number for customization');
      return;
    }
    setError('');
    await onAddToCart(product, selectedSize, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const totalPrice = product.price + (customize ? customizationPrice : 0);

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
              <Rating rating={product.rating} />
              <span className="text-sm text-gray-600">
                ({product.reviews_count} reviews)
              </span>
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

            {/* Customization Option */}
            <div className="mt-6 rounded-2xl border-2 border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Customize Your Shirt</h3>
                  <p className="mt-1 text-xs text-gray-500">Add name & number (+€{customizationPrice})</p>
                </div>
                <button
                  onClick={() => setCustomize(!customize)}
                  className={`relative h-8 w-14 rounded-full transition ${
                    customize ? 'bg-emerald-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-sm transition ${
                      customize ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {customize && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="player-name" className="mb-2 block text-xs font-semibold text-gray-700">
                      Player Name *
                    </label>
                    <input
                      id="player-name"
                      type="text"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value.toUpperCase())}
                      placeholder="RONALDO"
                      maxLength={12}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold uppercase text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="player-number" className="mb-2 block text-xs font-semibold text-gray-700">
                      Number *
                    </label>
                    <input
                      id="player-number"
                      type="text"
                      value={playerNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (val.length <= 2) setPlayerNumber(val);
                      }}
                      placeholder="10"
                      maxLength={2}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}
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
                    Add to Cart · €{(totalPrice * quantity).toFixed(2)}
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

        <section className="mt-20 border-t border-gray-100 pt-12" aria-labelledby="related-products-heading">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">Keep the rotation going</p>
              <h2 id="related-products-heading" className="mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">You may also like</h2>
            </div>
            <button type="button" onClick={onBack} className="hidden text-sm font-bold text-emerald-700 transition hover:text-emerald-500 sm:block">View all shirts →</button>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
            {relatedProducts.filter((related) => related.id !== product.id).map((related) => <ProductCard key={related.id} product={related} onSelect={onSelectProduct} />)}
          </div>
        </section>
      </div>
    </div>
  );
}
