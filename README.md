# Wastebank App

Minimal runnable baseline for the Bank Sampah group project. This repository intentionally starts small so each feature can be added through a focused pull request.

## Requirements

- PHP 8.2+
- Composer 2+
- Node.js 20+
- npm 10+

## Backend

```bash
cd backend
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

Health check:

```bash
curl http://127.0.0.1:8000/api/health
```

Tests:

```bash
cd backend
php artisan test
```

## Frontend

```bash
cd frontend
npm install
npm start
```

Build:

```bash
cd frontend
npm run build
```

## Pull Request Workflow

Use fork-based pull requests for group work:

1. Fork this repository to your own GitHub account.
2. Clone your fork.
3. Create a branch from your fork's `main`.
4. Build one feature only.
5. Push the branch to your fork.
6. Open a pull request into `PutuReyvan/Wastebank-app:main`.

```bash
git clone https://github.com/<your-username>/Wastebank-app.git
cd Wastebank-app
git checkout -b feature/catalog
```

Do not commit secrets or local files:

- no `.env`
- no API keys
- no `node_modules`
- no `vendor`
- no build output
- no logs/cache files
- no local planning files

Each pull request must include a short summary, screenshots for frontend changes, API routes changed, migration/seed changes, and manual test steps.

First-priority feature PRs:

1. `feature/catalog`
2. `feature/calculator`
3. `feature/waste-bank-directory`

Later feature PRs:

- `feature/vendors`
- `feature/guides`
- `feature/bank-dashboard`
- `feature/admin-panel`

Recommended merge order:

1. Backend schema/domain models
2. Public API endpoints
3. Frontend pages consuming those APIs
4. Admin/dashboard features
5. External integrations

## Baseline Scope

Current baseline includes only:

- Laravel app shell
- `GET /api/health`
- React app shell at `/`
- setup documentation
- ignore rules for local/generated artifacts
