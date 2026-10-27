import { serveProductImage } from '@/lib/productImageRoute';

/**
 * Serves the front photo under a versioned path. The version busts browser and
 * image-optimizer caches whenever the photo is replaced.
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string; version: string }> }) {
  const { id } = await params;
  return serveProductImage(id, 'front');
}
