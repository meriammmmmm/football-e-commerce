import { isAdminRequest } from '@/lib/adminGuard';
import {
  getProductById,
  parseImageDataUrl,
  readProductImage,
  saveProductImage,
  type ImageSlot,
} from '@/lib/productStore';

/** Serves a stored product photo. Public, because the storefront shows it. */
export async function serveProductImage(productId: string, slot: ImageSlot) {
  const image = await readProductImage(productId, slot);
  if (!image) {
    return new Response('Image not found', { status: 404 });
  }

  return new Response(new Uint8Array(image.data), {
    headers: {
      'Content-Type': image.mime,
      'Content-Length': String(image.data.length),
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}

/** Stores a photo sent from the admin mobile app. */
export async function storeProductImage(productId: string, slot: ImageSlot, request: Request) {
  if (!(await isAdminRequest())) {
    return Response.json({ error: 'Admin access required.' }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { image?: unknown } | null;
  const parsed = typeof body?.image === 'string' ? parseImageDataUrl(body.image) : null;
  if (!parsed) {
    return Response.json({ error: 'Send the photo as a base64 data URL.' }, { status: 400 });
  }

  const product = await getProductById(productId);
  if (!product) {
    return Response.json({ error: 'This product no longer exists.' }, { status: 404 });
  }

  try {
    const image_url = await saveProductImage(productId, slot, parsed.data, parsed.mime);
    return Response.json({ image_url });
  } catch (error) {
    console.error('Product image upload failed:', error);
    return Response.json(
      { error: 'Could not store this photo. The database may be unavailable.' },
      { status: 503 },
    );
  }
}
