<?php

use App\Modules\Settings\Http\Controllers\StorefrontConfigController;
use Illuminate\Support\Facades\Route;

Route::get('/config', StorefrontConfigController::class)->name('config.show');
