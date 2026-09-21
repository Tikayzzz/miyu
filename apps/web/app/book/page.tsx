'use client';

import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../../lib/api';

type Service = { id: string; name: string; durationMin: number; priceCents: number; addons: Addon[] };
type Addon = { id: string; name: string; extraPriceCents: number; extraDurationMin: number };
type Category = { id: string; name: string; services: Service[] };
type Employee = { id: string; firstName: string; lastName: string };

const STEPS = ['Service', 'Mitarbeiter', 'Termin', 'Daten', 'Bestätigung'] as const;

export default function BookPage() {
  const [step, setStep] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [customer, setCustomer] = useState({ firstName: '', lastName: '', phone: '', email: '', note: '' });
  const [booking, setBooking] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet('/services').then(setCategories).catch(() => setError('Konnte Services nicht laden.'));
  }, []);

  useEffect(() => {
    if (selectedService) {
      apiGet(`/employees?serviceId=${selectedService.id}`).then(setEmployees);
    }
  }, [selectedService]);

  useEffect(() => {
    if (selectedEmployee && date && selectedService) {
      const totalDuration =
        selectedService.durationMin +
        selectedService.addons
          .filter((a) => selectedAddonIds.includes(a.id))
          .reduce((s, a) => s + a.extraDurationMin, 0);
      apiGet(`/availability?employeeId=${selectedEmployee.id}&date=${date}&durationMin=${totalDuration}`).then(
        setSlots,
      );
    }
  }, [selectedEmployee, date, selectedService, selectedAddonIds]);

  async function submitBooking() {
    setError(null);
    try {
      const result = await apiPost('/bookings', {
        employeeId: selectedEmployee!.id,
        serviceId: selectedService!.id,
        addonIds: selectedAddonIds,
        startTime: selectedSlot,
        customer,
      });
      setBooking(result);
      setStep(4);
    } catch {
      setError('Dieser Termin ist leider nicht mehr verfügbar. Bitte wählen Sie eine andere Zeit.');
      setStep(2);
    }
  }

  return (
    <div>
      <ol className="flex justify-between text-xs mb-8 text-stone-500">
        {STEPS.map((s, i) => (
          <li key={s} className={i === step ? 'font-semibold text-ink' : ''}>
            {i + 1}. {s}
          </li>
        ))}
      </ol>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {step === 0 && (
        <div className="space-y-6">
          {categories.map((cat) => (
            <div key={cat.id}>
              <h2 className="font-serif text-xl mb-2">{cat.name}</h2>
              <div className="grid gap-2">
                {cat.services.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedService(s);
                      setSelectedAddonIds([]);
                      setStep(1);
                    }}
                    className="text-left border rounded-lg p-3 hover:border-gold transition"
                  >
                    <div className="flex justify-between">
                      <span>{s.name}</span>
                      <span>€{(s.priceCents / 100).toFixed(2)}</span>
                    </div>
                    <span className="text-sm text-stone-500">{s.durationMin} Min.</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {step === 1 && selectedService && (
        <div className="space-y-3">
          <button
            onClick={() => {
              setSelectedEmployee(null);
              setStep(2);
            }}
            className="w-full text-left border rounded-lg p-3 hover:border-gold"
          >
            Keine Präferenz
          </button>
          {employees.map((e) => (
            <button
              key={e.id}
              onClick={() => {
                setSelectedEmployee(e);
                setStep(2);
              }}
              className="w-full text-left border rounded-lg p-3 hover:border-gold"
            >
              {e.firstName} {e.lastName}
            </button>
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded-lg p-2 w-full"
          />
          <div className="grid grid-cols-3 gap-2">
            {slots.map((slot) => (
              <button
                key={slot}
                onClick={() => {
                  setSelectedSlot(slot);
                  setStep(3);
                }}
                className="border rounded-lg p-2 hover:border-gold text-sm"
              >
                {new Date(slot).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
              </button>
            ))}
          </div>
          {date && slots.length === 0 && <p className="text-sm text-stone-500">Keine freien Termine.</p>}
        </div>
      )}

      {step === 3 && (
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            submitBooking();
          }}
        >
          <input
            required
            placeholder="Vorname"
            className="border rounded-lg p-2 w-full"
            value={customer.firstName}
            onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })}
          />
          <input
            required
            placeholder="Nachname"
            className="border rounded-lg p-2 w-full"
            value={customer.lastName}
            onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })}
          />
          <input
            required
            placeholder="Telefon"
            className="border rounded-lg p-2 w-full"
            value={customer.phone}
            onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
          />
          <input
            required
            type="email"
            placeholder="E-Mail"
            className="border rounded-lg p-2 w-full"
            value={customer.email}
            onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
          />
          <textarea
            placeholder="Anmerkung (optional)"
            className="border rounded-lg p-2 w-full"
            value={customer.note}
            onChange={(e) => setCustomer({ ...customer, note: e.target.value })}
          />
          <button type="submit" className="bg-gold text-white px-6 py-2 rounded-full w-full">
            Termin bestätigen
          </button>
        </form>
      )}

      {step === 4 && booking && (
        <div className="text-center py-10">
          <p className="text-xl mb-2">Vielen Dank, {customer.firstName}!</p>
          <p className="text-stone-600">Ihr Termin wurde angefragt. Eine Bestätigung folgt per E-Mail.</p>
        </div>
      )}
    </div>
  );
}
