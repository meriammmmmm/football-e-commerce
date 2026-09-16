'use client';

import Image from 'next/image';
import { ChevronDown, CheckCircle2, CreditCard, HelpCircle, LockKeyhole, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import type { CartItem } from '@/types';

interface CheckoutPageProps { items: CartItem[]; onBack: () => void; onOrderPlaced: () => void; }

const inputStyle = 'h-13 w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white/[0.1]';

export function CheckoutPage({ items, onBack, onOrderPlaced }: CheckoutPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  
  // Check if user is signed in on mount
  useState(() => {
    const storedEmail = window.localStorage.getItem('headbutt-demo-user') || '';
    setEmail(storedEmail);
  });
  
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal ? 14.95 : 0;
  const total = subtotal + shipping;

  const submitOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userEmail = email || window.localStorage.getItem('headbutt-demo-user') || '';

    if (!userEmail) {
      setError('Sign in from the account icon before placing your demo order.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, items }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not place the order.');
      setOrderId(data.order.id);
      onOrderPlaced();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not place the order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderId) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#081120] px-5 text-center text-white">
        <div className="max-w-lg rounded-3xl border border-emerald-300/30 bg-[#0c1728] p-10 shadow-2xl">
          <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-300" />
          <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Demo order received</p>
          <h1 className="mt-2 text-4xl font-black tracking-[-0.05em]">Thank you.</h1>
          <p className="mt-4 text-slate-300">Your order <strong className="text-white">{orderId}</strong> has been saved to the local demo backend. No payment was taken.</p>
          <button onClick={onBack} className="mt-8 rounded-xl bg-emerald-400 px-6 py-3 font-black text-[#081120] transition hover:bg-emerald-300">Continue shopping</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#081120] text-white">
      <header className="border-b border-white/10 bg-[#0c1728]"><div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-8"><button onClick={onBack} className="text-sm font-bold text-slate-300 transition hover:text-emerald-300">← Return to cart</button><div className="relative h-12 w-12 overflow-hidden rounded-full border border-emerald-300/40"><Image src="/headbutt-logo.jpg" alt="Headbutt logo" fill sizes="48px" className="object-cover" /></div><span className="flex w-24 justify-end text-sm font-bold text-emerald-300"><LockKeyhole size={15} className="mr-2" /> Secure</span></div></header>
      <div className="mx-auto grid max-w-6xl lg:grid-cols-[1fr_390px]">
        <form className="border-white/10 px-5 py-10 sm:px-10 lg:border-r" onSubmit={submitOrder}>
          <div className="mx-auto max-w-xl"><p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Headbutt Barcelona</p><h1 className="mt-2 text-4xl font-black tracking-[-0.05em]">Checkout</h1>
            <div className="mt-8"><p className="mb-3 text-sm font-bold text-slate-300">Express checkout</p><div className="grid grid-cols-2 gap-3"><button type="button" className="flex items-center justify-center gap-2 rounded-xl bg-[#ffc439] py-3 font-black text-[#003087]"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 0 0-.794.68l-.04.22-.63 3.993-.028.15a.806.806 0 0 1-.795.68H8.032c-.338 0-.595-.295-.545-.628l.812-5.155.976-6.193.213-1.353a.806.806 0 0 1 .794-.679h2.176c3.676 0 6.174 1.531 6.61 5.836z"/><path d="M10.845 8.552a.806.806 0 0 0-.794.679l-.976 6.193-.812 5.155c-.05.333.207.628.545.628h3.034a.806.806 0 0 0 .795-.68l.028-.15.63-3.993.04-.22a.805.805 0 0 1 .794-.68h.5c3.238 0 5.774-1.314 6.514-5.12.256-1.313.192-2.446-.3-3.327-1.556-2.788-5.176-2.788-8.482-2.788h-1.516z" opacity=".7"/><path d="M9.054 8.273a.688.688 0 0 1 .68-.588h3.485c1.028 0 1.983.062 2.834.205.246.04.483.088.71.143.227.056.445.118.653.189.104.036.206.073.305.112a5.77 5.77 0 0 1 1.372.694c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 0 0-.794.68l-.04.22-.63 3.993-.028.15a.806.806 0 0 1-.795.68H6.058c-.338 0-.595-.295-.545-.628l1.54-9.773z" opacity=".5"/></svg> PayPal</button><button type="button" className="flex items-center justify-center gap-2 rounded-xl bg-white py-3 font-black text-slate-950"><svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg> G Pay</button></div></div>
            <div className="my-8 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-500 before:h-px before:flex-1 before:bg-white/10 after:h-px after:flex-1 after:bg-white/10">or</div>
            <section><div className="flex items-center justify-between"><h2 className="text-xl font-black">Contact</h2>{!email && <button type="button" className="text-sm font-bold text-emerald-300">Sign in</button>}</div><div className="relative mt-4"><input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputStyle} /><HelpCircle size={17} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" /></div><label className="mt-3 flex items-center gap-3 text-sm font-semibold text-slate-300"><input type="checkbox" defaultChecked className="h-4 w-4 accent-emerald-500" /> Email me with news and offers</label></section>
            <section className="mt-9"><h2 className="text-xl font-black">Delivery</h2><div className="relative mt-4"><select defaultValue="Tunisia" className={`${inputStyle} appearance-none`}><option>Tunisia</option><option>France</option><option>Spain</option><option>Italy</option></select><ChevronDown size={17} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" /></div><div className="mt-3 grid gap-3 sm:grid-cols-2"><input required placeholder="First name" className={inputStyle} /><input required placeholder="Last name" className={inputStyle} /></div><input required placeholder="Address" className={`${inputStyle} mt-3`} /><input placeholder="Apartment, suite, etc. (optional)" className={`${inputStyle} mt-3`} /><div className="mt-3 grid gap-3 sm:grid-cols-2"><input placeholder="Postal code" className={inputStyle} /><input required placeholder="City" className={inputStyle} /></div><input type="tel" placeholder="Phone" className={`${inputStyle} mt-3`} /></section>
            <section className="mt-9"><h2 className="text-xl font-black">Shipping method</h2><label className="mt-4 flex cursor-pointer items-center justify-between rounded-xl border border-emerald-400 bg-emerald-400/10 px-4 py-4 font-bold"><span>Standard · 3–6 business days</span><span>€{shipping.toFixed(2)}</span></label></section>
            <section className="mt-9"><h2 className="text-xl font-black">Payment</h2><p className="mt-1 text-sm text-slate-400">All transactions are secure and encrypted.</p><div className="mt-4 overflow-hidden rounded-xl border border-emerald-400"><label className="flex items-center gap-3 bg-emerald-400/10 px-4 py-4 font-bold"><input type="radio" name="payment" defaultChecked className="accent-emerald-400" /> Credit card <span className="ml-auto flex items-center gap-2 text-xs text-slate-300"><CreditCard size={17} /> VISA · MC</span></label><div className="space-y-3 border-t border-white/10 bg-white/[0.04] p-4"><input placeholder="Card number" inputMode="numeric" className={inputStyle} /><div className="grid grid-cols-2 gap-3"><input placeholder="MM / YY" className={inputStyle} /><input placeholder="Security code" inputMode="numeric" className={inputStyle} /></div><input placeholder="Name on card" className={inputStyle} /></div><label className="flex items-center justify-between border-t border-white/10 px-4 py-4 font-bold"><span><input type="radio" name="payment" className="mr-3 accent-emerald-400" /> PayPal</span><span className="text-[#55b0e8]">PayPal</span></label></div></section>
            {error && <p role="alert" className="mt-5 rounded-xl border border-rose-400/40 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-100">{error}</p>}
            <button disabled={isSubmitting || !items.length} type="submit" className="mt-9 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 py-4 text-lg font-black text-[#081120] transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"><LockKeyhole size={18} /> {isSubmitting ? 'Saving order…' : `Place demo order · €${total.toFixed(2)}`}</button>
          </div>
        </form>
        <aside className="bg-[#0c1728] px-5 py-10 sm:px-8"><div className="lg:sticky lg:top-8"><h2 className="text-xl font-black">Order summary</h2><div className="mt-6 space-y-5">{items.map((item) => <div key={`${item.product.id}-${item.size}`} className="flex gap-3"><div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-white"><img src={item.product.image_url} alt={item.product.name} className="h-full w-full object-cover" /><span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-emerald-400 px-1 text-[10px] font-black text-[#081120]">{item.quantity}</span></div><div className="min-w-0 flex-1"><p className="text-sm font-black uppercase leading-tight">{item.product.name}</p><p className="mt-1 text-xs font-semibold text-slate-400">{item.product.team} / {item.size}</p></div><span className="whitespace-nowrap text-sm font-black">€{(item.product.price * item.quantity).toFixed(2)}</span></div>)}</div><div className="mt-7 flex gap-2 border-t border-white/10 pt-6"><input placeholder="Discount code or gift card" className="h-11 min-w-0 flex-1 rounded-lg border border-white/10 bg-white/[0.07] px-3 text-sm outline-none placeholder:text-slate-500 focus:border-emerald-400" /><button type="button" className="rounded-lg bg-white/10 px-4 text-sm font-bold hover:bg-white/15">Apply</button></div><dl className="mt-6 space-y-3 border-b border-white/10 pb-6 text-sm"><div className="flex justify-between"><dt className="text-slate-400">Subtotal</dt><dd className="font-bold">€{subtotal.toFixed(2)}</dd></div><div className="flex justify-between"><dt className="text-slate-400">Shipping</dt><dd className="font-bold">€{shipping.toFixed(2)}</dd></div></dl><div className="mt-6 flex items-end justify-between"><span className="text-lg font-black">Total</span><span className="text-2xl font-black"><small className="mr-1 text-xs text-slate-400">EUR</small>€{total.toFixed(2)}</span></div><p className="mt-5 flex items-center gap-2 text-xs text-slate-400"><ShoppingBag size={15} className="text-emerald-300" /> Authentic shirts, shipped from Barcelona.</p></div></aside>
      </div>
    </main>
  );
}
