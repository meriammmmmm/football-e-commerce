import { isAdminRequest } from '@/lib/adminGuard';
import { isDatabaseConfigured } from '@/lib/db';
import {
  deleteProduct,
  getProductById,
  parseImageDataUrl,
  parseProductInput,
  saveProductImage,
  updateProduct,
} from '@/lib/productStore';

/** Updates a product from the admin mobile app. */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) {
    return Response.json({ error: 'Admin access required.' }, { status: 401 });
  }

  if (!isDatabaseConfigured()) {
    return Response.json(
      { error: 'The catalogue database is not configured on this server yet.' },
      { status: 503 },
    );
  }

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const parsed = parseProductInput(body);
  if (!parsed.ok || !parsed.value) {
    return Response.json({ error: parsed.error ?? 'Check the product details.' }, { status: 400 });
  }

  try {
    const updated = await updateProduct(id, parsed.value);
    if (!updated) {
      return Response.json({ error: 'This product no longer exists.' }, { status: 404 });
    }

    const front = typeof body?.image === 'string' ? parseImageDataUrl(body.image) : null;
    if (front) await saveProductImage(id, 'front', front.data, front.mime);

    const back = typeof body?.hoverImage === 'string' ? parseImageDataUrl(body.hoverImage) : null;
    if (back) await saveProductImage(id, 'back', back.data, back.mime);

    return Response.json({ product: await getProductById(id) });
  } catch (error) {
    console.error('Product update failed:', error);
    return Response.json(
      { error: 'Could not update this product. The database may be unavailable.' },
      { status: 503 },
    );
  }
}

/** Removes a product from the catalogue. */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) {
    return Response.json({ error: 'Admin access required.' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const removed = await deleteProduct(id);
    if (!removed) {
      return Response.json({ error: 'This product no longer exists.' }, { status: 404 });
    }
    return Response.json({ ok: true });
  } catch (error) {
    console.error('Product delete failed:', error);
    return Response.json(
      { error: 'Could not delete this product. The database may be unavailable.' },
      { status: 503 },
    );
  }
}
