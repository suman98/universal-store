<?php

use App\Http\Controllers\Vendor\CsRowController;
use App\Http\Controllers\Vendor\CsTableController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::prefix('vendor')->name('vendor.')->group(function () {
        Route::resource('tables', CsTableController::class);
        Route::post('tables/{table}/rows', [CsRowController::class, 'store'])->name('rows.store');
        Route::put('tables/{table}/rows/{row}', [CsRowController::class, 'update'])->name('rows.update');
        Route::delete('tables/{table}/rows/{row}', [CsRowController::class, 'destroy'])->name('rows.destroy');
    });
});

require __DIR__.'/settings.php';
