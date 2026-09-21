'use client';

import { useEffect, useState } from 'react';
import { authGet, authPatch } from '../../lib/auth';

const STATUSES = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  function load() {
    authGet('/bookings')
      .then(setBookings)
      .catch(() => setError('Konnte Buchungen nicht laden.'));
  }

  useEffect(load, []);

  async function updateStatus(id: string, status: string) {
    try {
      await authPatch(`/bookings/${id}/status`, { status });
      load();
    } catch {
      setError('Statusänderung fehlgeschlagen.');
    }
  }

  return (
    <div>
      <h2 className="font-serif text-2xl mb-4">Buchungen</h2>
      {error && <p className="text-red-600">{error}</p>}
      <div className="space-y-2">
        {bookings.map((b) => (
          <div key={b.id} className="border rounded-lg p-3 flex items-center justify-between text-sm gap-3">
            <span>
              {b.customer.firstName} {b.customer.lastName} — {b.employee.firstName}{' '}
              {b.services.map((s: any) => s.service.name).join(', ')}
            </span>
            <span>{new Date(b.startTime).toLocaleString('de-DE')}</span>
            <select
              value={b.status}
              onChange={(e) => updateStatus(b.id, e.target.value)}
              className="border rounded p-1 text-xs"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        ))}
        {bookings.length === 0 && !error && <p className="text-stone-500">Keine Buchungen.</p>}
      </div>
    </div>
  );
}
