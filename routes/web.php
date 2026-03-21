<?php

use App\Http\Controllers\Service\ServiceController;
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
        Route::get('/', \App\Http\Controllers\Dashboard\DashboardController::class);
    });

    Route::prefix('customers')->as('customers.')->group(function () {
        Route::get('', [\App\Http\Controllers\Customer\CustomerController::class, 'index'])->name('index');
        Route::get('search', [\App\Http\Controllers\Customer\CustomerController::class, 'search'])->name('search');
        Route::post('', [\App\Http\Controllers\Customer\CustomerController::class, 'store'])->name('store');
        Route::get('{id}', [\App\Http\Controllers\Customer\CustomerController::class, 'show'])->name('view');
        Route::put('{id}', [\App\Http\Controllers\Customer\CustomerController::class, 'update'])->name('update');
        Route::delete('{id}', [\App\Http\Controllers\Customer\CustomerController::class, 'delete'])->name('delete');
        Route::patch('{id}/restore', [\App\Http\Controllers\Customer\CustomerController::class, 'restore'])->name('restore');
        Route::patch('{id}/update-service-schedule', [\App\Http\Controllers\Customer\CustomerController::class, 'updateServiceSchedule'])->name('update-service-schedule');
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

    Route::prefix('users')->as('users')->group(function () {
        Route::get('/', function (){
            return Inertia::render('services/index');
        });
    });
});

require __DIR__.'/settings.php';
