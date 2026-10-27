import { serveProductImage } from '@/lib/productImageRoute';

/** Serves the back photo under a versioned path. */
export async function GET(request: Request, { params }: { params: Promise<{ id: string; version: string }> }) {
  const { id } = await params;
  return serveProductImage(id, 'back');
}
