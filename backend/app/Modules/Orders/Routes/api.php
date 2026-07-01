<?php

use App\Modules\Orders\Http\Controllers\OrderTrackController;
use App\Modules\Payments\Http\Controllers\PaymentProofController;
use Illuminate\Support\Facades\Route;

// Guest order tracking (code + phone), rate-limited to deter enumeration.
Route::post('/orders/track', [OrderTrackController::class, 'track'])
    ->middleware('throttle:12,1')
    ->name('orders.track');

// Customer uploads a payment proof for their order (code + phone verified).
Route::post('/orders/{code}/payment-proof', [PaymentProofController::class, 'store'])
    ->middleware('throttle:10,1')
    ->name('orders.payment-proof');
