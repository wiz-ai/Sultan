'use client';
import { useEffect, useState } from 'react';
import type { Recipe, Product } from '@/lib/types';
import { useCart } from '@/lib/cart';
import { Clock, Users, ChefHat, ShoppingCart, Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn, usd } from '@/lib/utils';

type HydratedIngredient = { productId: string; quantity: string; optional?: boolean; product: Product | null };
type HydratedRecipe = Omit<Recipe, 'ingredients'> & { ingredients: HydratedIngredient[] };

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<HydratedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<string | null>(null);
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch('/api/recipes')
      .then((r) => r.json())
      .then((d) => setRecipes(d.recipes))
      .finally(() => setLoading(false));
  }, []);

  function addAllIngredients(r: HydratedRecipe) {
    r.ingredients.forEach((ing) => {
      if (ing.product && !ing.optional) add(ing.product, 1);
    });
    setAdded({ ...added, [r.id]: true });
    setTimeout(() => setAdded((a) => ({ ...a, [r.id]: false })), 2000);
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="chip chip-emerald mb-3">
        <Sparkles className="w-3.5 h-3.5" /> From our kitchen
      </div>
      <h1 className="heading-display text-4xl md:text-5xl text-sultan-emerald-900">
        Cook something beautiful
      </h1>
      <p className="text-sultan-ink/70 mt-2 max-w-2xl">
        Tap a recipe and we'll load every ingredient into your cart. Short on time? Pair it with same-day delivery.
      </p>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-96 bg-white rounded-3xl ring-1 ring-sultan-sand/40 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {recipes.map((r) => (
            <motion.article
              key={r.id}
              id={r.id}
              layout
              className="bg-white rounded-3xl shadow-card ring-1 ring-sultan-sand/60 overflow-hidden flex flex-col"
            >
              <div className={cn('aspect-[16/10] bg-gradient-to-br flex items-center justify-center relative', r.gradient)}>
                <span className="text-8xl drop-shadow-xl">{r.emoji}</span>
                <div className="absolute bottom-3 left-3 right-3 flex gap-2 flex-wrap">
                  <span className="chip !bg-white/90 !text-sultan-ink">
                    <Clock className="w-3 h-3" /> {r.cookTimeMin}m
                  </span>
                  <span className="chip !bg-white/90 !text-sultan-ink">
                    <Users className="w-3 h-3" /> {r.servings}
                  </span>
                  <span className="chip !bg-white/90 !text-sultan-ink">
                    <ChefHat className="w-3 h-3" /> {r.difficulty}
                  </span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="heading-display text-2xl text-sultan-emerald-900">{r.name}</h3>
                    {r.nameAr && (
                      <div className="arabic text-sultan-gold-700 mt-0.5">{r.nameAr}</div>
                    )}
                  </div>
                  <span className="text-[11px] uppercase tracking-widest text-sultan-ink/50">
                    {r.cuisine}
                  </span>
                </div>
                <p className="text-sm text-sultan-ink/70 mt-2">{r.description}</p>

                <div className="mt-4 border-t border-sultan-sand/60 pt-3">
                  <div className="text-xs uppercase tracking-widest text-sultan-ink/60 mb-2">Ingredients</div>
                  <ul className="space-y-1">
                    {r.ingredients.slice(0, active === r.id ? 999 : 4).map((ing, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <span className="text-lg">{ing.product?.emoji ?? '•'}</span>
                        <span className="flex-1 truncate">
                          <span className="font-medium">{ing.quantity}</span>{' '}
                          <span className="text-sultan-ink/70">{ing.product?.name ?? ing.productId}</span>
                          {ing.optional && <span className="text-xs text-sultan-ink/40 ml-1">(optional)</span>}
                        </span>
                        {ing.product && (
                          <span className="text-xs text-sultan-ink/50">{usd(ing.product.price)}</span>
                        )}
                      </li>
                    ))}
                    {r.ingredients.length > 4 && active !== r.id && (
                      <li>
                        <button onClick={() => setActive(r.id)} className="text-xs text-sultan-emerald-800 font-medium">
                          + {r.ingredients.length - 4} more
                        </button>
                      </li>
                    )}
                  </ul>
                </div>

                {active === r.id && (
                  <div className="mt-4 border-t border-sultan-sand/60 pt-3">
                    <div className="text-xs uppercase tracking-widest text-sultan-ink/60 mb-2">Method</div>
                    <ol className="list-decimal list-outside ml-4 space-y-2 text-sm text-sultan-ink/80">
                      {r.steps.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ol>
                  </div>
                )}

                <div className="mt-auto pt-4 flex gap-2">
                  <button
                    onClick={() => addAllIngredients(r)}
                    className={cn('btn flex-1 justify-center', added[r.id] ? 'btn-gold' : 'btn-primary')}
                  >
                    {added[r.id] ? (
                      <>
                        <Check className="w-4 h-4" /> Added to cart
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" /> Add all ingredients
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setActive(active === r.id ? null : r.id)}
                    className="btn btn-ghost !px-4"
                  >
                    {active === r.id ? 'Hide steps' : 'Cook it'}
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}
