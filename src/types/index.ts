export interface Product {
  id: string;
  name: string;
  league: string;
  team: string;
  price: number;
  rating: number;
  reviews_count: number;
  image_url: string;
  hover_image_url?: string;
  is_new?: boolean;
  is_featured?: boolean;
  sizes?: string[];
  colors?: string[];
  available?: boolean;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}
