<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CategoriesController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::prefix('categories')->withoutMiddleware([\App\Http\Middleware\VerifyCsrfToken::class])->group(function () {
    Route::get('/', [CategoriesController::class, 'index'])->name('categories.index');
    Route::get('/{id}', [CategoriesController::class, 'show'])->name('categories.show');
    Route::post('/', [CategoriesController::class, 'store'])->name('categories.store');
    Route::put('/{id}', [CategoriesController::class, 'update'])->name('categories.update');
    Route::delete('/{id}', [CategoriesController::class, 'destroy'])->name('categories.destroy');    
});

Route::prefix('subcategories')->group(function () {
    Route::get('/{id}', [CategoriesController::class, 'getSubcategories'])->name('subcategories.index');
    Route::get('/show/{id}', [CategoriesController::class, 'getSubcategory'])->name('subcategories.show');
    Route::post('/', [CategoriesController::class, 'storeSubcategory'])->name('subcategories.store');
    Route::put('/{id}', [CategoriesController::class, 'updateSubcategory'])->name('subcategories.update');
    Route::delete('/{id}', [CategoriesController::class, 'destroySubcategory'])->name('subcategories.destroy');
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
