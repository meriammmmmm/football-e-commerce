import { demoProducts } from '@/lib/demoStore';

export async function GET() { return Response.json({ products: demoProducts }); }
