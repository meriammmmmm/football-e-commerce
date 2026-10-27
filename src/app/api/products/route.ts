import { isAdminRequest } from '@/lib/adminGuard';
import { isDatabaseConfigured } from '@/lib/db';
import {
  createProduct,
  getProductById,
  listProducts,
  parseImageDataUrl,
  parseProductInput,
  saveProductImage,
} from '@/lib/productStore';

export async function GET() {
  const products = await listProducts();
  return Response.json(products, { headers: { 'Cache-Control': 'no-store' } });
}

/** Creates a product from the admin mobile app. */
export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return Response.json({ error: 'Admin access required.' }, { status: 401 });
  }

  if (!isDatabaseConfigured()) {
    return Response.json(
      { error: 'The catalogue database is not configured on this server yet.' },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const parsed = parseProductInput(body);
  if (!parsed.ok || !parsed.value) {
    return Response.json({ error: parsed.error ?? 'Check the product details.' }, { status: 400 });
  }

  try {
    const product = await createProduct(parsed.value);

    const front = typeof body?.image === 'string' ? parseImageDataUrl(body.image) : null;
    if (front) await saveProductImage(product.id, 'front', front.data, front.mime);

    const back = typeof body?.hoverImage === 'string' ? parseImageDataUrl(body.hoverImage) : null;
    if (back) await saveProductImage(product.id, 'back', back.data, back.mime);

    return Response.json({ product: (await getProductById(product.id)) ?? product }, { status: 201 });
  } catch (error) {
    console.error('Product creation failed:', error);
    return Response.json(
      { error: 'Could not save this product. The database may be unavailable.' },
      { status: 503 },
    );
  }
}
