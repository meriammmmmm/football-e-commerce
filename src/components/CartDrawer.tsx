'use client';

import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import type { CartItem } from '@/types';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemove: (index: number) => void;
  onCheckout: () => void;
}

export default function CartDrawer({ isOpen, items, onClose, onUpdateQuantity, onRemove, onCheckout }: CartDrawerProps) {
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className={`fixed inset-0 z-[70] transition ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!isOpen}>
      <button type="button" onClick={onClose} aria-label="Close cart overlay" className={`absolute inset-0 bg-[#020611]/65 backdrop-blur-sm transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} />
      <aside className={`absolute right-0 top-0 flex h-full w-full max-w-[560px] flex-col bg-[#f4f0e7] text-[#11192d] shadow-2xl transition-transform duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`} aria-label="Shopping cart">
        <div className="flex items-center justify-between border-b border-[#11192d]/10 px-6 py-7 sm:px-8">
          <div className="flex items-center gap-3"><h2 className="text-4xl font-black tracking-[-0.05em]">Cart</h2><span className="grid h-10 min-w-10 place-items-center rounded-full bg-[#11192d]/10 px-2 text-lg font-bold">{itemCount}</span></div>
          <button type="button" onClick={onClose} aria-label="Close cart" className="grid h-12 w-12 place-items-center rounded-full border border-[#11192d]/10 text-[#11192d] transition hover:bg-emerald-400"><X size={27} /></button>
        </div>
        {items.length ? (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-7 sm:px-8">
              {items.map((item, index) => (
                <article key={`${item.product.id}-${item.size}`} className="flex gap-4 border-b border-[#11192d]/10 pb-6">
                  <img src={item.product.hover_image_url ?? item.product.image_url} alt={item.product.name} className="h-28 w-24 shrink-0 object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex gap-3"><div className="min-w-0 flex-1"><h3 className="text-lg font-black uppercase leading-tight sm:text-xl">{item.product.name}</h3><p className="mt-1 text-sm font-bold uppercase">{item.product.team} · {item.size}</p></div><span className="whitespace-nowrap text-lg font-black">€{(item.product.price * item.quantity).toFixed(2)}</span></div>
                    <div className="mt-5 flex items-center gap-5"><div className="flex items-center rounded-lg border border-[#11192d]/15 bg-white"><button type="button" onClick={() => onUpdateQuantity(index, item.quantity - 1)} disabled={item.quantity === 1} className="grid h-10 w-10 place-items-center text-[#11192d]/60 disabled:opacity-30"><Minus size={18} /></button><span className="grid h-10 min-w-10 place-items-center font-bold">{item.quantity}</span><button type="button" onClick={() => onUpdateQuantity(index, item.quantity + 1)} className="grid h-10 w-10 place-items-center"><Plus size={18} /></button></div><button type="button" onClick={() => onRemove(index)} aria-label={`Remove ${item.product.name}`} className="text-[#11192d] transition hover:text-emerald-700"><Trash2 size={21} /></button></div>
                  </div>
                </article>
              ))}
            </div>
            <div className="border-t border-[#11192d]/15 px-6 py-6 sm:px-8"><button type="button" className="flex w-full items-center justify-between border-b border-[#11192d]/15 py-4 text-left text-lg font-black"><span>Discount</span><Plus size={22} /></button><div className="flex items-center justify-between pt-6 text-xl font-black"><span>Estimated total</span><span>€{total.toFixed(2)}</span></div><p className="mt-4 text-sm font-semibold text-[#11192d]/70">Duties and taxes included. Shipping is calculated at checkout.</p><button type="button" onClick={onCheckout} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#11192d] py-5 text-xl font-black text-white transition hover:bg-emerald-600"><ShoppingBag size={20} /> Check out</button></div>
          </>
        ) : <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center"><span className="grid h-16 w-16 place-items-center rounded-full bg-emerald-400/20 text-emerald-700"><ShoppingBag size={28} /></span><h3 className="text-2xl font-black">Your cart is empty</h3><button type="button" onClick={onClose} className="rounded-full bg-[#11192d] px-6 py-3 font-bold text-white">Keep shopping</button></div>}
      </aside>
    </div>
  );
}
