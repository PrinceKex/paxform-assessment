<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FormController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:api')->group(function () {
    // Auth routes
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/refresh', [AuthController::class, 'refresh']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    
    // User routes
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    // Form routes
    Route::prefix('forms')->name('api.forms.')->group(function () {
        Route::get('/', [FormController::class, 'index'])->name('index');
        Route::post('/', [FormController::class, 'store'])->name('store');
        
        Route::prefix('{form}')->group(function () {
            Route::get('/', [FormController::class, 'show'])->name('show');
            Route::put('/', [FormController::class, 'update'])->name('update');
            Route::delete('/', [FormController::class, 'destroy'])->name('destroy');
            Route::post('/toggle-publish', [FormController::class, 'togglePublish'])->name('toggle-publish');
        });
    });
});
