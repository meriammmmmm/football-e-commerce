export interface Product {
  id: string;
  name: string;
  league?: string;
  team: string;
  player?: string;
  number?: string;
  price: number;
  sleeveType?: 'short' | 'long';
  category?: string;
  rating: number;
  reviews_count: number;
  image_url: string;
  hover_image_url?: string;
  description?: string;
  is_new?: boolean;
  is_featured?: boolean;
  sizes?: string[];
  colors?: string[];
  available?: boolean;
  inStock?: boolean;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}
