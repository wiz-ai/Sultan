'use client';
import { cn } from '@/lib/utils';
import type { Category } from '@/lib/types';

export const CATEGORIES: { id: Category | 'all'; label: string; emoji: string }[] = [
  { id: 'all', label: 'Everything', emoji: '✨' },
  { id: 'middle-eastern', label: 'Middle Eastern', emoji: '🫒' },
  { id: 'produce', label: 'Produce', emoji: '🥒' },
  { id: 'meat', label: 'Halal Meats', emoji: '🥩' },
  { id: 'coffee-tea', label: 'Coffee & Tea', emoji: '☕' },
  { id: 'hookah', label: 'Hookah', emoji: '💨' },
  { id: 'sweets', label: 'Sweets', emoji: '🍯' },
];

export function CategoryPill({
  cat,
  active,
  onClick,
}: {
  cat: (typeof CATEGORIES)[number];
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition',
        active
          ? 'bg-sultan-emerald-900 text-sultan-cream shadow-soft'
          : 'bg-white/60 text-sultan-ink/70 ring-1 ring-sultan-sand hover:bg-white'
      )}
    >
      <span className="text-lg">{cat.emoji}</span>
      {cat.label}
    </button>
  );
}
