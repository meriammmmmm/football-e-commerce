export const dynamic = 'force-dynamic';
import ProductList from '@/components/admin/ProductList';
import { listProducts } from '@/lib/productStore';

export default async function CataloguePage() {
  const products = await listProducts();

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <header className="mb-5">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300/80">Catalogue</p>
        <h1 className="mt-1 text-2xl font-black">{products.length} shirts live</h1>
      </header>

      <ProductList initialProducts={products} />
    </div>
  );
}
