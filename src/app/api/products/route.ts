import catalog from '@/lib/kickoffCatalog.json';

export async function GET() { return Response.json({ products: catalog }); }
