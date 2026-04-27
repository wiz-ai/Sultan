'use client';

import { FormEvent, Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LockKeyhole, Mail, Phone, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import { demoAccounts, useAuth } from '@/lib/auth';
import { defaultPathForRole } from '@/components/ProtectedRoute';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-6 py-10">Loading login...</div>}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const ok = login(identifier, password);
    if (!ok) {
      setError('That username, email, phone, or password does not match.');
      return;
    }

    const account = demoAccounts.find(
      (candidate) =>
        [candidate.username, candidate.email, candidate.phone].some(
          (value) => value.toLowerCase() === identifier.trim().toLowerCase()
        ) && candidate.password === password
    );
    const fallback = account ? defaultPathForRole(account.role) : '/shop';
    router.replace(searchParams.get('next') || fallback);
  }

  return (
    <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-6xl items-center gap-10 px-6 py-10 lg:grid-cols-[1fr_420px]">
      <section>
        <div className="chip chip-emerald mb-4">Sultan access</div>
        <h1 className="heading-display text-5xl text-sultan-emerald-900">Sign in to your view</h1>
        <p className="mt-4 max-w-xl text-sultan-ink/70">
          Shoppers see the store, orders, and recipes. Drivers see only their route. Admins can manage the full operation.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <RoleCard icon={ShoppingBag} title="Shopper" note="Shop, orders, recipes" />
          <RoleCard icon={Truck} title="Driver" note="Assigned route only" />
          <RoleCard icon={ShieldCheck} title="Admin" note="Full store view" />
        </div>
      </section>

      <form onSubmit={onSubmit} className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-sultan-sand/60">
        <div className="heading-display text-3xl text-sultan-emerald-900">Login</div>
        <p className="mt-1 text-sm text-sultan-ink/60">Use a username, email, or phone number.</p>

        <label className="mt-6 block">
          <span className="text-xs uppercase tracking-wider text-sultan-ink/60">Username, email, or phone</span>
          <div className="mt-1 flex items-center gap-2 rounded-2xl bg-sultan-parchment/50 px-3 ring-1 ring-sultan-sand focus-within:ring-sultan-emerald-600">
            <Mail className="h-4 w-4 text-sultan-ink/50" />
            <input
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
              placeholder="amira, admin@sultan.test, or 8135550142"
              required
            />
            <Phone className="h-4 w-4 text-sultan-ink/40" />
          </div>
        </label>

        <label className="mt-4 block">
          <span className="text-xs uppercase tracking-wider text-sultan-ink/60">Password</span>
          <div className="mt-1 flex items-center gap-2 rounded-2xl bg-sultan-parchment/50 px-3 ring-1 ring-sultan-sand focus-within:ring-sultan-emerald-600">
            <LockKeyhole className="h-4 w-4 text-sultan-ink/50" />
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
              type="password"
              placeholder="Password"
              required
            />
          </div>
        </label>

        {error && <div className="mt-4 rounded-2xl bg-sultan-spice/10 px-4 py-3 text-sm text-sultan-spice">{error}</div>}

        <button className="btn btn-primary mt-6 w-full justify-center" type="submit">
          Sign in
        </button>

        <div className="mt-6 rounded-2xl bg-sultan-parchment/60 p-4 text-xs text-sultan-ink/65">
          Demo logins: <strong>amira/user123</strong>, <strong>omar/driver123</strong>, <strong>layla/driver123</strong>, or{' '}
          <strong>admin/admin123</strong>.
        </div>
      </form>
    </div>
  );
}

function RoleCard({ icon: Icon, title, note }: { icon: any; title: string; note: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-sultan-sand/60">
      <Icon className="h-5 w-5 text-sultan-emerald-800" />
      <div className="mt-3 font-semibold">{title}</div>
      <div className="text-sm text-sultan-ink/60">{note}</div>
    </div>
  );
}
