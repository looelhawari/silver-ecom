<?php

use App\Modules\Checkout\Http\Controllers\CheckoutController;
use Illuminate\Support\Facades\Route;

Route::get('/payment-methods', [CheckoutController::class, 'paymentMethods'])->name('payment-methods.index');
Route::post('/checkout/validate', [CheckoutController::class, 'validateCart'])->name('checkout.validate');

// Order placement is rate-limited.
Route::post('/checkout/place-order', [CheckoutController::class, 'placeOrder'])
    ->middleware('throttle:20,1')
    ->name('checkout.place-order');
