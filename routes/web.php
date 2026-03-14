<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('auth/login', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('dashboard')->as('dashboard')->group(function () {
        Route::get('/', \App\Http\Controllers\Dashboard\DashboardController::class);
    });

    Route::prefix('customers')->as('customers.')->group(function () {
        Route::get('', [\App\Http\Controllers\Customer\CustomerController::class, 'index'])->name('index');
        Route::post('', [\App\Http\Controllers\Customer\CustomerController::class, 'store'])->name('store');
        Route::get('{id}', [\App\Http\Controllers\Customer\CustomerController::class, 'show'])->name('view');
        Route::put('{id}', [\App\Http\Controllers\Customer\CustomerController::class, 'update'])->name('update');
        Route::delete('{id}', [\App\Http\Controllers\Customer\CustomerController::class, 'delete'])->name('delete');
        Route::patch('{id}/restore', [\App\Http\Controllers\Customer\CustomerController::class, 'restore'])->name('restore');
        Route::patch('{id}/update-service-schedule', [\App\Http\Controllers\Customer\CustomerController::class, 'updateServiceSchedule'])->name('update-service-schedule');
    });

    Route::prefix('services')->as('services')->group(function () {
        Route::get('/', function (){
            return Inertia::render('services/index');
        });
    });

    Route::prefix('users')->as('users')->group(function () {
        Route::get('/', function (){
            return Inertia::render('services/index');
        });
    });
});

require __DIR__.'/settings.php';
