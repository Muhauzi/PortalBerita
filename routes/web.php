<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\NewsController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('category/main/create', [CategoriesController::class, 'create'])->name('main.create'); // works
    Route::get('category/sub/create/{category_id}', [CategoriesController::class, 'createSub'])->name('sub.create');
    Route::prefix('category')->group(function () {
        Route::prefix('main')->group(function () {
            Route::get('/', [CategoriesController::class, 'index'])->name('main.index');
            Route::get('/{id}', [CategoriesController::class, 'show'])->name('main.show');
            Route::post('/store', [CategoriesController::class, 'store'])->name('main.store');
            Route::get('/{id}/edit', [CategoriesController::class, 'edit'])->name('main.edit');
            Route::put('/{id}', [CategoriesController::class, 'update'])->name('main.update');
            Route::delete('/{id}', [CategoriesController::class, 'destroy'])->name('main.destroy');
        });
        Route::prefix('sub')->group(function () {
            Route::get('/', [CategoriesController::class, 'indexSubCategory'])->name('sub.index.category');
            Route::get('/{category_id}', [CategoriesController::class, 'indexSub'])->name('sub.index');
            // Route::get('/create/{category_id}', [CategoriesController::class, 'createSub'])->name('sub.create');
            Route::get('/{category_id}/{id}', [CategoriesController::class, 'showSub'])->name('sub.show');
            Route::post('/store', [CategoriesController::class, 'storeSub'])->name('sub.store');
            Route::get('/{category_id}/{id}/edit', [CategoriesController::class, 'editSub'])->name('sub.edit');
            Route::put('/update/{category_id}/{id}', [CategoriesController::class, 'updateSub'])->name('sub.update');
            Route::delete('/{category_id}/{id}', [CategoriesController::class, 'destroySub'])->name('sub.destroy');
        });
    });

    Route::prefix('news')->group(function () {
        Route::get('/', [NewsController::class, 'index'])->name('news.index');
        Route::get('/create', [NewsController::class, 'create'])->name('news.create');
        Route::get('/{id}', [NewsController::class, 'show'])->name('news.show');
        Route::post('/store', [NewsController::class, 'store'])->name('news.store');
        Route::get('/{id}/edit', [NewsController::class, 'edit'])->name('news.edit');
        Route::put('/{id}/update', [NewsController::class, 'update'])->name('news.update');
        Route::delete('/{id}', [NewsController::class, 'destroy'])->name('news.destroy');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
