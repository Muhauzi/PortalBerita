<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Models\M_main_categories;
use App\Models\M_sub_categories;
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
Route::get('/berita/baca/{slug}', [HomeController::class, 'news'])->name('showNews');
Route::get('/berita/{M_main_categories:name}/{M_sub_categories:name}', [HomeController::class, 'newsBySubCategory'])->name('newsBySubCategory');
Route::get('/berita/{M_main_categories:name}', [HomeController::class, 'newsByCategory'])->name('newsByCategory');
Route::post('/submit_comment', [HomeController::class, 'storeComment'])->middleware('auth');
Route::post('/like_berita/{id}', [HomeController::class, 'likeNews'])->name('likeNews');
Route::delete('/delete_comment/{id}', [HomeController::class, 'deleteComment'])->middleware('auth')->name('deleteComment');


   


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/dashboard.php';
