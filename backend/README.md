# Wastebank App Backend

Laravel backend shell for the Wastebank App baseline.

## Setup

```bash
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

## Health Check

```bash
curl http://127.0.0.1:8000/api/health
```

Expected response:

```json
{"status":"ok","service":"bank-sampah-id"}
```

## Tests

```bash
php artisan test
```
