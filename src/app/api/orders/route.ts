import { createOrder, getOrdersByEmail } from '@/lib/db';
import type { CartItem } from '@/types';

export async function GET(request: Request) {
  const email = new URL(request.url).searchParams.get('email');
  if (!email) return Response.json({ error: 'Email is required.' }, { status: 400 });
  
  try {
    const orders = await getOrdersByEmail(email);
    return Response.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return Response.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { email?: unknown; items?: unknown } | null;
  if (!body || typeof body.email !== 'string' || !Array.isArray(body.items) || body.items.length === 0) return Response.json({ error: 'Email and cart items are required.' }, { status: 400 });
  
  try {
    const items = body.items as CartItem[];
    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) + 14.95;
    const order = await createOrder(body.email, items, total);
    
    return Response.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return Response.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
