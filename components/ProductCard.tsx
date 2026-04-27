'use client';
import type { Product } from '@/lib/types';
import { useCart } from '@/lib/cart';
import { usd, cn } from '@/lib/utils';
import { Plus, Check } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);

  const onAdd = () => {
    add(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'group relative bg-white rounded-3xl overflow-hidden shadow-card ring-1 ring-sultan-sand/60 flex flex-col',
        compact ? 'w-56 shrink-0' : ''
      )}
    >
      <div className={cn('product-art aspect-[4/3] bg-gradient-to-br flex items-center justify-center overflow-hidden', product.gradient)}>
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="text-7xl drop-shadow-lg">{product.emoji}</span>
        )}
        {product.badges && product.badges.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {product.badges.slice(0, 2).map((b) => (
              <span key={b} className="chip !bg-white/90 !text-sultan-ink">
                {b}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-sultan-ink leading-tight">{product.name}</h3>
            {product.nameAr && (
              <div className="arabic text-sm text-sultan-gold-700 mt-0.5">{product.nameAr}</div>
            )}
          </div>
          <div className="text-right shrink-0">
            <div className="font-bold text-sultan-emerald-800">{usd(product.price)}</div>
            <div className="text-[11px] text-sultan-ink/60">/ {product.unit}</div>
          </div>
        </div>
        {!compact && (
          <p className="text-sm text-sultan-ink/70 mt-2 line-clamp-2">{product.description}</p>
        )}
        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider text-sultan-ink/50">
            {product.origin ? `From ${product.origin}` : `In stock · ${product.stock}`}
          </span>
          <button
            onClick={onAdd}
            className={cn(
              'btn !py-1.5 !px-3 !text-xs transition-all',
              added ? 'btn-gold' : 'btn-primary'
            )}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
