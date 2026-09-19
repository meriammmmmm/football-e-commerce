import products from '@/lib/headbuttProducts.json';

export async function GET() {
  const optimizedProducts = products.map((product) => ({
    ...product,
    image_url: `/products${product.image_url}`,
    hover_image_url: product.hover_image_url ? `/products${product.hover_image_url}` : undefined,
  }));

  return Response.json(optimizedProducts);
}
