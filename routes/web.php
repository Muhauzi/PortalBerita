<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoriesController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::prefix('category')->group(function () {

        Route::get('/main/create', function () {
            return Inertia::render('mcategory/Create');
        })->name('main.create');

        Route::post('/main/store', [CategoriesController::class, 'store'])->name('main.store');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
