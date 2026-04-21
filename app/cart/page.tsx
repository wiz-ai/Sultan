'use client';
import { useCart } from '@/lib/cart';
import Link from 'next/link';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { usd } from '@/lib/utils';
import { computeTotals } from '@/lib/pricing';

export default function CartPage() {
  const lines = useCart((s) => s.lines);
  const inc = useCart((s) => s.increment);
  const dec = useCart((s) => s.decrement);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const subtotal = useCart((s) => s.subtotal());

  const next = computeTotals(subtotal, 'next-day');

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-11 h-11 rounded-2xl bg-sultan-emerald-900 text-sultan-cream flex items-center justify-center">
          <ShoppingBag className="w-5 h-5" />
        </div>
        <div>
          <div className="chip chip-emerald">Your basket</div>
          <h1 className="heading-display text-3xl md:text-4xl text-sultan-emerald-900 mt-1">Cart</h1>
        </div>
      </div>

      {lines.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-7xl mb-4">🧺</div>
          <div className="heading-display text-2xl text-sultan-emerald-900">Your basket is empty</div>
          <p className="text-sultan-ink/60 mt-2">Start shopping — our Medjool dates are calling.</p>
          <Link href="/shop" className="btn btn-primary mt-6">
            Browse the shop <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-[1fr_360px] gap-8">
          <div className="bg-white rounded-3xl ring-1 ring-sultan-sand/60 divide-y divide-sultan-sand/60">
            {lines.map((l) => (
              <div key={l.productId} className="flex items-center gap-4 p-4">
                <div className="w-16 h-16 rounded-xl bg-sultan-parchment flex items-center justify-center text-3xl">
                  {l.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{l.name}</div>
                  <div className="text-sm text-sultan-ink/60">{usd(l.price)} each</div>
                </div>
                <div className="flex items-center gap-1 bg-sultan-parchment rounded-full p-1">
                  <button onClick={() => dec(l.productId)} className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-7 text-center font-semibold">{l.qty}</span>
                  <button onClick={() => inc(l.productId)} className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="w-20 text-right font-bold text-sultan-emerald-800">{usd(l.price * l.qty)}</div>
                <button onClick={() => remove(l.productId)} className="w-8 h-8 rounded-full hover:bg-sultan-spice/10 text-sultan-spice flex items-center justify-center">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div className="p-4 flex justify-between">
              <button onClick={clear} className="text-sm text-sultan-ink/60 hover:text-sultan-spice">
                Clear basket
              </button>
              <Link href="/shop" className="text-sm text-sultan-emerald-800 font-medium">
                + Add more
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-sultan-emerald-900 to-sultan-emerald-950 text-sultan-cream rounded-3xl p-6 h-fit sticky top-24 shadow-soft">
            <div className="font-semibold uppercase text-xs tracking-widest text-sultan-gold-300">
              Order summary
            </div>
            <div className="space-y-2 mt-4 text-sm">
              <Row label="Subtotal" value={usd(subtotal)} />
              <Row label="Delivery (next-day)" value={next.deliveryFee === 0 ? 'FREE' : usd(next.deliveryFee)} />
              <Row label="Sales tax (7.5%)" value={usd(next.tax)} />
              <div className="h-px bg-white/10 my-3" />
              <div className="flex justify-between text-lg font-bold">
                <span>Estimated total</span>
                <span>{usd(next.total)}</span>
              </div>
              {next.freeReason && (
                <div className="chip !bg-sultan-gold-400/20 !text-sultan-gold-200 mt-2">
                  ✓ {next.freeReason}
                </div>
              )}
            </div>
            <Link href="/checkout" className="btn btn-gold w-full mt-6 justify-center">
              Go to checkout <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-xs text-sultan-cream/60 mt-3">
              Same-day delivery available on checkout if ordered before 3pm.
            </p>
          </div>
        </div>
      )}
    </div>
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
