<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\NewsController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::prefix('categories')->group(function () {
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

Route::prefix('news')->group(function () {
    Route::get('/', [NewsController::class, 'index'])->name('news.index');
    Route::get('/{id}', [NewsController::class, 'show'])->name('news.show');
    Route::get('/category/{id}', [NewsController::class, 'getNewsByCategory'])->name('news.category'); 
    Route::get('/subcategory/{id}', [NewsController::class, 'getNewsBySubcategory'])->name('news.subcategory');
    Route::get('/search/{query}', [NewsController::class, 'getNewsByTitle'])->name('news.search');
    Route::post('/', [NewsController::class, 'store'])->name('news.store');
    Route::put('/{id}', [NewsController::class, 'update'])->name('news.update');
    Route::delete('/{id}', [NewsController::class, 'destroy'])->name('news.destroy');

});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
