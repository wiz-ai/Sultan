'use client';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { CategoryPill, CATEGORIES } from '@/components/CategoryPill';
import type { Product, Category } from '@/lib/types';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-6 py-10">Loading shop…</div>}>
      <ShopInner />
    </Suspense>
  );
}

function ShopInner() {
  const params = useSearchParams();
  const initial = (params.get('c') as Category | 'all' | null) ?? 'all';
  const [active, setActive] = useState<Category | 'all'>(initial);
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<'name' | 'price-asc' | 'price-desc'>('name');

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((d) => setProducts(d.products))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = products;
    if (active !== 'all') list = list.filter((p) => p.category === active);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.nameAr && p.nameAr.includes(q))
      );
    }
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, active, query, sort]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="chip chip-emerald mb-3">The aisles</div>
          <h1 className="heading-display text-4xl md:text-5xl text-sultan-emerald-900">
            Shop Sultan
          </h1>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-full ring-1 ring-sultan-sand pl-4 pr-1 py-1 w-full md:w-96">
          <Search className="w-4 h-4 text-sultan-ink/50" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search olive oil, shish taouk, shisha..."
            className="flex-1 bg-transparent outline-none text-sm py-2"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 scroll-x overflow-x-auto pb-2 mb-6">
        {CATEGORIES.map((c) => (
          <CategoryPill
            key={c.id}
            cat={c}
            active={active === c.id}
            onClick={() => setActive(c.id as any)}
          />
        ))}
        <div className="ml-auto shrink-0 flex items-center gap-2 text-xs text-sultan-ink/60">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="bg-transparent outline-none"
          >
            <option value="name">A → Z</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-3xl aspect-[3/4] animate-pulse ring-1 ring-sultan-sand/40" />
          ))}
        </div>
      ) : (
        <>
          <div className="text-sm text-sultan-ink/60 mb-4">{filtered.length} items</div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-24 text-sultan-ink/60">
              No products found — try another search.
            </div>
          )}
        </>
      )}
    </div>
  );
}
