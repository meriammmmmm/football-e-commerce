import { createHash } from 'crypto';
import type { CartItem, Product } from '@/types';

export interface DemoUser { id: string; fullName: string; phone: string; address: string; email: string; createdAt: string; }
export interface DemoRegistration { fullName: string; phone: string; address: string; email: string; password: string; }
export interface DemoOrder { id: string; email: string; items: CartItem[]; total: number; createdAt: string; status: 'received'; }
export interface DemoReview { id: string; name: string; rating: number; copy: string; createdAt: string; }

export const demoProducts: Product[] = [
  { id: 'inter-ronaldo-2001', name: 'Inter Milan #10 Ronaldo', league: 'SERIE A', team: 'Inter Milan', price: 119.99, rating: 4.9, reviews_count: 289, image_url: '/inter-ronaldo-front.webp', hover_image_url: '/inter-ronaldo-back.webp', sizes: ['S', 'M', 'L', 'XL'], colors: ['White', 'Navy'] },
  { id: 'boca-maradona', name: 'Boca Juniors #10 Maradona', league: 'ARGENTINA', team: 'Boca Juniors', price: 129.99, rating: 5, reviews_count: 312, image_url: '/800084945_28296201710045314_5696377547558753768_n.jpg', sizes: ['S', 'M', 'L', 'XL'], colors: ['Blue', 'Yellow'] },
];

type StoredDemoUser = DemoUser & { passwordHash: string };
const users = new Map<string, StoredDemoUser>();
const orders: DemoOrder[] = [];
const submittedReviews: DemoReview[] = [];

const publicUser = (user: StoredDemoUser): DemoUser => ({
  id: user.id, fullName: user.fullName, phone: user.phone, address: user.address, email: user.email, createdAt: user.createdAt,
});
const hashPassword = (password: string) => createHash('sha256').update(password).digest('hex');

export function registerDemoUser(input: DemoRegistration): DemoUser {
  const email = input.email.trim().toLowerCase();
  if (users.has(email)) throw new Error('An account already exists for this email. Sign in instead.');
  const user: StoredDemoUser = {
    id: `usr_${crypto.randomUUID().slice(0, 8)}`,
    fullName: input.fullName.trim(), phone: input.phone.trim(), address: input.address.trim(), email,
    passwordHash: hashPassword(input.password), createdAt: new Date().toISOString(),
  };
  users.set(email, user);
  return publicUser(user);
}

export function authenticateDemoUser(email: string, password: string): DemoUser | null {
  const user = users.get(email.trim().toLowerCase());
  if (!user || user.passwordHash !== hashPassword(password)) return null;
  return publicUser(user);
}

export function createDemoOrder(email: string, items: CartItem[]): DemoOrder {
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) + 14.95;
  const order = { id: `HB-${Math.random().toString(36).slice(2, 8).toUpperCase()}`, email, items, total, createdAt: new Date().toISOString(), status: 'received' as const };
  orders.unshift(order);
  return order;
}

export function getDemoOrders(email: string) { return orders.filter((order) => order.email === email); }

export function createDemoReview(name: string, rating: number, copy: string): DemoReview {
  const review = { id: `review_${crypto.randomUUID().slice(0, 8)}`, name: name.trim(), rating, copy: copy.trim(), createdAt: new Date().toISOString() };
  submittedReviews.unshift(review);
  return review;
}
