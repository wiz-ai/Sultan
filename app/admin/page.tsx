'use client';
import { useEffect, useState } from 'react';
import type { Product, Order, Category } from '@/lib/types';
import { usd, cn } from '@/lib/utils';
import { Pencil, Trash2, Plus, Package, ShieldCheck, DollarSign, TrendingUp, X, Save } from 'lucide-react';

const DEFAULT_PRODUCT: Partial<Product> = {
  name: '',
  nameAr: '',
  description: '',
  category: 'middle-eastern',
  price: 0,
  unit: 'each',
  stock: 10,
  emoji: '🛒',
  gradient: 'from-sultan-emerald-500 to-sultan-emerald-800',
  badges: [],
};

export default function AdminPage() {
  const [tab, setTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [search, setSearch] = useState('');

  async function load() {
    const [p, o] = await Promise.all([
      fetch('/api/products').then((r) => r.json()),
      fetch('/api/orders').then((r) => r.json()),
    ]);
    setProducts(p.products);
    setOrders(o.orders);
  }
  useEffect(() => {
    load();
  }, []);

  async function saveProduct() {
    if (!editing) return;
    const method = editing.id ? 'PUT' : 'POST';
    const url = editing.id ? `/api/products/${editing.id}` : '/api/products';
    await fetch(url, {
      method,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(editing),
    });
    setEditing(null);
    load();
  }

  async function removeProduct(id: string) {
    if (!confirm('Delete this product?')) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    load();
  }

  async function updateOrderStatus(id: string, status: Order['status']) {
    await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    load();
  }

  const filtered = search
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.category.includes(search.toLowerCase())
      )
    : products;

  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const activeOrders = orders.filter((o) => o.status !== 'delivered' && o.status !== 'canceled').length;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-2xl bg-sultan-emerald-900 text-sultan-cream flex items-center justify-center">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="chip">Store staff only</div>
          <h1 className="heading-display text-4xl text-sultan-emerald-900 mt-1">Sultan Admin</h1>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Package} label="Products" value={products.length.toString()} />
        <StatCard icon={TrendingUp} label="Active orders" value={activeOrders.toString()} accent />
        <StatCard icon={DollarSign} label="Lifetime revenue" value={usd(revenue)} />
        <StatCard icon={ShieldCheck} label="Halal certified" value="100%" />
      </div>

      <div className="flex gap-2 mb-6">
        <button
          className={cn('btn', tab === 'products' ? 'btn-primary' : 'btn-ghost')}
          onClick={() => setTab('products')}
        >
          Inventory
        </button>
        <button
          className={cn('btn', tab === 'orders' ? 'btn-primary' : 'btn-ghost')}
          onClick={() => setTab('orders')}
        >
          Orders
        </button>
      </div>

      {tab === 'products' ? (
        <>
          <div className="flex items-center gap-3 mb-4">
            <input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-white rounded-full ring-1 ring-sultan-sand px-4 py-2.5 outline-none text-sm focus:ring-sultan-emerald-500"
            />
            <button onClick={() => setEditing({ ...DEFAULT_PRODUCT })} className="btn btn-gold">
              <Plus className="w-4 h-4" /> Add product
            </button>
          </div>

          <div className="bg-white rounded-3xl ring-1 ring-sultan-sand/60 overflow-hidden">
            <div className="grid grid-cols-[1fr_120px_100px_100px_140px] gap-4 px-5 py-3 text-xs uppercase tracking-wider text-sultan-ink/60 bg-sultan-parchment/60">
              <div>Product</div>
              <div>Category</div>
              <div className="text-right">Price</div>
              <div className="text-right">Stock</div>
              <div className="text-right">Actions</div>
            </div>
            <div className="divide-y divide-sultan-sand/40 max-h-[520px] overflow-y-auto">
              {filtered.map((p) => (
                <div
                  key={p.id}
                  className="grid grid-cols-[1fr_120px_100px_100px_140px] gap-4 px-5 py-3 items-center text-sm hover:bg-sultan-parchment/40"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.gradient} flex items-center justify-center text-xl shrink-0`}>
                      {p.emoji}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium truncate">{p.name}</div>
                      <div className="text-xs text-sultan-ink/60 truncate">{p.nameAr ?? '—'}</div>
                    </div>
                  </div>
                  <div className="text-xs text-sultan-ink/70 truncate capitalize">{p.category.replace('-', ' ')}</div>
                  <div className="text-right font-semibold">{usd(p.price)}</div>
                  <div className="text-right">
                    <span className={cn('chip !py-0.5', p.stock < 10 ? '!bg-sultan-spice/15 !text-sultan-spice' : 'chip-emerald')}>
                      {p.stock}
                    </span>
                  </div>
                  <div className="text-right flex items-center gap-1 justify-end">
                    <button onClick={() => setEditing(p)} className="btn btn-ghost !p-2">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => removeProduct(p.id)} className="btn btn-ghost !p-2 text-sultan-spice">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-3xl ring-1 ring-sultan-sand/60 overflow-hidden">
          <div className="grid grid-cols-[110px_1fr_120px_110px_120px_160px] gap-4 px-5 py-3 text-xs uppercase tracking-wider text-sultan-ink/60 bg-sultan-parchment/60">
            <div>Order</div>
            <div>Customer</div>
            <div>Window</div>
            <div>Type</div>
            <div className="text-right">Total</div>
            <div className="text-right">Status</div>
          </div>
          <div className="divide-y divide-sultan-sand/40 max-h-[560px] overflow-y-auto">
            {orders.map((o) => (
              <div key={o.id} className="grid grid-cols-[110px_1fr_120px_110px_120px_160px] gap-4 px-5 py-3 items-center text-sm">
                <div className="font-mono text-xs">{o.id}</div>
                <div className="min-w-0">
                  <div className="font-medium truncate">{o.customerName}</div>
                  <div className="text-xs text-sultan-ink/60 truncate">{o.address}</div>
                </div>
                <div className="text-xs">{o.deliveryWindow}</div>
                <div>
                  {o.deliveryType === 'same-day' ? (
                    <span className="chip !bg-sultan-gold-500 !text-sultan-ink">Same-day</span>
                  ) : (
                    <span className="chip chip-emerald">Next-day</span>
                  )}
                </div>
                <div className="text-right font-semibold">{usd(o.total)}</div>
                <div className="text-right">
                  <select
                    value={o.status}
                    onChange={(e) => updateOrderStatus(o.id, e.target.value as Order['status'])}
                    className="text-xs bg-sultan-parchment/60 rounded-full px-2 py-1.5 outline-none ring-1 ring-sultan-sand"
                  >
                    {(['pending','confirmed','packing','out-for-delivery','delivered','canceled'] as const).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {editing && (
        <ProductEditor
          product={editing}
          onChange={setEditing}
          onClose={() => setEditing(null)}
          onSave={saveProduct}
        />
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: any;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl p-5 ring-1',
        accent
          ? 'bg-gradient-to-br from-sultan-gold-300 to-sultan-gold-500 text-sultan-ink ring-sultan-gold-400'
          : 'bg-white ring-sultan-sand/60'
      )}
    >
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider opacity-70">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <div className="heading-display text-3xl mt-1">{value}</div>
    </div>
  );
}

function ProductEditor({
  product,
  onChange,
  onClose,
  onSave,
}: {
  product: Partial<Product>;
  onChange: (p: Partial<Product>) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const categories: Category[] = ['middle-eastern','produce','meat','dairy-bakery','pantry','coffee-tea','hookah','sweets'];
  const gradients = [
    'from-sultan-emerald-500 to-sultan-emerald-800',
    'from-amber-400 to-amber-700',
    'from-rose-600 to-stone-900',
    'from-red-600 to-red-900',
    'from-yellow-400 to-orange-700',
    'from-stone-700 to-stone-950',
    'from-lime-500 to-green-800',
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-sultan-cream rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-sultan-sand flex items-center justify-between">
          <div className="heading-display text-2xl">{product.id ? 'Edit product' : 'Add product'}</div>
          <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-black/5 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-[80px_1fr] gap-3 items-start">
            <div className={`aspect-square rounded-2xl bg-gradient-to-br ${product.gradient} flex items-center justify-center text-4xl`}>
              {product.emoji}
            </div>
            <div className="space-y-2">
              <label className="block">
                <span className="text-xs uppercase tracking-wider text-sultan-ink/60">Emoji</span>
                <input
                  value={product.emoji ?? ''}
                  onChange={(e) => onChange({ ...product, emoji: e.target.value })}
                  maxLength={4}
                  className="mt-1 w-full rounded-xl bg-white ring-1 ring-sultan-sand px-3 py-2 outline-none"
                />
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-wider text-sultan-ink/60">Art gradient</span>
                <select
                  value={product.gradient ?? ''}
                  onChange={(e) => onChange({ ...product, gradient: e.target.value })}
                  className="mt-1 w-full rounded-xl bg-white ring-1 ring-sultan-sand px-3 py-2 outline-none"
                >
                  {gradients.map((g) => (
                    <option key={g} value={g}>{g.replace(/from-|to-/g, '').replace(/sultan-/g, '')}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <Field label="Name" value={product.name ?? ''} onChange={(v) => onChange({ ...product, name: v })} />
          <Field label="Arabic name (optional)" value={product.nameAr ?? ''} onChange={(v) => onChange({ ...product, nameAr: v })} />
          <Field label="Description" value={product.description ?? ''} onChange={(v) => onChange({ ...product, description: v })} textarea />
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-sultan-ink/60">Category</span>
              <select
                value={product.category ?? ''}
                onChange={(e) => onChange({ ...product, category: e.target.value as Category })}
                className="mt-1 w-full rounded-xl bg-white ring-1 ring-sultan-sand px-3 py-2 outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
            <Field label="Unit" value={product.unit ?? ''} onChange={(v) => onChange({ ...product, unit: v })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price (USD)" value={String(product.price ?? 0)} onChange={(v) => onChange({ ...product, price: Number(v) })} />
            <Field label="Stock" value={String(product.stock ?? 0)} onChange={(v) => onChange({ ...product, stock: Number(v) })} />
          </div>
          <Field label="Origin (optional)" value={product.origin ?? ''} onChange={(v) => onChange({ ...product, origin: v })} />
        </div>
        <div className="p-5 border-t border-sultan-sand flex gap-2">
          <button onClick={onSave} className="btn btn-primary flex-1 justify-center">
            <Save className="w-4 h-4" /> Save
          </button>
          <button onClick={onClose} className="btn btn-ghost">Cancel</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-sultan-ink/60">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-xl bg-white ring-1 ring-sultan-sand px-3 py-2 outline-none min-h-[80px]"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-xl bg-white ring-1 ring-sultan-sand px-3 py-2 outline-none"
        />
      )}
    </label>
  );
}
