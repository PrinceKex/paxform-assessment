<?php

use Illuminate\Support\Facades\Route;

// Web Routes
Route::get('/', function () {
    return view('welcome');
});

// Include API Routes
require __DIR__.'/api.php';
