<?php

use App\Modules\Auth\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

// Registered under /api/v1/auth
Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:10,1')->name('register');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1')->name('login');

Route::middleware('auth:sanctum')->group(function (): void {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::get('/me', [AuthController::class, 'me'])->name('me');
});
