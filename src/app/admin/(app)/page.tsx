export const dynamic = 'force-dynamic';
import ProductForm from '@/components/admin/ProductForm';

export default function AddProductPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <header className="mb-5">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300/80">New shirt</p>
        <h1 className="mt-1 text-2xl font-black">Add to the catalogue</h1>
        <p className="mt-1 text-sm font-medium text-white/45">
          Fill this in on the shop floor and it goes live straight away.
        </p>
      </header>

      <ProductForm mode="create" />
    </div>
  );
}
