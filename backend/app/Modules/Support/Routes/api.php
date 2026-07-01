<?php

use App\Modules\Support\Http\Controllers\ContactController;
use Illuminate\Support\Facades\Route;

// Rate-limited to deter contact-form abuse.
Route::post('/contact', [ContactController::class, 'store'])
    ->middleware('throttle:6,1')
    ->name('contact.store');
