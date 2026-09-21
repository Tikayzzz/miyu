# MIYU Flow Spa — Booking System

Reference this file at the start of every Claude Code session instead of
re-pasting requirements: "Read PROJECT.md, do Phase N."

## Brand reference
Site: https://miyuflow-spa.de/ (Düsseldorf, DE-language). Dark, minimal,
premium salon aesthetic; serif headline wordmark "MIYU · Flow Spa", warm
neutral/beige tones, generous whitespace. Existing site is marketing-only
(booking currently outsourced to Treatwell) — this app replaces that.

## Customer flow
select service → select employee (or "No preference") → select date/time →
enter customer info → confirm booking → email confirmation

## Stack
- Frontend: Next.js + TypeScript + Tailwind CSS (`apps/web`)
- Backend: NestJS (`apps/api`)
- DB: PostgreSQL + Prisma
- Auth: JWT / HTTP-only cookies
- Email: SMTP or Resend
- Monorepo: pnpm workspaces

## Real services & prices (seed data source)
- **Maniküre**: Deluxe Maniküre 45min/€40 (opt. Shellac/French +€15); MIYU
  Maniküre 20min/€22 (opt. Nagellack +€8, Shellac +€15, Shellac French +€20)
- **Pediküre**: Deluxe Pediküre 70min/€65 (opt. Shellac/French +€15); MIYU
  Pediküre 45min/€38 (same opts as above)
- **Nagel Service** (Acryl/Gel — Neu/Refill): Natur Look €43/€39, French/
  Babyboomer €53/€45, Verlauf/French mit Farbe €58/€50, Cat Eye/Chrome/
  Glitzer €60/€55; Shellac: Farbe €30, French €38; Extras: Strassstein
  +€0.50/Stück, Sticker/Stempel +€2/Finger, 2D Nail Art +€2/Finger, 3D Nail
  Art/Charms +€5/Finger, Matt Finish +€5, 2 Farben +€5, Extra Länge +€5,
  Ablösen +€15, Farbe wechseln +€20
- **Wimpern & Augenbrauen**: Wimpernverlängerung — Classic 1:1 €68, Hybrid
  €78, Volume €88, Mega €108, Refill ab €38; Wimpernlifting €45; Augenbrauen
  Formen €10, Formen+Färben €25
- **Headspa**: Yu 45min/€79, Sora 60min/€99, Tsuki 75min/€119, Miyu Signature
  90min/€139; Extras: Bart-Spa €39, Kaffeepeeling €15, Jelly-Maske €15,
  Kryotherapie €10, Handmassage+Collagen-Maske €15
- **Skincare**: MIYU Glow 60min/€70, MIYU Aqua 90min/€95, MIYU Needling
  120min/€125

## Core entities (Prisma models — see schema.prisma)
users, employees, customers, service_categories, services, addons,
employee_services (M:N), employee_working_hours, employee_days_off,
employee_breaks, bookings, booking_services, notifications

## Booking rules (non-negotiable)
- Backend recalculates duration/end time/price/availability — never trust
  frontend-supplied values.
- Conflict rule: `newStart < existingEnd AND newEnd > existingStart` → reject.
- Concurrent booking attempts on the same slot must be prevented via DB
  transaction/locking/unique constraint, not just app-level checks.
- Total duration for availability = service duration + selected add-ons'
  durations.
- Booking statuses: PENDING, CONFIRMED, COMPLETED, CANCELLED, NO_SHOW.
- Roles: Admin (full access), Manager (bookings/calendar/employees), Staff
  (own schedule only).

## Phase checklist
- [ ] Phase 1: Repo scaffold (this file + schema.prisma are the output)
- [ ] Phase 2: Prisma schema + migration
- [ ] Phase 3: Seed real MIYU services/prices above
- [ ] Phase 4: Availability engine + booking-conflict logic (own module, unit-tested)
- [ ] Phase 5: Remaining CRUD API (services, employees, customers, working-hours, days-off)
- [ ] Phase 6: Customer booking flow frontend
- [ ] Phase 7: Admin panel (auth/roles, dashboard, CRUD, calendar)
- [ ] Phase 8: Integration + edge-case tests (overlaps, days off, breaks, add-ons, concurrency, cancellation, mobile)

## Optional / Phase 2 (post-MVP, not in scope yet)
Online payment/deposit, WhatsApp integration, SMS reminders, Google Calendar
sync, customer accounts, loyalty system, vouchers/discounts, revenue stats,
no-show tracking, multi-location support.
