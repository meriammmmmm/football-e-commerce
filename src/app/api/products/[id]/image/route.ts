import { serveProductImage, storeProductImage } from '@/lib/productImageRoute';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return serveProductImage(id, 'front');
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return storeProductImage(id, 'front', request);
}
