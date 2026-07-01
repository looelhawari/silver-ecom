<?php

use App\Modules\CustomOrders\Http\Controllers\CustomOrderController;
use Illuminate\Support\Facades\Route;

// Custom silver requests (rate-limited: uploads + guest tracking).
Route::post('/custom-requests', [CustomOrderController::class, 'store'])
    ->middleware('throttle:10,1')
    ->name('custom-requests.store');

Route::post('/custom-requests/track', [CustomOrderController::class, 'track'])
    ->middleware('throttle:12,1')
    ->name('custom-requests.track');
