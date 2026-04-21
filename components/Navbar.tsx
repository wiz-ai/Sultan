'use client';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { ShoppingBag, ShieldCheck, Truck, BookHeart, Store } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Navbar() {
  const count = useCart((s) => s.itemCount());
  const pathname = usePathname();

  const tabs = [
    { href: '/shop', label: 'Shop', icon: Store },
    { href: '/recipes', label: 'Recipes', icon: BookHeart },
    { href: '/account', label: 'My Orders', icon: ShoppingBag },
    { href: '/driver', label: 'Driver', icon: Truck },
    { href: '/admin', label: 'Admin', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 glass border-b border-sultan-sand/50">
      <div className="mx-auto max-w-7xl px-6 h-16 md:h-20 flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sultan-gold-400 to-sultan-emerald-700 flex items-center justify-center shadow-glow">
            <span className="text-xl">✦</span>
          </div>
          <div>
            <div className="heading-display text-xl md:text-2xl text-sultan-emerald-900 leading-none">
              Sultan
            </div>
            <div className="text-[10px] uppercase tracking-[0.15em] text-sultan-gold-700 leading-none mt-0.5">
              Tampa · Since 1998
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1 ml-4">
          {tabs.map((t) => {
            const active = pathname?.startsWith(t.href);
            const Icon = t.icon;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={cn(
                  'px-3.5 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition',
                  active
                    ? 'bg-sultan-emerald-900 text-sultan-cream'
                    : 'text-sultan-ink/70 hover:text-sultan-emerald-900 hover:bg-sultan-emerald-900/5'
                )}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/cart"
            className="relative btn btn-ghost !py-2 !px-3"
            aria-label="Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">Cart</span>
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-sultan-spice text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
