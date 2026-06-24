# To-Do List Task Management Platform

## 📋 Опис завдання

Написати web продукт “To-Do List”, де я як користувач можу створювати собі задачі та змінювати їх статуси. Також має бути можливість поділитись списком своїх задач по емейлу іншому користувачу.

## 🛠️ Вимоги

- **Наявність мобільного адаптиву:** Повна підтримка адаптивного відображення на мобільних пристроях.
- **Наявність тестів:** Написання Unit, E2E та інтеграційних тестів для верифікації бізнес-логіки бекенду та фронтенду.
- **Можливість “шейрингу”:** Надсилання списку завдань іншим користувачам по email.
- **Можливість продемонструвати на співбесіді:** Проект оформлений з чистим кодом, документацією та готовий до демонстрації.

---

## 🚀 Що було виконано & Розширення функціоналу

Для цього проекту було розроблено повноцінне рішення на базі **NestJS (backend) + React (frontend)** в єдиному monorepo-просторі **Nx Workspace**.

### ✅ Що було виконано (Core MVP)

1. **CRUD Задач:** Створення, перегляд, оновлення (назва, опис, категорія, статус) та видалення завдань.
2. **Зміна статусів:** Підтримка життєвого циклу задач: `TODO`, `IN_PROGRESS`, `DONE`.
3. **Шейринг завдань:** Реалізовано ендпоінт `POST /api/tasks/share` та інтерфейс для відправки списку по email за допомогою `nodemailer`. Якщо SMTP не налаштовано, сервіс автоматично логує весь вміст листа у консоль бекенду (mock-mode), що дозволяє легко продемонструвати роботу.
4. **Мобільний адаптив:** Створено преміальний адаптивний інтерфейс на основі CSS Grid та CSS Flexbox з брейкпоінтами для мобільних екранів.
5. **Тестування:**
    - **Jest Unit Tests (Бекенд):** 21 тест для сервісів завдань та категорій (app.service.spec.ts).
    - **Vitest Integration Tests (Фронтенд):** 6 тестів для перевірки рендерингу, пошуку, категорій, створення та видалення задач (app.spec.tsx).
    - **api-e2e Integration Tests (Jest):** 5 наскрізних інтеграційних тестів для API (api.spec.ts).

### ✨ Що було додано для розширення функціоналу (Candidate Extensions)

1. **Категоризація та CRUD Категорій:** Можливість створювати власні категорії (Work, Personal, Study тощо), перейменовувати та видаляти їх (із каскадним очищенням прив'язаних задач).
2. **Фільтрація та Пошук:** Case-insensitive пошук по назві/опису та фільтрація списку задач за статусом та обраною категорією.
3. **Пагінація:** Повна підтримка пагінації на рівні API та інтерфейсу (сортування результатів по сторінках).
4. **Преміальний дизайн (Aesthetics):** Розроблено сучасний інтерфейс у стилі **glassmorphism** з темною темою за замовчуванням, плавними градієнтами, ефектами розмиття фону, hover-анімаціями та фірмовими бейджам

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
