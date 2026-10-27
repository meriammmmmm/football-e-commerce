export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';
import { getProductById } from '@/lib/productStore';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <header className="mb-5">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300/80">Edit shirt</p>
        <h1 className="mt-1 text-2xl font-black leading-tight">{product.name}</h1>
      </header>

      <ProductForm mode="edit" product={product} />
    </div>
  );
}
