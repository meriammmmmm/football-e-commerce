import { serveProductImage, storeProductImage } from '@/lib/productImageRoute';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return serveProductImage(id, 'back');
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return storeProductImage(id, 'back', request);
}
