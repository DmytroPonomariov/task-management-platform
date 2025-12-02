# Training Session Planner

Full-stack assignment for showcasing React + NestJS skills inside a single Nx workspace. Candidates ship features for:

- A **session catalog** with category filters
- **Enrollment management** to reserve seats
- An **instructor dashboard** that reveals attendance health

## Getting Started

```bash
yarn install

# start Nest API at http://localhost:3000/api
yarn api

# in another terminal start the React + Vite client at http://localhost:4200
yarn web
```

The frontend points to `/api`, so keep both servers running for a complete experience. Use `yarn nx run-many --target=serve --projects=api,web --parallel` if you prefer a single command.

## API Surface (Nest)

`apps/api` seeds a small in-memory catalog with instructors, sessions, and enrollment rosters. Notable endpoints:

- `GET /api` – workspace summary (health check)
- `GET /api/sessions` – list sessions; pass `?category=Leadership` to filter
- `GET /api/sessions/:id` – fetch a single session with roster details
- `GET /api/sessions/categories` – unique categories for filters
- `POST /api/sessions/:id/enroll` – body `{ participantName, participantEmail }`; enforces capacity & duplicate checks
- `GET /api/instructors` – directory of available instructors
- `GET /api/instructors/:id/attendance` – attendance summary + roster for dashboard widgets

The data layer lives in `apps/api/src/app/app.service.ts` so candidates can easily extend or swap for persistence.

## Frontend (React + Vite)

`apps/web` renders three connected views (`web/src/app/app.tsx`):

1. **Session Catalog** – filter by category, inspect seat counts, choose sessions to manage.
2. **Enrollment Management** – view roster, add participants, and reflect capacity changes in real-time.
3. **Instructor Dashboard** – select an instructor to visualize sessions, enrollment, and attendance totals.

Styling uses a lightweight CSS module (`web/src/app/app.module.css`). Feel free to replace with your own design system.

## Suggested Candidate Extensions

- Persist data to a database layer or Supabase instead of in-memory arrays.
- Add authentication / role-based access around enrollment and dashboard endpoints.
- Build mutation endpoints for marking attendance or editing sessions.
- Expand the dashboard with charts (e.g., Recharts, Victory, or MUI X Charts).
- Cover API + UI behavior with automated tests (Jest, Cypress, Playwright, etc.).

## Nx Commands Reference

- `yarn nx graph` – visualize the dependency graph
- `yarn nx test api` – run backend unit tests
- `yarn nx lint web` – lint the React app
- `yarn nx build web` – production Vite build

Happy shipping! 🚀
