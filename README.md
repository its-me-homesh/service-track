# ServiceTrack

A field service operations platform for managing customers, scheduling services, tracking technician assignments, and maintaining full audit trails.

Built with Laravel 12, React 19, and Inertia.js.

---

## Features

- **Customer Management** — Store customer contact info, product details, and service intervals
- **Service Scheduling** — Create, assign, and track service jobs with status workflows
- **Automatic Scheduling** — Next service date auto-calculated based on configurable service intervals
- **Audit Trails** — Services maintain a full history log with field-level diffs; all records track who created, last modified, and deleted them
- **Role-Based Access Control** — Granular permissions via Spatie Laravel Permission
- **Dashboard Analytics** — Overdue services, upcoming schedules, active jobs, and monthly completions
- **Soft Deletes & Restoration** — Recover deleted records without losing audit history

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | PHP 8.2, Laravel 12 |
| Frontend | React 19, TypeScript, Tailwind CSS 4 |
| Bridge | Inertia.js |
| Auth | Laravel Fortify |
| Permissions | Spatie Laravel Permission |
| UI Components | Radix UI, Lucide React |
| State | Zustand |
| Build | Vite 7 |
| Testing | Pest PHP 4 |
| Database | SQLite (default), configurable |

---

## Requirements

- PHP 8.2+
- Composer
- Node.js 20+
- npm

---

## Installation

**One-command setup:**

```bash
composer run setup
```

This installs dependencies, copies `.env`, generates the app key, creates the SQLite database, runs migrations, and builds assets.

**Or step by step:**

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
```

**Seed demo data (optional):**

```bash
php artisan db:seed
```

This creates demo users, roles, customers, and services.

| Role | Email | Password |
|---|---|---|
| Admin | admin@service.com | password |
| Technician | technician@service.com | password |
| Operator | operator@service.com | password |

---

## Running Locally

```bash
# Start Laravel server, queue listener, log viewer (Pail), and Vite dev server
composer run dev
```

The app will be available at `http://localhost:8000`.

**With Server-Side Rendering:**

```bash
composer run dev:ssr
```

---

## Available Scripts

| Command | Description |
|---|---|
| `composer run dev` | Start full dev environment |
| `composer run dev:ssr` | Full dev environment with Inertia SSR |
| `composer run setup` | One-time project setup |
| `composer run test` | Run test suite |
| `npm run dev` | Vite dev server only |
| `npm run build` | Build production assets |
| `npm run types` | TypeScript type check |
| `npm run lint` | ESLint check |
| `npm run format` | Prettier format |

---

## Project Structure

```
app/
├── Actions/          # Use case / workflow objects (per resource)
├── Enums/            # ServiceStatus, permissions, event types
├── Http/
│   ├── Controllers/  # Thin controllers delegating to Services
│   ├── Requests/     # Form request validation
│   └── Resources/    # API response formatters
├── Models/           # Eloquent models with soft deletes
├── Observers/        # Auto-tracks created_by, updated_by, deleted_by
├── Policies/         # Authorization policies
├── Repositories/     # Data access layer with interfaces
├── Services/         # Business logic coordinating Actions + Repositories
└── Support/
    ├── Calculators/  # Next service date calculation
    ├── Comparisons/  # Change diff builder for audit logs
    └── Validators/   # Service status transition validation

resources/js/
├── pages/            # Inertia page components
├── components/       # Reusable UI components
├── hooks/            # Custom React hooks
├── layouts/          # Page layouts
└── types/            # TypeScript definitions

database/
├── migrations/       # Schema definitions
├── seeders/          # Demo data seeders
└── factories/        # Test data factories
```

---

## Core Domain

**Customer**
- Contact details (name, phone, alternate phone, email, address)
- Product info (model, installation date)
- Service scheduling (interval in days, last service date, next service date — auto-calculated)

**Service**
- Linked to a customer and assigned to a user
- Fields: service date, status, cost, notes
- Full history log on every change

**ServiceHistory** (Audit Log — Services only)
- Event types: `created`, `status_changed`, `updated`, `deleted`, `restored`
- Stores a JSON diff of changed fields for updates
- Immutable — append only

---

## Service Status Workflow

```
pending → in_progress → completed
                      → on_hold     → in_progress
                      → rescheduled → in_progress
       → cancelled
```

Invalid transitions are rejected by `ServiceStatusTransitionValidator`.

---

## Permissions

Permissions are namespaced by resource:

- `customer.*` — create, update, view-any, view, delete, force-delete, restore, update-service-schedule
- `service.*` — create, update, view-any, view, delete, force-delete, restore, update-status
- `user.*` — create, update, view-any, view, delete, restore
- `role.*` — create, update, view-any, delete

Roles and their permission assignments are defined in `database/seeders/PermissionSeeder.php`.

---

## Environment

Key `.env` variables:

```env
APP_NAME=ServiceTrack
APP_DESCRIPTION="Field Service Operations Platform"
DB_CONNECTION=sqlite
SESSION_DRIVER=database
QUEUE_CONNECTION=database
CACHE_STORE=database
MAIL_MAILER=log
```

For production, configure a proper database (`mysql` or `pgsql`), a real mail driver, and set `APP_ENV=production`.

---

## Testing

```bash
composer run test
```

Tests use Pest PHP 4 with an in-memory SQLite database. Test files are in `tests/Feature/` and `tests/Unit/`.
