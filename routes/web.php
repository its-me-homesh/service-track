<?php

use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Customer\CustomerController;
use App\Http\Controllers\Service\ServiceController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\User\RoleController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('auth/login', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home')->middleware('guest');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('dashboard')->as('dashboard')->group(function () {
        Route::get('/',DashboardController::class);
    });

    Route::prefix('customers')->as('customers.')->group(function () {
        Route::get('', [CustomerController::class, 'index'])->name('index');
        Route::get('search', [CustomerController::class, 'search'])->name('search');
        Route::post('', [CustomerController::class, 'store'])->name('store');
        Route::get('{id}', [CustomerController::class, 'show'])->name('view');
        Route::put('{id}', [CustomerController::class, 'update'])->name('update');
        Route::delete('{id}', [CustomerController::class, 'delete'])->name('delete');
        Route::patch('{id}/restore', [CustomerController::class, 'restore'])->name('restore');
        Route::patch('{id}/update-service-schedule', [CustomerController::class, 'updateServiceSchedule'])->name('update-service-schedule');
    });

    Route::prefix('services')->as('services.')->group(function () {
        Route::get('/', [ServiceController::class, 'index'])->name('index');
        Route::post('/', [ServiceController::class, 'store'])->name('store');
        Route::get('{id}', [ServiceController::class, 'show'])->name('view');
        Route::put('{id}', [ServiceController::class, 'update'])->name('update');
        Route::delete('{id}', [ServiceController::class, 'delete'])->name('delete');
        Route::patch('{id}/restore', [ServiceController::class, 'restore'])->name('restore');
        Route::patch('{id}/update-service-status', [ServiceController::class, 'updateServiceStatus'])->name('update-service-status');
    });

    Route::prefix('users')->as('users.')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('index');
        Route::post('/', [UserController::class, 'store'])->name('store');
        Route::put('{id}', [UserController::class, 'update'])->name('update');
        Route::delete('{id}', [UserController::class, 'delete'])->name('delete');
        Route::patch('{id}/restore', [UserController::class, 'restore'])->name('restore');
    });

    Route::prefix('roles')->as('roles.')->group(function () {
        Route::get('/', [RoleController::class, 'index'])->name('index');
        Route::post('/', [RoleController::class, 'store'])->name('store');
        Route::put('{id}', [RoleController::class, 'update'])->name('update');
        Route::delete('{id}', [RoleController::class, 'delete'])->name('delete');
    });
});

require __DIR__.'/settings.php';
