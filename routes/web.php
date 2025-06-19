<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('welcome');
// })->name('home');

// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('dashboard', function () {
//         return Inertia::render('dashboard');
//     })->name('dashboard');
// });

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('berita/{id}', [HomeController::class, 'news'])->name('showNews');
Route::get('berita/category/{slug}', [HomeController::class, 'newsByCategory'])->name('newsByCategory');
Route::get('berita/subcategory/{slug}', [HomeController::class, 'newsBySubCategory'])->name('newsBySubCategory');   


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/dashboard.php';
