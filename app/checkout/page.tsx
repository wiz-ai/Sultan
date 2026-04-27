'use client';
import { useState, useMemo } from 'react';
import { useCart } from '@/lib/cart';
import { computeTotals, PRICING, deliveryWindows } from '@/lib/pricing';
import type { DeliveryType } from '@/lib/types';
import { usd } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Clock, Zap, Truck, Lock, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, createCustomerAccount } = useAuth();
  const lines = useCart((s) => s.lines);
  const subtotal = useCart((s) => s.subtotal());
  const clear = useCart((s) => s.clear);

  const [name, setName] = useState('Amira Test');
  const [phone, setPhone] = useState('+1-813-555-0000');
  const [address, setAddress] = useState('3800 W Platt St, Tampa, FL 33609');
  const [notes, setNotes] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountError, setAccountError] = useState('');

  const windows = useMemo(() => deliveryWindows(), []);
  const [windowId, setWindowId] = useState(windows[0]?.id);
  const selectedWindow = windows.find((w) => w.id === windowId)!;
  const deliveryType: DeliveryType = selectedWindow.type;
  const [priority, setPriority] = useState(false);

  const totals = computeTotals(subtotal, deliveryType, priority);

  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!lines.length) return;
    let orderUser = user;
    if (!orderUser) {
      if (!phone.trim() || password.length < 6) {
        setAccountError('Add a phone number and a password with at least 6 characters to create your account.');
        return;
      }
      orderUser = createCustomerAccount({ name, phone, email, password });
    }
    setAccountError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          userId: orderUser.id,
          phone,
          address,
          notes,
          deliveryType,
          deliveryWindow: selectedWindow.label,
          priority,
          items: lines.map((l) => ({
            productId: l.productId,
            name: l.name,
            price: l.price,
            qty: l.qty,
            emoji: l.emoji,
          })),
        }),
      });
      const data = await res.json();
      clear();
      setDone(data.order.id);
    } finally {
      setSubmitting(false);
    }
  }

  const minNotMet =
    deliveryType === 'same-day' && subtotal < PRICING.sameDay.minOrder;

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center animate-fade-up">
        <div className="w-20 h-20 mx-auto rounded-full bg-sultan-emerald-700 text-sultan-cream flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="chip chip-emerald mb-3">Order confirmed · {done}</div>
        <h1 className="heading-display text-4xl text-sultan-emerald-900">Shukran! Your groceries are on the way.</h1>
        <p className="text-sultan-ink/70 mt-4">
          We'll send you a text when your driver is out for delivery. You can also track it under your orders.
        </p>
        <div className="flex justify-center gap-3 mt-8">
          <button onClick={() => router.push('/account')} className="btn btn-primary">
            Track my order
          </button>
          <button onClick={() => router.push('/shop')} className="btn btn-ghost">
            Keep shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="chip chip-emerald mb-3">Checkout</div>
      <h1 className="heading-display text-4xl text-sultan-emerald-900 mb-8">Confirm your order</h1>

      <form onSubmit={submit} className="grid md:grid-cols-[1fr_400px] gap-8">
        <div className="space-y-8">
          {!user && (
            <section className="bg-white rounded-3xl p-6 ring-1 ring-sultan-sand/60 space-y-4">
              <div className="flex items-center gap-2 font-semibold">
                <UserPlus className="w-4 h-4" /> Create your account to checkout
              </div>
              <p className="text-sm text-sultan-ink/60">
                You can shop as a guest. To place the order, we need a phone number and password so you can track it later.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Phone" value={phone} onChange={setPhone} />
                <Field label="Email (optional)" value={email} onChange={setEmail} />
              </div>
              <label className="block">
                <span className="text-xs uppercase tracking-wider text-sultan-ink/60">Password</span>
                <input
                  value={password}
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-xl bg-sultan-parchment/60 ring-1 ring-sultan-sand px-3 py-2 outline-none focus:ring-sultan-emerald-500"
                  placeholder="At least 6 characters"
                />
              </label>
              {accountError && (
                <div className="rounded-2xl bg-sultan-spice/10 px-4 py-3 text-sm text-sultan-spice">
                  {accountError}
                </div>
              )}
            </section>
          )}

          {/* Delivery window selection */}
          <section className="bg-white rounded-3xl p-6 ring-1 ring-sultan-sand/60">
            <div className="flex items-center gap-2 font-semibold mb-4">
              <Clock className="w-4 h-4" /> Pick a delivery window
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {windows.map((w) => {
                const active = windowId === w.id;
                const sameDay = w.type === 'same-day';
                return (
                  <button
                    type="button"
                    key={w.id}
                    onClick={() => setWindowId(w.id)}
                    className={cn(
                      'text-left rounded-2xl p-4 border-2 transition',
                      active
                        ? sameDay
                          ? 'border-sultan-gold-500 bg-sultan-gold-50'
                          : 'border-sultan-emerald-700 bg-sultan-emerald-50'
                        : 'border-sultan-sand hover:border-sultan-emerald-300'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {sameDay ? (
                        <span className="chip !bg-sultan-gold-500 !text-sultan-ink">
                          <Zap className="w-3 h-3" /> Same-day
                        </span>
                      ) : (
                        <span className="chip chip-emerald">
                          <Truck className="w-3 h-3" /> Next-day
                        </span>
                      )}
                    </div>
                    <div className="mt-2 font-semibold">{w.label}</div>
                    <div className="text-xs text-sultan-ink/60 mt-0.5">
                      {sameDay ? 'Delivered in a 2-hour window' : 'Delivered in a 3-hour window'}
                    </div>
                  </button>
                );
              })}
            </div>
            {deliveryType === 'same-day' && (
              <label className="mt-4 flex items-center gap-3 p-3 bg-sultan-gold-100 rounded-2xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={priority}
                  onChange={(e) => setPriority(e.target.checked)}
                  className="w-4 h-4 accent-sultan-gold-600"
                />
                <div>
                  <div className="font-semibold text-sm">⚡ Rush priority (+$5.99)</div>
                  <div className="text-xs text-sultan-ink/70">
                    Bump to the front of the route — typically delivered within 90 minutes.
                  </div>
                </div>
              </label>
            )}
            {minNotMet && (
              <div className="mt-3 p-3 bg-sultan-spice/10 text-sultan-spice rounded-xl text-sm">
                Same-day delivery requires a ${PRICING.sameDay.minOrder} minimum. Add {usd(PRICING.sameDay.minOrder - subtotal)} more or switch to next-day.
              </div>
            )}
          </section>

          {/* Contact + address */}
          <section className="bg-white rounded-3xl p-6 ring-1 ring-sultan-sand/60 space-y-4">
            <div className="font-semibold">Where are we delivering?</div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full name" value={name} onChange={setName} />
              <Field label="Phone" value={phone} onChange={setPhone} />
            </div>
            <Field label="Street address" value={address} onChange={setAddress} />
            <Field label="Notes for driver (optional)" value={notes} onChange={setNotes} textarea />
          </section>

          {/* Payment (demo) */}
          <section className="bg-white rounded-3xl p-6 ring-1 ring-sultan-sand/60">
            <div className="flex items-center gap-2 font-semibold">
              <Lock className="w-4 h-4" /> Payment
            </div>
            <p className="text-sm text-sultan-ink/60 mt-2">
              Demo only — no real charges. In production, wire up Stripe Checkout or Square here.
            </p>
            <div className="mt-4 rounded-2xl p-4 bg-sultan-parchment/70 text-sm font-mono">
              4242 4242 4242 4242 &nbsp; 12/28 &nbsp; 123
            </div>
          </section>
        </div>

        <aside className="bg-gradient-to-br from-sultan-emerald-900 to-sultan-emerald-950 text-sultan-cream rounded-3xl p-6 h-fit sticky top-24">
          <div className="font-semibold uppercase text-xs tracking-widest text-sultan-gold-300">
            Review
          </div>
          <div className="mt-4 divide-y divide-white/10">
            {lines.map((l) => (
              <div key={l.productId} className="py-2 flex gap-2 text-sm">
                <div className="text-xl">{l.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="truncate">{l.name}</div>
                  <div className="text-xs opacity-70">Qty {l.qty}</div>
                </div>
                <div className="font-semibold">{usd(l.price * l.qty)}</div>
              </div>
            ))}
          </div>
          <div className="space-y-1.5 mt-4 text-sm">
            <Row label="Subtotal" value={usd(totals.subtotal)} />
            <Row label="Delivery" value={totals.deliveryFee === 0 ? 'FREE' : usd(totals.deliveryFee)} />
            <Row label="Tax" value={usd(totals.tax)} />
            <div className="h-px bg-white/10 my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{usd(totals.total)}</span>
            </div>
            {totals.freeReason && (
              <div className="chip !bg-sultan-gold-400/20 !text-sultan-gold-200 mt-1">
                ✓ {totals.freeReason}
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={submitting || minNotMet || !lines.length}
            className="btn btn-gold w-full mt-6 justify-center disabled:opacity-50"
          >
            {submitting ? 'Placing order...' : `Place order · ${usd(totals.total)}`}
          </button>
        </aside>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-sultan-ink/60">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 block w-full rounded-xl bg-sultan-parchment/60 ring-1 ring-sultan-sand px-3 py-2 outline-none focus:ring-sultan-emerald-500 min-h-[70px]"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 block w-full rounded-xl bg-sultan-parchment/60 ring-1 ring-sultan-sand px-3 py-2 outline-none focus:ring-sultan-emerald-500"
        />
      )}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-sultan-cream/70">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
