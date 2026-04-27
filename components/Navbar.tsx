'use client';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { BookHeart, LogIn, LogOut, ShieldCheck, ShoppingBag, Store, Truck } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth, type UserRole } from '@/lib/auth';

export function Navbar() {
  const count = useCart((s) => s.itemCount());
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const tabs: { href: string; label: string; icon: any; roles: UserRole[] }[] = [
    { href: '/shop', label: 'Shop', icon: Store, roles: ['user', 'admin'] },
    { href: '/recipes', label: 'Recipes', icon: BookHeart, roles: ['user', 'admin'] },
    { href: '/account', label: 'My Orders', icon: ShoppingBag, roles: ['user', 'admin'] },
    { href: '/driver', label: 'Driver', icon: Truck, roles: ['driver', 'admin'] },
    { href: '/admin', label: 'Admin', icon: ShieldCheck, roles: ['admin'] },
  ];
  const visibleTabs = user
    ? tabs.filter((tab) => tab.roles.includes(user.role))
    : tabs.filter((tab) => tab.href === '/shop' || tab.href === '/recipes');

  function signOut() {
    logout();
    router.push('/login');
  }

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
          {visibleTabs.map((t) => {
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
          {user?.role !== 'driver' && (
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
          )}
          {user ? (
            <>
              <div className="hidden lg:block text-right leading-tight">
                <div className="text-sm font-semibold text-sultan-emerald-900">{user.name}</div>
                <div className="text-[10px] uppercase tracking-widest text-sultan-ink/50">{user.role}</div>
              </div>
              <button onClick={signOut} className="btn btn-ghost !py-2 !px-3" aria-label="Sign out">
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <Link href="/login" className="btn btn-primary !py-2 !px-3">
              <LogIn className="w-4 h-4" />
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
