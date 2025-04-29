<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoriesController;

Route::post('categories/', [CategoriesController::class, 'store'])->name('categories.store');
