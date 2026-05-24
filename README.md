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

- Do not push feature work directly to `main`.
- Branch from `main` using `feature/<feature-name>`.
- Keep one feature per pull request.
- Include a short summary, screenshots for frontend changes, API routes changed, migration/seed changes, and manual test steps.

Suggested feature branches:

- `feature/catalog`
- `feature/calculator`
- `feature/waste-bank-directory`
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
