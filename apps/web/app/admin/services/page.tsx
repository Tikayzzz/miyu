'use client';

import { useEffect, useState } from 'react';
import { apiGet } from '../../../lib/api';
import { authPost, authPatch } from '../../../lib/auth';

export default function AdminServices() {
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newService, setNewService] = useState({ categoryId: '', name: '', priceCents: 0, durationMin: 0 });

  function load() {
    apiGet('/services').then(setCategories).catch(() => setError('Konnte Services nicht laden.'));
  }

  useEffect(load, []);

  async function createService(e: React.FormEvent) {
    e.preventDefault();
    try {
      await authPost('/services', newService);
      setNewService({ categoryId: '', name: '', priceCents: 0, durationMin: 0 });
      load();
    } catch {
      setError('Erstellen fehlgeschlagen.');
    }
  }

  async function toggleActive(id: string, active: boolean) {
    await authPatch(`/services/${id}`, { active: !active });
    load();
  }

  return (
    <div>
      <h2 className="font-serif text-2xl mb-4">Services</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <div className="space-y-6 mb-10">
        {categories.map((cat) => (
          <div key={cat.id}>
            <h3 className="font-semibold mb-2">{cat.name}</h3>
            <div className="space-y-1">
              {cat.services.map((s: any) => (
                <div key={s.id} className="flex justify-between border rounded p-2 text-sm">
                  <span>
                    {s.name} — €{(s.priceCents / 100).toFixed(2)} — {s.durationMin} Min.
                  </span>
                  <button onClick={() => toggleActive(s.id, true)} className="text-xs underline">
                    Deaktivieren
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h3 className="font-semibold mb-2">Neuer Service</h3>
      <form onSubmit={createService} className="space-y-2 max-w-sm">
        <select
          required
          className="border rounded p-2 w-full"
          value={newService.categoryId}
          onChange={(e) => setNewService({ ...newService, categoryId: e.target.value })}
        >
          <option value="">Kategorie wählen</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          required
          placeholder="Name"
          className="border rounded p-2 w-full"
          value={newService.name}
          onChange={(e) => setNewService({ ...newService, name: e.target.value })}
        />
        <input
          required
          type="number"
          placeholder="Preis (Cent)"
          className="border rounded p-2 w-full"
          value={newService.priceCents || ''}
          onChange={(e) => setNewService({ ...newService, priceCents: Number(e.target.value) })}
        />
        <input
          required
          type="number"
          placeholder="Dauer (Min.)"
          className="border rounded p-2 w-full"
          value={newService.durationMin || ''}
          onChange={(e) => setNewService({ ...newService, durationMin: Number(e.target.value) })}
        />
        <button type="submit" className="bg-gold text-white px-6 py-2 rounded-full w-full">
          Erstellen
        </button>
      </form>
    </div>
  );
}
