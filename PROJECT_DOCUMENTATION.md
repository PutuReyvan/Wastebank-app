# Bank Sampah ID Documentation

## 1. What This Project Is

Bank Sampah ID is a civic recycling directory for Indonesian households, currently focused on Jakarta Barat.

The product answers three public questions:

1. What is my recyclable waste worth?
2. Where can I bring it?
3. Who can pick it up?

This is not a marketplace. The platform does not hold funds, process payments, or intermediate transactions. In V1, it is a directory, calculator, admin-managed content system, and reference data platform.

## 2. High-Level Architecture

```text
React Frontend
  -> Public pages
  -> Calculator
  -> Bank/vendor/guide directories
  -> Waste bank operator login/dashboard

Laravel Backend
  -> Public JSON API
  -> Waste bank auth API
  -> Filament admin panel
  -> Database migrations, seeders, import commands

Database
  -> SQLite for local development
  -> Supabase PostgreSQL recommended for staging/production

External Data Sources
  -> Kamibox price snapshot imported into external price tables
  -> Satu Data Jakarta bank-sampah dataset candidate for future location import
```

## 3. Repository Structure

```text
backend/
  Laravel 12 backend, API, Filament admin, migrations, seeders.

frontend/
  React CRA frontend with Tailwind and react-router.

backend-fastapi-old/
  Old FastAPI/Mongo starter backend. Not used by the current app.

memory/
  Product requirement notes and sprint memory.

test_reports/
  Previous frontend QA reports.

tools/
  Local helper/generated files, including Kamibox JSON snapshot and Composer PHAR.
```

## 4. Frontend

The frontend lives in `frontend/`.

Main router:

```text
frontend/src/App.js
```

Routes:

```text
/                       Home
/katalog                Waste type catalog
/katalog/:id            Waste type detail
/kalkulator             Waste value calculator
/bank-sampah            Waste bank directory
/bank-sampah/:id        Waste bank detail
/vendor                 Vendor/pickup directory
/vendor/:id             Vendor detail
/panduan                Recycling guides
/panduan/:id            Guide detail
/login                  Waste bank operator login
/dashboard              Waste bank operator dashboard
/admin                  Redirect helper to admin subdomain/Laravel admin
```

Important files:

```text
frontend/src/components/Layout.jsx
```

Controls the public shell: header, hamburger menu, footer, and outlet layout.

Admin and waste-bank portal links have been removed from the public hamburger menu.

```text
frontend/src/lib/api.js
```

Unified frontend API client. It can use either real Laravel API or mock data depending on:

```text
REACT_APP_USE_REAL_API=true
```

Current API helpers include:

```text
getWasteTypes()
getWasteType(id)
calculateEstimate()
getWasteBanks()
getWasteBank(id)
getVendors()
getVendor(id)
getGuides()
getGuide(id)
getPriceSources()
getExternalPrices()
loginWasteBank()
updateWasteBankProfile()
replaceWasteBankCatalog()
```

```text
frontend/src/lib/subdomain.js
```

Computes admin/public URLs. Production admin should be a subdomain like:

```text
https://admin.banksampah.id
```

For local development, the real admin panel is:

```text
http://127.0.0.1:8001/admin
```

## 5. Backend

The backend lives in `backend/` and is a Laravel 12 app.

Main API routes:

```text
backend/routes/api.php
```

Main public API controller:

```text
backend/app/Http/Controllers/Api/PublicController.php
```

Waste bank auth controller:

```text
backend/app/Http/Controllers/Api/WasteBankAuthController.php
```

Filament admin provider:

```text
backend/app/Providers/Filament/AdminPanelProvider.php
```

## 6. Public API

Base path:

```text
/api
```

Health:

```text
GET /api/health
```

Waste types:

```text
GET  /api/waste-types
GET  /api/waste-types/{id}
POST /api/calculator
```

Calculator request shape:

```json
{
  "items": [
    {
      "waste_type_id": 1,
      "weight_kg": 2
    }
  ]
}
```

Waste banks:

```text
GET /api/waste-banks
GET /api/waste-banks/{id}
```

Filters:

```text
waste_type_id
kecamatan
search
```

Vendors:

```text
GET /api/vendors
GET /api/vendors/{id}
```

Filters:

```text
area
waste_type_id
type
```

Guides:

```text
GET /api/guides
GET /api/guides/{id}
```

External price references:

```text
GET /api/price-sources
GET /api/external-prices
```

External price filters:

```text
source
category
search
```

## 7. Waste Bank Operator Auth

Login:

```text
POST /api/waste-bank/login
```

Protected by Sanctum token:

```text
POST  /api/waste-bank/logout
PATCH /api/waste-bank/profile
POST  /api/waste-bank/catalog
```

Demo credentials from seed data:

```text
melati@banksampah.id
demo1234
```

Note: the frontend currently stores `bs_token`. If running with real API, authenticated requests need to send:

```text
Authorization: Bearer <token>
```

## 8. Admin Panel

The actual admin panel is Laravel Filament, not React.

Local URL:

```text
http://127.0.0.1:8001/admin
```

Production target:

```text
https://admin.banksampah.id
```

Admin credentials from seed data:

```text
admin@banksampah.id
admin1234
```

Filament resources:

```text
WasteTypeResource
  Manage master waste type catalog.

WasteBankResource
  Manage bank sampah directory locations and contact info.

VendorResource
  Manage pickup vendors/NGOs.

RecyclingGuideResource
  Manage educational guide articles.

PriceSourceResource
  Manage external price sources such as Kamibox.

ExternalWastePriceResource
  Manage imported/manual external price reference items.
```

The admin UI has been customized with:

```text
Brand name: Bank Sampah ID
Primary color: Emerald
Grouped navigation
Indonesian labels
Cleaner forms and tables
```

## 9. Database

Local development currently uses SQLite:

```text
backend/database/database.sqlite
```

Production recommendation: Supabase PostgreSQL.

Example Supabase environment file:

```text
backend/.env.supabase.example
```

Use Laravel migrations and Eloquent models for both SQLite and PostgreSQL. Do not rewrite the app to query Supabase directly from React unless there is a strong reason. The recommended pattern is:

```text
React -> Laravel API -> Supabase Postgres
```

## 10. Main Tables And Models

```text
admins
  App\Models\Admin
  Filament admin users.

waste_types
  App\Models\WasteType
  Master catalog of recyclable waste types.

waste_banks
  App\Models\WasteBank
  Physical bank sampah locations.

waste_bank_users
  App\Models\WasteBankUser
  Waste bank operator auth accounts.

waste_bank_catalog
  App\Models\WasteBankCatalog
  Per-bank accepted waste types and prices.

vendors
  App\Models\Vendor
  Pickup vendors/NGOs.

vendor_waste_types
  Pivot between vendors and waste types.

recycling_guides
  App\Models\RecyclingGuide
  Public educational articles.

price_sources
  App\Models\PriceSource
  External price data sources, e.g. Kamibox.

external_waste_prices
  App\Models\ExternalWastePrice
  External/vendor price reference items.

sessions
  Laravel database session storage for production.
```

## 11. External Price Data

Kamibox is currently treated as a vendor-specific reference source.

Source:

```text
https://kamibox.id/category
```

The site has an internal endpoint:

```text
POST https://kamibox.id/category/fetch
```

It requires CSRF/session handling and should not be treated as a stable public API. The current project imports a saved JSON snapshot into the database.

Importer command:

```powershell
cd backend
php artisan import:kamibox-prices --file=../tools/kamibox-fetch.json
```

Default file path if `--file` is omitted:

```text
tools/kamibox-fetch.json
```

Current imported snapshot:

```text
1 price source
59 external price items
```

These prices should be displayed as vendor-specific references, not universal market prices.

## 12. Location Data

A downloaded JSON file points to a Satu Data Jakarta dataset:

```text
Data Lokasi Bank Sampah
```

The JSON file is metadata, not the actual location records. It contains a CSV resource URL, but the checked URL returned `404 Not Found` at the time of inspection.

Future work:

```text
1. Re-download the valid CSV from Satu Data Jakarta.
2. Create an importer for bank locations.
3. Map fields into waste_banks:
   - external_id
   - source_name
   - source_url
   - name
   - address
   - kelurahan
   - kecamatan
   - kota
   - lat
   - lng
   - location_verified_at
```

Google Maps API should not store locations. It only displays or geocodes them. Location data belongs in the database.

## 13. Running Locally

Backend:

```powershell
cd C:\Users\rey\OneDrive\Documents\testing-2\backend

& "$env:LOCALAPPDATA\Microsoft\WinGet\Packages\PHP.PHP.8.4_Microsoft.Winget.Source_8wekyb3d8bbwe\php.exe" artisan serve --host=127.0.0.1 --port=8001
```

Admin:

```text
http://127.0.0.1:8001/admin
```

Frontend:

```powershell
cd C:\Users\rey\OneDrive\Documents\testing-2\frontend
npm start
```

Frontend URL:

```text
http://localhost:3000
```

## 14. Common Local Issues

If `php` is not recognized, use the full PHP path:

```powershell
& "$env:LOCALAPPDATA\Microsoft\WinGet\Packages\PHP.PHP.8.4_Microsoft.Winget.Source_8wekyb3d8bbwe\php.exe" artisan ...
```

If Filament says `Page Expired`, check:

```env
SESSION_DRIVER=file
SESSION_DOMAIN=
APP_URL=http://127.0.0.1:8001
```

Then run:

```powershell
php artisan config:clear
```

If the app is slow locally, the project being inside OneDrive can make Laravel/Filament slower. Moving it to a non-synced folder like `C:\dev\testing-2` may help.

## 15. Migration To Supabase

Recommended production DB: Supabase PostgreSQL.

Steps:

```text
1. Create Supabase project.
2. Copy database connection details.
3. Create backend/.env from backend/.env.supabase.example.
4. Fill DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD.
5. Set DB_SSLMODE=require.
6. Run migrations and seeders.
7. Import Kamibox snapshot if desired.
```

Commands:

```powershell
cd backend
php artisan migrate --seed
php artisan import:kamibox-prices --file=../tools/kamibox-fetch.json
```

## 16. Build And Test

Backend tests:

```powershell
cd backend
php artisan test
```

Backend assets:

```powershell
cd backend
npm run build
```

Frontend build:

```powershell
cd frontend
npm run build
```

## 17. Current State Summary

Implemented:

```text
React public frontend
Laravel API
Filament admin panel
Waste bank operator login/dashboard
SQLite local DB
Seed data
External price tables
Kamibox price snapshot import
Supabase example env
```

Still recommended:

```text
Add Bearer token interceptor to frontend real API requests.
Import valid Satu Data Jakarta location CSV.
Add Google Maps JavaScript markers or improve current map rendering.
Move production DB to Supabase PostgreSQL.
Add stronger tests for API and import commands.
```
