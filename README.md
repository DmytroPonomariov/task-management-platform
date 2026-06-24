

---

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

`apps/api` handles user authentication (optional/extension), task categories, and user tasks. All task and category operations are scoped to the authenticated user.

### Authentication (Optional Extension)
- `POST /api/auth/register` – Register a new account
- `POST /api/auth/login` – Log in and retrieve a JWT token
- `GET  /api/auth/profile` – Retrieve profile info of the authenticated user

### Categories
- `GET    /api/categories` – List categories for the authenticated user
- `POST   /api/categories` – Create a new category
- `PATCH  /api/categories/:id` – Edit a category name
- `DELETE /api/categories/:id` – Delete a category

### Tasks
- `GET    /api/tasks` – List user-owned tasks (supports pagination, search, status, and category filtering)
- `GET    /api/tasks/:id` – Retrieve a specific task by ID
- `POST   /api/tasks` – Create a new task
- `PATCH  /api/tasks/:id` – Update a task (title, description, status, categoryId)
- `DELETE /api/tasks/:id` – Delete a task

#### Supported Query Params for `GET /api/tasks`:
- `?page=1&limit=10` – Pagination (default page size is 10)
- `?search=react` – Case-insensitive search on title and description
- `?categoryId=1` – Filter tasks by category ID
- `?status=DONE` – Filter tasks by status (`TODO`, `IN_PROGRESS`, `DONE`)
- Combined: `?page=1&limit=10&search=react&categoryId=1&status=DONE`

### Sharing
- `POST /api/tasks/share` – Share current task list via email
  - Request body: `{ "email": "friend@example.com" }`

---

## Data Model

### User (Optional Extension)
- `id` (string)
- `email` (string)
- `passwordHash` (string)
- `createdAt` (string/Date)

### Category
- `id` (string)
- `name` (string)
- `userId` (string)
- `createdAt` (string/Date)

### Task
- `id` (string)
- `title` (string)
- `description` (string)
- `status` (`TODO` | `IN_PROGRESS` | `DONE`)
- `userId` (string)
- `categoryId` (string | null)
- `createdAt` (string/Date)
- `updatedAt` (string/Date)

---

## Frontend (React + Vite)

`apps/web` renders three main contexts:

1. **Authentication (Optional Extension)** – Registration and Login page.
2. **Dashboard** – The central task manager view:
   - Create, edit, and delete tasks.
   - Categorize tasks and manage categories (CRUD).
   - Change task statuses (`TODO` / `IN_PROGRESS` / `DONE`).
   - Filter by categories and search tasks in real-time.
   - Navigate results with pagination.
3. **Task Sharing** – Send your current task roster directly to any email with success/error alerts.

Styling uses responsive Vanilla CSS / CSS modules (`web/src/app/app.module.css`) to showcase a polished, modern, premium user interface.

---

## Suggested Candidate Extensions

- **Authentication** (register/login/logout) using JWT to secure tasks and categories.
- **Refresh tokens** for longer authentication sessions.
- **Email verification** step upon registration.
- **Drag & drop task board** for status pipelines.
- **Role-based permissions** or shared workspaces.
- **Real-time updates** via WebSockets.
- **Docker support** for local deployment.
- **CI/CD pipeline** configuration.

---

## Nx Commands Reference

- `yarn nx graph` – visualize the dependency graph
- `yarn nx test api` – run backend unit tests
- `yarn nx lint web` – lint the React app
- `yarn nx build web` – production Vite build

Happy shipping! 🚀
