<?php

use App\Modules\Orders\Http\Controllers\OrderTrackController;
use Illuminate\Support\Facades\Route;

// Guest order tracking (code + phone), rate-limited to deter enumeration.
Route::post('/orders/track', [OrderTrackController::class, 'track'])
    ->middleware('throttle:12,1')
    ->name('orders.track');
