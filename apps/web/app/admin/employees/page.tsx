'use client';

import { useEffect, useState } from 'react';
import { apiGet } from '../../../lib/api';
import { authPost } from '../../../lib/auth';

const WEEKDAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

export default function AdminEmployees() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newEmployee, setNewEmployee] = useState({ firstName: '', lastName: '', specialty: '' });
  const [hoursForm, setHoursForm] = useState({ employeeId: '', weekday: 1, startTime: '10:00', endTime: '19:00' });
  const [dayOffForm, setDayOffForm] = useState({ employeeId: '', date: '', reason: '' });
  const [assignForm, setAssignForm] = useState({ employeeId: '', serviceId: '' });

  function load() {
    apiGet('/employees').then(setEmployees).catch(() => setError('Konnte Mitarbeiter nicht laden.'));
    apiGet('/services').then(setCategories).catch(() => setError('Konnte Services nicht laden.'));
  }

  useEffect(load, []);

  async function createEmployee(e: React.FormEvent) {
    e.preventDefault();
    try {
      await authPost('/employees', newEmployee);
      setNewEmployee({ firstName: '', lastName: '', specialty: '' });
      load();
    } catch {
      setError('Erstellen fehlgeschlagen.');
    }
  }

  async function assignService(e: React.FormEvent) {
    e.preventDefault();
    try {
      await authPost(`/employees/${assignForm.employeeId}/services/${assignForm.serviceId}`, {});
    } catch {
      setError('Zuweisung fehlgeschlagen (evtl. schon zugewiesen).');
    }
  }

  async function addWorkingHours(e: React.FormEvent) {
    e.preventDefault();
    try {
      await authPost(`/employees/${hoursForm.employeeId}/working-hours`, {
        hours: [{ weekday: Number(hoursForm.weekday), startTime: hoursForm.startTime, endTime: hoursForm.endTime }],
      });
    } catch {
      setError('Arbeitszeit speichern fehlgeschlagen.');
    }
  }

  async function addDayOff(e: React.FormEvent) {
    e.preventDefault();
    try {
      await authPost(`/employees/${dayOffForm.employeeId}/days-off`, {
        date: dayOffForm.date,
        reason: dayOffForm.reason,
      });
      setDayOffForm({ ...dayOffForm, date: '', reason: '' });
    } catch {
      setError('Urlaubstag eintragen fehlgeschlagen.');
    }
  }

  return (
    <div>
      <h2 className="font-serif text-2xl mb-4">Mitarbeiter</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <div className="space-y-1 mb-8">
        {employees.map((e) => (
          <div key={e.id} className="border rounded p-2 text-sm">
            {e.firstName} {e.lastName} {e.specialty && `— ${e.specialty}`}
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        <form onSubmit={createEmployee} className="space-y-2">
          <h3 className="font-semibold">Neuer Mitarbeiter</h3>
          <input
            required
            placeholder="Vorname"
            className="border rounded p-2 w-full"
            value={newEmployee.firstName}
            onChange={(e) => setNewEmployee({ ...newEmployee, firstName: e.target.value })}
          />
          <input
            required
            placeholder="Nachname"
            className="border rounded p-2 w-full"
            value={newEmployee.lastName}
            onChange={(e) => setNewEmployee({ ...newEmployee, lastName: e.target.value })}
          />
          <input
            placeholder="Spezialität"
            className="border rounded p-2 w-full"
            value={newEmployee.specialty}
            onChange={(e) => setNewEmployee({ ...newEmployee, specialty: e.target.value })}
          />
          <button type="submit" className="bg-gold text-white px-4 py-2 rounded-full w-full text-sm">
            Erstellen
          </button>
        </form>

        <form onSubmit={addWorkingHours} className="space-y-2">
          <h3 className="font-semibold">Arbeitszeit hinzufügen</h3>
          <select
            required
            className="border rounded p-2 w-full"
            value={hoursForm.employeeId}
            onChange={(e) => setHoursForm({ ...hoursForm, employeeId: e.target.value })}
          >
            <option value="">Mitarbeiter</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.firstName} {e.lastName}
              </option>
            ))}
          </select>
          <select
            className="border rounded p-2 w-full"
            value={hoursForm.weekday}
            onChange={(e) => setHoursForm({ ...hoursForm, weekday: Number(e.target.value) })}
          >
            {WEEKDAYS.map((d, i) => (
              <option key={i} value={i}>
                {d}
              </option>
            ))}
          </select>
          <input
            type="time"
            className="border rounded p-2 w-full"
            value={hoursForm.startTime}
            onChange={(e) => setHoursForm({ ...hoursForm, startTime: e.target.value })}
          />
          <input
            type="time"
            className="border rounded p-2 w-full"
            value={hoursForm.endTime}
            onChange={(e) => setHoursForm({ ...hoursForm, endTime: e.target.value })}
          />
          <button type="submit" className="bg-gold text-white px-4 py-2 rounded-full w-full text-sm">
            Speichern
          </button>
        </form>

        <form onSubmit={addDayOff} className="space-y-2">
          <h3 className="font-semibold">Urlaubstag eintragen</h3>
          <select
            required
            className="border rounded p-2 w-full"
            value={dayOffForm.employeeId}
            onChange={(e) => setDayOffForm({ ...dayOffForm, employeeId: e.target.value })}
          >
            <option value="">Mitarbeiter</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.firstName} {e.lastName}
              </option>
            ))}
          </select>
          <input
            required
            type="date"
            className="border rounded p-2 w-full"
            value={dayOffForm.date}
            onChange={(e) => setDayOffForm({ ...dayOffForm, date: e.target.value })}
          />
          <input
            placeholder="Grund (optional)"
            className="border rounded p-2 w-full"
            value={dayOffForm.reason}
            onChange={(e) => setDayOffForm({ ...dayOffForm, reason: e.target.value })}
          />
          <button type="submit" className="bg-gold text-white px-4 py-2 rounded-full w-full text-sm">
            Eintragen
          </button>
        </form>

        <form onSubmit={assignService} className="space-y-2">
          <h3 className="font-semibold">Service zuweisen</h3>
          <select
            required
            className="border rounded p-2 w-full"
            value={assignForm.employeeId}
            onChange={(e) => setAssignForm({ ...assignForm, employeeId: e.target.value })}
          >
            <option value="">Mitarbeiter</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.firstName} {e.lastName}
              </option>
            ))}
          </select>
          <select
            required
            className="border rounded p-2 w-full"
            value={assignForm.serviceId}
            onChange={(e) => setAssignForm({ ...assignForm, serviceId: e.target.value })}
          >
            <option value="">Service</option>
            {categories.map((cat) => (
              <optgroup key={cat.id} label={cat.name}>
                {cat.services.map((s: any) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <button type="submit" className="bg-gold text-white px-4 py-2 rounded-full w-full text-sm">
            Zuweisen
          </button>
        </form>
      </div>
    </div>
  );
}