<?php

use App\Modules\Auth\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

// Registered under /api/v1/auth
Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:10,1')->name('register');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1')->name('login');
Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->middleware('throttle:6,1')->name('forgot-password');
Route::post('/reset-password', [AuthController::class, 'resetPassword'])->middleware('throttle:6,1')->name('reset-password');

Route::middleware('auth:sanctum')->group(function (): void {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::get('/me', [AuthController::class, 'me'])->name('me');
    Route::post('/verify-first-login-otp', [AuthController::class, 'verifyFirstLoginOtp'])
        ->middleware('throttle:6,1')
        ->name('verify-first-login-otp');
});
