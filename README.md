# Pilah.in

Pilah.in adalah aplikasi Bank Sampah berbasis web untuk membantu pengguna mengecek estimasi harga sampah, melihat katalog jenis sampah, mencari bank sampah atau vendor, dan membaca panduan daur ulang.

## Demo

Frontend demo: https://pilahin-app.vercel.app

## Tech Stack

- Frontend: React, CRACO, Tailwind CSS
- Backend: Laravel, Filament, Sanctum
- Database: SQLite untuk demo lokal
- Deploy: Vercel untuk frontend, Railway untuk backend

## Local Setup

Backend:

```bash
cd backend
php artisan migrate:fresh --seed
php artisan serve --host=127.0.0.1 --port=8000
```

Frontend:

```bash
cd frontend
npm install --legacy-peer-deps
npm start
```

Local URLs:

- Frontend: http://127.0.0.1:3000
- Backend API: http://127.0.0.1:8000/api/health
