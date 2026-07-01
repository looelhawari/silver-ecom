<?php

use App\Modules\Content\Http\Controllers\FaqController;
use App\Modules\Content\Http\Controllers\PageController;
use Illuminate\Support\Facades\Route;

Route::get('/faqs', [FaqController::class, 'index'])->name('faqs.index');
Route::get('/pages/{slug}', [PageController::class, 'show'])->name('pages.show');
