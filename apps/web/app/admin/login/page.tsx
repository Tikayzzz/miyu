'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveToken } from '../../../lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      setError('E-Mail oder Passwort ist falsch.');
      return;
    }
    const { token, role } = await res.json();
    saveToken(token, role);
    router.push('/admin');
  }

  return (
    <div className="max-w-sm mx-auto py-20">
      <h2 className="font-serif text-2xl mb-6 text-center">Admin Login</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          required
          type="email"
          placeholder="E-Mail"
          className="border rounded-lg p-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          required
          type="password"
          placeholder="Passwort"
          className="border rounded-lg p-2 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" className="bg-gold text-white px-6 py-2 rounded-full w-full">
          Anmelden
        </button>
      </form>
    </div>
  );
}
