'use client';
import { useEffect, useState } from 'react';
import type { Order } from '@/lib/types';
import { usd, formatDate, cn } from '@/lib/utils';
import { Package, Truck, CheckCircle2, Clock, MapPin, Phone, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/auth';

const STATUS_META: Record<Order['status'], { label: string; color: string; icon: any }> = {
  pending: { label: 'Pending', color: 'bg-stone-400 text-white', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-sultan-emerald-700 text-white', icon: CheckCircle2 },
  packing: { label: 'Packing', color: 'bg-sultan-gold-500 text-sultan-ink', icon: Package },
  'out-for-delivery': { label: 'Out for delivery', color: 'bg-sultan-emerald-900 text-sultan-cream', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-sultan-emerald-500 text-white', icon: CheckCircle2 },
  canceled: { label: 'Canceled', color: 'bg-sultan-spice text-white', icon: Clock },
};

export default function AccountPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/orders?userId=${user.id}`)
      .then((r) => r.json())
      .then((d) => setOrders(d.orders))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <ProtectedRoute allowed={['user', 'admin']}>
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="chip chip-emerald mb-3">Your account</div>
      <h1 className="heading-display text-4xl md:text-5xl text-sultan-emerald-900">
        Ahlan, {user?.name ?? 'friend'} 👋
      </h1>
      <p className="text-sultan-ink/70 mt-2">Here's what's on the way and what we've saved for you.</p>

      <div className="grid md:grid-cols-3 gap-4 mt-8">
        <Stat label="Lifetime orders" value={orders.length.toString()} emoji="🧺" />
        <Stat label="Next delivery" value={orders.find((o) => o.status !== 'delivered')?.deliveryWindow ?? '—'} emoji="🚚" />
        <Stat label="Favorite aisle" value="Middle Eastern" emoji="🫒" />
      </div>

      <div className="mt-10">
        <h2 className="heading-display text-2xl text-sultan-emerald-900 mb-4">Orders</h2>
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-28 bg-white rounded-2xl animate-pulse ring-1 ring-sultan-sand/40" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl ring-1 ring-sultan-sand/60">
            <div className="text-6xl mb-2">🧾</div>
            <div className="font-semibold">No orders yet</div>
            <Link href="/shop" className="btn btn-primary mt-4 inline-flex">Start shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => {
              const meta = STATUS_META[o.status];
              const Icon = meta.icon;
              return (
                <article key={o.id} className="bg-white rounded-3xl ring-1 ring-sultan-sand/60 overflow-hidden">
                  <div className="p-5 flex items-center gap-4">
                    <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center', meta.color)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">Order {o.id}</span>
                        <span className={cn('chip', meta.color)}>{meta.label}</span>
                        {o.deliveryType === 'same-day' && (
                          <span className="chip !bg-sultan-gold-500 !text-sultan-ink">⚡ Same-day</span>
                        )}
                      </div>
                      <div className="text-sm text-sultan-ink/60 mt-1">
                        Placed {formatDate(o.createdAt)} · {o.items.length} items · {o.deliveryWindow}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-sultan-emerald-800">{usd(o.total)}</div>
                    </div>
                  </div>
                  <div className="border-t border-sultan-sand/60 p-4 bg-sultan-parchment/40 flex flex-wrap items-center gap-2">
                    {o.items.slice(0, 6).map((it, i) => (
                      <div key={i} className="flex items-center gap-1.5 bg-white rounded-full pl-1 pr-3 py-1 text-xs ring-1 ring-sultan-sand">
                        <span className="text-lg">{it.emoji}</span>
                        <span className="text-sultan-ink/80">{it.qty}× {it.name}</span>
                      </div>
                    ))}
                    {o.items.length > 6 && (
                      <span className="text-xs text-sultan-ink/60">+{o.items.length - 6} more</span>
                    )}
                  </div>
                  <div className="border-t border-sultan-sand/60 p-4 flex flex-wrap items-center gap-4 text-xs text-sultan-ink/60">
                    <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> {o.address}</span>
                    <span className="inline-flex items-center gap-1"><Phone className="w-3 h-3" /> {o.phone}</span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <section className="mt-12 rounded-3xl bg-gradient-to-br from-sultan-emerald-900 to-sultan-emerald-950 text-sultan-cream p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-arabesque opacity-20" />
        <div className="relative flex items-start gap-4">
          <MessageCircle className="w-7 h-7 shrink-0 text-sultan-gold-300" />
          <div>
            <div className="font-semibold text-lg">Need a hand?</div>
            <p className="text-sultan-cream/70 mt-1 text-sm max-w-lg">
              Chat with Sultan's assistant — in English or Arabic. Ask about recipes, build a cart, or reschedule a delivery.
            </p>
          </div>
        </div>
      </section>
    </div>
    </ProtectedRoute>
  );
}

function Stat({ label, value, emoji }: { label: string; value: string; emoji: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 ring-1 ring-sultan-sand/60 flex items-center gap-3">
      <div className="text-3xl">{emoji}</div>
      <div>
        <div className="text-xs uppercase tracking-wider text-sultan-ink/50">{label}</div>
        <div className="font-semibold text-sultan-emerald-900">{value}</div>
      </div>
    </div>
  );
}
