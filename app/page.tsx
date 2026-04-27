import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { ChatAssistantPanel } from '@/components/ChatLauncher';
import { products, recipes } from '@/lib/repo';
import { ArrowRight, Clock, Leaf, ShieldCheck, Sparkles, Truck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function Home() {
  const all = products.list();
  const bestsellers = all.filter((p) => p.badges?.includes('bestseller')).slice(0, 4);
  const fallback = all.slice(0, 4);
  const featured = bestsellers.length === 4 ? bestsellers : [...bestsellers, ...fallback].slice(0, 4);
  const categoriesPreview = [
    { cat: 'middle-eastern', label: 'Middle Eastern', emoji: '🫒', gradient: 'from-emerald-500 to-emerald-900', nameAr: 'مؤن عربية' },
    { cat: 'meat', label: 'Halal Meats', emoji: '🥩', gradient: 'from-rose-600 to-stone-900', nameAr: 'لحوم حلال' },
    { cat: 'produce', label: 'Produce', emoji: '🥬', gradient: 'from-lime-500 to-green-800', nameAr: 'خضار وفواكه' },
    { cat: 'coffee-tea', label: 'Coffee & Tea', emoji: '☕', gradient: 'from-amber-700 to-yellow-900', nameAr: 'قهوة وشاي' },
    { cat: 'hookah', label: 'Hookah', emoji: '💨', gradient: 'from-stone-700 to-stone-950', nameAr: 'أرجيلة' },
    { cat: 'sweets', label: 'Sweets', emoji: '🍯', gradient: 'from-amber-400 to-orange-700', nameAr: 'حلويات' },
  ];
  const topRecipes = recipes.list().slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-sultan-cream via-white to-sultan-emerald-50">
        <div className="absolute inset-0 bg-pattern-arabesque opacity-45 pointer-events-none" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 pb-16 pt-12 md:pt-16 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="animate-fade-up">
            <div className="chip mb-5">
              <Sparkles className="h-3.5 w-3.5" />
              AI-first grocery shopping
            </div>
            <h1 className="heading-display text-5xl leading-[1.05] text-sultan-emerald-900 md:text-7xl">
              Ask Sultan.
              <br />
              <span className="italic text-sultan-gold-600">Then shop.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-sultan-ink/75">
              Describe dinner, ask in Arabic or English, get product ideas, and build a cart around what you actually want to cook.
              Halal meats, pantry staples, coffee, sweets, and Tampa delivery are one conversation away.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="btn btn-primary">
                Shop the store <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/recipes" className="btn btn-ghost">
                Tonight's recipes
              </Link>
            </div>
            <div className="mt-10 grid max-w-lg grid-cols-3 gap-4">
              <Feature icon={ShieldCheck} title="Halal certified" note="Every cut, verified" />
              <Feature icon={Leaf} title="Local produce" note="Florida-grown daily" />
              <Feature icon={Truck} title="Tampa delivery" note="Same-day or next-day" />
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-2xl">
            <div className="absolute -inset-3 rounded-[2rem] bg-sultan-emerald-900/10 blur-2xl" />
            <ChatAssistantPanel featured className="relative" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="chip chip-emerald mb-3">Departments</div>
            <h2 className="heading-display text-4xl text-sultan-emerald-900">Wander the aisles</h2>
          </div>
          <Link href="/shop" className="flex items-center gap-1 text-sm font-medium text-sultan-emerald-800 transition-all hover:gap-2">
            Browse all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {categoriesPreview.map((c) => (
            <Link
              key={c.cat}
              href={`/shop?c=${c.cat}`}
              className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${c.gradient} p-8 text-sultan-cream shadow-card transition hover:shadow-soft`}
            >
              <div className="mb-4 text-6xl transition-transform group-hover:scale-110">{c.emoji}</div>
              <div className="text-xl font-semibold">{c.label}</div>
              <div className="arabic mt-0.5 text-sultan-gold-200/90">{c.nameAr}</div>
              <div className="mt-4 inline-flex items-center gap-1 text-xs uppercase tracking-widest opacity-80">
                Shop now <ArrowRight className="h-3 w-3" />
              </div>
              <div className="absolute -bottom-6 -right-6 select-none text-[10rem] opacity-10">{c.emoji}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="chip mb-3">Bestsellers this week</div>
            <h2 className="heading-display text-4xl text-sultan-emerald-900">What Tampa is buying</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-sultan-emerald-900 to-sultan-ink p-10 text-sultan-cream md:p-14">
          <div className="absolute inset-0 bg-pattern-arabesque opacity-20" />
          <div className="relative grid items-center gap-10 md:grid-cols-2">
            <div>
              <div className="chip !bg-sultan-gold-400/20 !text-sultan-gold-200 mb-4">
                <Sparkles className="h-3.5 w-3.5" /> From our kitchen
              </div>
              <h2 className="heading-display text-4xl leading-tight md:text-5xl">
                Cook something beautiful tonight.
              </h2>
              <p className="mt-4 max-w-lg text-sultan-cream/70">
                Every recipe comes with a one-tap cart. Miss an ingredient? We'll flag it.
                Need help? Ask our AI in English or Arabic.
              </p>
              <Link href="/recipes" className="btn btn-gold mt-6 inline-flex">
                Browse recipes <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {topRecipes.map((r) => (
                <Link
                  key={r.id}
                  href={`/recipes#${r.id}`}
                  className={`flex aspect-[3/4] flex-col justify-between rounded-2xl bg-gradient-to-br ${r.gradient} p-5 shadow-soft transition hover:scale-[1.02]`}
                >
                  <div className="text-4xl">{r.emoji}</div>
                  <div>
                    <div className="text-sm font-semibold leading-tight">{r.name}</div>
                    <div className="arabic text-xs text-sultan-gold-200/90">{r.nameAr}</div>
                    <div className="mt-2 flex items-center gap-1 text-[10px] uppercase tracking-widest opacity-80">
                      <Clock className="h-3 w-3" /> {r.cookTimeMin}min
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="ornate-divider my-8" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow-card ring-1 ring-sultan-sand/60">
            <div className="flex items-center justify-between">
              <div className="chip chip-emerald">Next-day delivery</div>
              <div className="font-bold text-sultan-emerald-800">$4.99 · Free over $50</div>
            </div>
            <h3 className="heading-display mt-4 text-2xl">Plan tonight's dinner, we'll handle tomorrow.</h3>
            <p className="mt-2 text-sm text-sultan-ink/70">
              Order by midnight and we'll deliver in a two-hour window of your choice between 9am and 9pm.
              Optimized routes mean your groceries are sorted and chilled till they reach your door.
            </p>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-sultan-gold-300 to-sultan-gold-600 p-8 text-sultan-ink shadow-glow">
            <div className="flex items-center justify-between">
              <div className="chip !bg-white/70">Same-day delivery</div>
              <div className="font-bold">$12.99 · Free over $100</div>
            </div>
            <h3 className="heading-display mt-4 text-2xl">Dinner in two hours. Priority when it matters.</h3>
            <p className="mt-2 text-sm opacity-90">
              Order before 3pm. Add <strong>+$5.99 priority</strong> and we'll rush it inside a
              2-hour window. $35 minimum, so it's always worth the ride.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function Feature({ icon: Icon, title, note }: { icon: any; title: string; note: string }) {
  return (
    <div>
      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-sultan-emerald-50 text-sultan-emerald-800 ring-1 ring-sultan-emerald-100">
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-sm font-semibold">{title}</div>
      <div className="text-xs text-sultan-ink/60">{note}</div>
    </div>
  );
}
