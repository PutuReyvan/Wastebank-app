<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PublicController;

Route::get('/health', fn() => response()->json(['status' => 'ok', 'service' => 'bank-sampah-id']));
Route::get('/waste-types', [PublicController::class, 'wasteTypes']);
Route::get('/waste-types/{id}', [PublicController::class, 'wasteType']);
Route::post('/calculator', [PublicController::class, 'calculator']);
Route::get('/waste-banks', [PublicController::class, 'wasteBanks']);
Route::get('/waste-banks/{id}', [PublicController::class, 'wasteBank']);
