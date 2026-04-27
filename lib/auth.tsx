'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type UserRole = 'user' | 'driver' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  username: string;
  email: string;
  phone: string;
  driverId?: string;
}

interface DemoAccount extends AuthUser {
  password: string;
}

export const demoAccounts: DemoAccount[] = [
  {
    id: 'u-demo',
    name: 'Amira Haddad',
    role: 'user',
    username: 'amira',
    email: 'amira@sultan.test',
    phone: '8135550201',
    password: 'user123',
  },
  {
    id: 'driver-omar',
    name: 'Omar K.',
    role: 'driver',
    username: 'omar',
    email: 'omar@sultan.test',
    phone: '8135550142',
    password: 'driver123',
    driverId: 'd-omar',
  },
  {
    id: 'driver-layla',
    name: 'Layla S.',
    role: 'driver',
    username: 'layla',
    email: 'layla@sultan.test',
    phone: '8135550177',
    password: 'driver123',
    driverId: 'd-layla',
  },
  {
    id: 'admin-demo',
    name: 'Baha',
    role: 'admin',
    username: 'admin',
    email: 'admin@sultan.test',
    phone: '8135550100',
    password: 'admin123',
  },
];

interface AuthContextValue {
  user: AuthUser | null;
  ready: boolean;
  login: (identifier: string, password: string) => boolean;
  createCustomerAccount: (details: {
    name: string;
    phone: string;
    email?: string;
    password: string;
  }) => AuthUser;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = 'sultan.auth.user';
const ACCOUNTS_KEY = 'sultan.auth.createdAccounts';

function normalizeIdentifier(value: string) {
  return value.trim().toLowerCase().replace(/[^\d@a-z._-]/g, '');
}

function withoutPassword(account: DemoAccount): AuthUser {
  const { password: _password, ...user } = account;
  return user;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [createdAccounts, setCreatedAccounts] = useState<DemoAccount[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const storedAccounts = window.localStorage.getItem(ACCOUNTS_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    if (storedAccounts) {
      try {
        setCreatedAccounts(JSON.parse(storedAccounts));
      } catch {
        window.localStorage.removeItem(ACCOUNTS_KEY);
      }
    }
    setReady(true);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      ready,
      login(identifier, password) {
        const normalized = normalizeIdentifier(identifier);
        const account = [...demoAccounts, ...createdAccounts].find((candidate) => {
          const identifiers = [candidate.username, candidate.email, candidate.phone].map(normalizeIdentifier);
          return identifiers.includes(normalized) && candidate.password === password;
        });
        if (!account) return false;
        const nextUser = withoutPassword(account);
        setUser(nextUser);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
        return true;
      },
      createCustomerAccount(details) {
        const phone = details.phone.trim();
        const email = details.email?.trim() ?? '';
        const account: DemoAccount = {
          id: `u-${Date.now()}`,
          name: details.name.trim() || 'Sultan customer',
          role: 'user',
          username: normalizeIdentifier(email || phone),
          email,
          phone,
          password: details.password,
        };
        const nextAccounts = [
          ...createdAccounts.filter(
            (candidate) =>
              normalizeIdentifier(candidate.phone) !== normalizeIdentifier(phone) &&
              (!email || normalizeIdentifier(candidate.email) !== normalizeIdentifier(email))
          ),
          account,
        ];
        const nextUser = withoutPassword(account);
        setCreatedAccounts(nextAccounts);
        setUser(nextUser);
        window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(nextAccounts));
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
        return nextUser;
      },
      logout() {
        setUser(null);
        window.localStorage.removeItem(STORAGE_KEY);
      },
    }),
    [createdAccounts, ready, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
