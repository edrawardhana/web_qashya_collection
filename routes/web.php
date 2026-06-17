<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;

Route::get('/', [ProductController::class, 'index']); // arahkan ke halaman produk

// CRUD Produk
Route::resource('products', App\Http\Controllers\ProductController::class);

Route::resource('transactions', TransactionController::class);
