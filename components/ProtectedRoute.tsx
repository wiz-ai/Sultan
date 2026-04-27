'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import { useAuth, type UserRole } from '@/lib/auth';

export function ProtectedRoute({
  allowed,
  children,
}: {
  allowed: UserRole[];
  children: React.ReactNode;
}) {
  const { user, ready } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const allowedIn = user ? allowed.includes(user.role) : false;

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname || '/')}`);
      return;
    }
    if (!allowedIn) {
      router.replace(defaultPathForRole(user.role));
    }
  }, [allowedIn, pathname, ready, router, user]);

  if (!ready || !user || !allowedIn) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sultan-emerald-900 text-sultan-cream">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="heading-display text-3xl text-sultan-emerald-900">Checking access</div>
      </div>
    );
  }

  return <>{children}</>;
}

export function defaultPathForRole(role: UserRole) {
  if (role === 'driver') return '/driver';
  if (role === 'admin') return '/admin';
  return '/shop';
}
