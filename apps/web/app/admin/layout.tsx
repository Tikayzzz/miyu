'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getToken, getRole, logout } from '../../lib/auth';

const NAV = [
  { href: '/admin', label: 'Buchungen' },
  { href: '/admin/services', label: 'Services' },
  { href: '/admin/employees', label: 'Mitarbeiter' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setReady(true);
      return;
    }
    if (!getToken()) {
      router.push('/admin/login');
    } else {
      setReady(true);
    }
  }, [isLoginPage, router]);

  if (isLoginPage) return children;
  if (!ready) return null;

  const role = getRole();

  return (
    <div>
      <nav className="flex items-center justify-between border-b pb-3 mb-6 text-sm">
        <div className="flex gap-4">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? 'font-semibold text-gold' : 'text-stone-600'}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3 text-stone-500">
          <span className="text-xs uppercase">{role}</span>
          <button
            onClick={() => {
              logout();
              router.push('/admin/login');
            }}
            className="underline"
          >
            Abmelden
          </button>
        </div>
      </nav>
      {children}
    </div>
  );
}
