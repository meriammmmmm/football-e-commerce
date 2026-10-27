'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Mail, MapPin, Package, Phone, ShoppingBag } from 'lucide-react';
import type { CustomerSummary } from '@/app/api/admin/customers/route';

interface Order {
  id: string;
  items: { name: string; qty?: number; quantity?: number; price: number }[];
  total: number;
  status: string;
  createdAt: string;
}

function fmt(n: number) {
  return `£${n.toFixed(2)}`;
}

function dateStr(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function StatusBadge({ status }: { status: string }) {
  const colours: Record<string, string> = {
    received: 'bg-blue-500/15 text-blue-300 border-blue-400/30',
    processing: 'bg-yellow-500/15 text-yellow-300 border-yellow-400/30',
    shipped: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
    delivered: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40',
    cancelled: 'bg-red-500/15 text-red-300 border-red-400/30',
  };
  const cls = colours[status] ?? 'bg-white/10 text-white/50 border-white/20';
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${cls}`}>
      {status}
    </span>
  );
}

function CustomerRow({ customer }: { customer: CustomerSummary }) {
  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (!open && orders === null) {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/customers/${customer.id}`);
        const data = (await res.json()) as { orders?: Order[] };
        setOrders(data.orders ?? []);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    setOpen((v) => !v);
  };

  return (
    <li className="rounded-2xl border border-white/10 bg-[#101f36] overflow-hidden">
      {/* Header row */}
      <button
        type="button"
        onClick={toggle}
        className="flex w-full items-start gap-3 p-4 text-left transition active:bg-white/5"
      >
        {/* Avatar initial */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-base font-black text-emerald-300">
          {customer.fullName.charAt(0).toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-black text-white">{customer.fullName}</p>
          <p className="truncate text-xs font-semibold text-white/45">{customer.email}</p>
          <div className="mt-2 flex flex-wrap gap-3">
            <span className="flex items-center gap-1 text-[11px] font-semibold text-white/50">
              <ShoppingBag size={11} />
              {customer.orderCount} order{customer.orderCount !== 1 ? 's' : ''}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-300/80">
              <Package size={11} />
              {fmt(customer.totalSpent)}
            </span>
            {customer.lastOrderAt && (
              <span className="text-[11px] font-medium text-white/35">
                Last: {dateStr(customer.lastOrderAt)}
              </span>
            )}
          </div>
        </div>

        <span className="mt-1 shrink-0 text-white/30">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      {/* Expanded detail */}
      {open && (
        <div className="border-t border-white/10 px-4 pb-4 pt-3 space-y-4">
          {/* Contact info */}
          <div className="space-y-1.5">
            <a href={`mailto:${customer.email}`} className="flex items-center gap-2 text-xs font-semibold text-white/60 hover:text-white/90">
              <Mail size={12} className="shrink-0 text-emerald-300/60" />
              {customer.email}
            </a>
            {customer.phone && (
              <a href={`tel:${customer.phone}`} className="flex items-center gap-2 text-xs font-semibold text-white/60 hover:text-white/90">
                <Phone size={12} className="shrink-0 text-emerald-300/60" />
                {customer.phone}
              </a>
            )}
            {customer.address && (
              <p className="flex items-start gap-2 text-xs font-semibold text-white/60">
                <MapPin size={12} className="mt-0.5 shrink-0 text-emerald-300/60" />
                {customer.address}
              </p>
            )}
            <p className="text-[11px] text-white/30">Joined {dateStr(customer.createdAt)}</p>
          </div>

          {/* Orders */}
          <div>
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.14em] text-emerald-300/70">Orders</p>
            {loading && (
              <p className="text-xs text-white/40 animate-pulse">Loading…</p>
            )}
            {!loading && orders && orders.length === 0 && (
              <p className="text-xs text-white/40">No orders found.</p>
            )}
            {!loading && orders && orders.length > 0 && (
              <ul className="space-y-2">
                {orders.map((order) => (
                  <li key={order.id} className="rounded-xl border border-white/10 bg-[#162a45] p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-black text-white">{order.id}</span>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="mt-1 text-[11px] text-white/40">{dateStr(order.createdAt)}</p>
                    <ul className="mt-2 space-y-0.5">
                      {order.items.map((item, i) => (
                        <li key={i} className="flex justify-between text-[11px] text-white/55">
                          <span className="truncate">{item.name}{(item.qty ?? item.quantity ?? 1) > 1 ? ` ×${item.qty ?? item.quantity}` : ''}</span>
                          <span className="ml-2 shrink-0 font-semibold">{fmt(item.price)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-2 border-t border-white/10 pt-2 text-right text-xs font-black text-white">
                      Total: {fmt(order.total)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </li>
  );
}

export default function CustomersPanel({
  initialCustomers,
}: {
  initialCustomers: CustomerSummary[];
}) {
  const [search, setSearch] = useState('');

  const filtered = initialCustomers.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.fullName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-3">
      {/* Search */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, email or phone…"
        className="min-h-12 w-full rounded-xl border border-white/12 bg-[#162a45] px-4 text-sm font-semibold text-white placeholder:text-white/30 outline-none transition focus:border-emerald-400/70 focus:ring-2 focus:ring-emerald-400/25"
      />

      {initialCustomers.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-[#101f36] p-5 text-sm font-semibold text-white/50">
          No customers with orders yet.
        </p>
      ) : filtered.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-[#101f36] p-5 text-sm font-semibold text-white/50">
          No results for &quot;{search}&quot;.
        </p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((c) => (
            <CustomerRow key={c.id} customer={c} />
          ))}
        </ul>
      )}
    </div>
  );
}
