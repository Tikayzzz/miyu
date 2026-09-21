# MIYU Flow Spa — Booking System (starter)

## What's here
- `apps/api` — NestJS backend: Prisma schema + seed (real MIYU services/prices),
  services/employees/customers/availability/bookings modules, minimal JWT auth.
- `apps/web` — Next.js frontend: landing page, full customer booking flow
  (`/book`), a bare admin bookings list (`/admin`, no auth yet).
- `PROJECT.md` — full spec, phase checklist, brand/pricing reference. Point
  Claude Code at this file for every future session.

## Phases completed here
1. Repo scaffold ✅
2. Prisma schema ✅
3. Seed data (real MIYU services/prices) ✅
4. Availability engine + conflict-safe booking transaction ✅
5. Core CRUD API (services, employees, customers, bookings) ✅ — working-hours/
   days-off/breaks endpoints exist but have no admin UI yet
6. Customer booking flow (frontend) ✅ — functional, minimal styling
7. Admin panel ✅ — JWT login, role-guarded API (ADMIN/MANAGER/STAFF), bookings
   list with status changes, services CRUD, employees CRUD + working hours +
   days off
8. Testing — ⬜ not started

## Creating your first admin login
No signup endpoint exists on purpose — admins are provisioned, not
self-registered. From `apps/api`:
```bash
npx ts-node prisma/create-admin.ts admin@miyuflow-spa.de somePassword123
```
Then log in at `http://localhost:3000/admin/login`.

## Setup
```bash
# 1. install deps
pnpm install   # or: cd apps/api && npm install && cd ../web && npm install

# 2. configure env
cp apps/api/.env.example apps/api/.env      # set DATABASE_URL, JWT_SECRET
cp apps/web/.env.example apps/web/.env.local

# 3. database
cd apps/api
npx prisma migrate dev --name init
npx prisma db seed

# 4. run
pnpm dev:api    # http://localhost:3001
pnpm dev:web    # http://localhost:3000
```

## Known gaps to hand to Claude Code next
- No email notifications on booking creation (Notification model exists, unused).
- STAFF role can view bookings but has no restriction to "own bookings only" yet.
- Employee-service assignment (which employee can perform which service) has
  no admin UI yet — only the API endpoint (`POST /employees/:id/services/:serviceId`).
- No breaks-management UI (API endpoint exists: `POST /employees/:id/breaks`).
- No automated tests.
- Frontend has no loading/error states beyond the basics shown.

Ask Claude Code: "Read PROJECT.md and README.md, then do Phase 8 (integration + edge-case tests)."
