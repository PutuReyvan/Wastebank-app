<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'service' => 'bank-sampah-id',
        'status' => 'ok',
    ]);
});
