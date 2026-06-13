<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PublicController;
use App\Http\Controllers\Api\GooglePlacesController;
use App\Http\Controllers\Api\WasteBankAuthController;

// Health
Route::get('/health', fn() => response()->json(['status' => 'ok', 'service' => 'bank-sampah-id']));

// Public endpoints (no auth)
Route::get('/waste-types', [PublicController::class, 'wasteTypes']);
Route::get('/waste-types/{id}', [PublicController::class, 'wasteType']);
Route::post('/calculator', [PublicController::class, 'calculator']);

Route::get('/waste-banks', [PublicController::class, 'wasteBanks']);
Route::get('/waste-banks/{id}', [PublicController::class, 'wasteBank']);

Route::get('/vendors', [PublicController::class, 'vendors']);
Route::get('/vendors/{id}', [PublicController::class, 'vendor']);

Route::get('/guides', [PublicController::class, 'guides']);
Route::get('/guides/{id}', [PublicController::class, 'guide']);

Route::get('/price-sources', [PublicController::class, 'priceSources']);
Route::get('/external-prices', [PublicController::class, 'externalPrices']);
Route::get('/google/waste-banks', [GooglePlacesController::class, 'wasteBanks']);

// Waste bank auth + dashboard
Route::post('/waste-bank/login', [WasteBankAuthController::class, 'login']);
Route::middleware('auth:waste_bank')->group(function () {
    Route::post('/waste-bank/logout', [WasteBankAuthController::class, 'logout']);
    Route::patch('/waste-bank/profile', [WasteBankAuthController::class, 'profile']);
    Route::post('/waste-bank/catalog', [WasteBankAuthController::class, 'catalog']);
});
