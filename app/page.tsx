import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { ChatAssistantPanel } from '@/components/ChatLauncher';
import { products, recipes } from '@/lib/repo';
import { ArrowRight, Sparkles, Clock, Truck, ShieldCheck, Leaf } from 'lucide-react';

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
      <section className="mx-auto max-w-7xl px-6 pt-8">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-8 items-center rounded-[2.5rem] bg-sultan-emerald-950 p-6 md:p-8 text-sultan-cream shadow-2xl">
          <div>
            <div className="chip !bg-sultan-gold-400/20 !text-sultan-gold-200 mb-4">
              <Sparkles className="w-3.5 h-3.5" /> AI first shopping
            </div>
            <h2 className="heading-display text-4xl leading-tight">
              Start with the assistant, then fill the cart.
            </h2>
            <p className="mt-4 text-sultan-cream/70">
              Ask for dinner ideas, Arabic pantry staples, delivery timing, or a full ingredient list. This is the front door of the Sultan experience.
            </p>
          </div>
          <ChatAssistantPanel featured />
        </div>
      </section>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-arabesque opacity-60 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6 pt-16 md:pt-24 pb-20 grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <div className="chip mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              Family-run · Tampa, Florida
            </div>
            <h1 className="heading-display text-5xl md:text-7xl text-sultan-emerald-900 leading-[1.05]">
              From the souk <br />
              <span className="text-sultan-gold-600 italic">to your door.</span>
            </h1>
            <p className="mt-6 text-lg text-sultan-ink/75 max-w-xl">
              Halal meats, wild Palestinian za'atar, Nabali olive oil, cardamom coffee,
              Khalil Mamoon hookahs, and Medjool dates the size of plums —
              delivered across Tampa with <strong>free next-day</strong> over $50,
              or premium <strong>same-day</strong> if you can't wait.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="btn btn-primary">
                Shop the store <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/recipes" className="btn btn-ghost">
                Tonight's recipes
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg">
              <Feature icon={ShieldCheck} title="Halal certified" note="Every cut, verified" />
              <Feature icon={Leaf} title="Local produce" note="Florida-grown daily" />
              <Feature icon={Truck} title="Tampa delivery" note="Same-day or next-day" />
            </div>
          </div>

          <div className="relative aspect-square max-w-lg mx-auto w-full">
            <div className="absolute inset-0 rounded-[40%] bg-gradient-to-br from-sultan-emerald-700 via-sultan-emerald-900 to-sultan-ink shadow-[0_40px_80px_-30px_rgba(15,46,36,0.6)]" />
            <div className="absolute inset-4 rounded-[38%] bg-gradient-to-br from-sultan-gold-300/20 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-3 p-8">
                {['🫒','🌿','🍖','☕','🥖','🌴','🍯','🍷','💨'].map((e, i) => (
                  <div
                    key={i}
                    className="w-20 h-20 rounded-2xl bg-sultan-cream/90 flex items-center justify-center text-4xl shadow-soft animate-float"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  >
                    {e}
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -top-4 -right-4 rotate-12 bg-sultan-gold-400 text-sultan-ink px-4 py-2 rounded-full text-sm font-bold shadow-glow">
              ✦ Since 1998 ✦
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="chip chip-emerald mb-3">Departments</div>
            <h2 className="heading-display text-4xl text-sultan-emerald-900">Wander the aisles</h2>
          </div>
          <Link href="/shop" className="text-sm font-medium text-sultan-emerald-800 flex items-center gap-1 hover:gap-2 transition-all">
            Browse all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categoriesPreview.map((c) => (
            <Link
              key={c.cat}
              href={`/shop?c=${c.cat}`}
              className={`group relative rounded-3xl p-8 overflow-hidden bg-gradient-to-br ${c.gradient} text-sultan-cream shadow-card hover:shadow-soft transition`}
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">{c.emoji}</div>
              <div className="text-xl font-semibold">{c.label}</div>
              <div className="arabic text-sultan-gold-200/90 mt-0.5">{c.nameAr}</div>
              <div className="mt-4 inline-flex items-center gap-1 text-xs uppercase tracking-widest opacity-80">
                Shop now <ArrowRight className="w-3 h-3" />
              </div>
              <div className="absolute -bottom-6 -right-6 text-[10rem] opacity-10 select-none">{c.emoji}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Bestsellers ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="chip mb-3">Bestsellers this week</div>
            <h2 className="heading-display text-4xl text-sultan-emerald-900">What Tampa is buying</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ── Recipes teaser ──────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-[2.5rem] bg-gradient-to-br from-sultan-emerald-900 to-sultan-emerald-950 text-sultan-cream p-10 md:p-14 relative overflow-hidden">
          <div className="absolute inset-0 bg-pattern-arabesque opacity-20" />
          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="chip !bg-sultan-gold-400/20 !text-sultan-gold-200 mb-4">
                <Sparkles className="w-3.5 h-3.5" /> From our kitchen
              </div>
              <h2 className="heading-display text-4xl md:text-5xl leading-tight">
                Cook something beautiful tonight.
              </h2>
              <p className="mt-4 text-sultan-cream/70 max-w-lg">
                Every recipe comes with a one-tap cart. Miss an ingredient? We'll flag it.
                Need help? Ask our AI in English or Arabic.
              </p>
              <Link href="/recipes" className="btn btn-gold mt-6 inline-flex">
                Browse recipes <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {topRecipes.map((r) => (
                <Link key={r.id} href={`/recipes#${r.id}`} className={`rounded-2xl p-5 bg-gradient-to-br ${r.gradient} shadow-soft hover:scale-[1.02] transition aspect-[3/4] flex flex-col justify-between`}>
                  <div className="text-4xl">{r.emoji}</div>
                  <div>
                    <div className="font-semibold text-sm leading-tight">{r.name}</div>
                    <div className="arabic text-xs text-sultan-gold-200/90">{r.nameAr}</div>
                    <div className="mt-2 text-[10px] uppercase tracking-widest opacity-80 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {r.cookTimeMin}min
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Delivery ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="ornate-divider my-8" />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-3xl bg-white p-8 shadow-card ring-1 ring-sultan-sand/60">
            <div className="flex items-center justify-between">
              <div className="chip chip-emerald">Next-day delivery</div>
              <div className="text-sultan-emerald-800 font-bold">$4.99 · Free over $50</div>
            </div>
            <h3 className="heading-display text-2xl mt-4">Plan tonight's dinner, we'll handle tomorrow.</h3>
            <p className="text-sm text-sultan-ink/70 mt-2">
              Order by midnight — we'll deliver in a two-hour window of your choice between 9am and 9pm.
              Optimized routes mean your groceries are sorted and chilled till they reach your door.
            </p>
          </div>
          <div className="rounded-3xl p-8 bg-gradient-to-br from-sultan-gold-300 to-sultan-gold-600 text-sultan-ink shadow-glow">
            <div className="flex items-center justify-between">
              <div className="chip !bg-white/70">Same-day delivery</div>
              <div className="font-bold">$12.99 · Free over $100</div>
            </div>
            <h3 className="heading-display text-2xl mt-4">Dinner in two hours. Priority when it matters.</h3>
            <p className="text-sm mt-2 opacity-90">
              Order before 3pm. Add <strong>+$5.99 priority</strong> and we'll rush it inside a
              2-hour window. $35 minimum — so it's always worth the ride.
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
      <div className="w-10 h-10 rounded-xl bg-sultan-emerald-50 ring-1 ring-sultan-emerald-100 flex items-center justify-center text-sultan-emerald-800 mb-2">
        <Icon className="w-5 h-5" />
      </div>
      <div className="font-semibold text-sm">{title}</div>
      <div className="text-xs text-sultan-ink/60">{note}</div>
    </div>
  );
}
