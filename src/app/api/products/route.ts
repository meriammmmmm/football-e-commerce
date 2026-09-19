import products from '@/lib/headbuttProducts.json';

export async function GET() {
  return Response.json(products);
}
