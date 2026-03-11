<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\HistoryPriceAdjusted;
use Closure;
use Illuminate\Support\Facades\Route;

class PrettyRoutesController extends Controller
{
    /**
     * Show pretty routes.
     */
    public function show()
    {
        $middlewareClosure = function ($middleware) {
            return $middleware instanceof Closure ? 'Closure' : $middleware;
        };

        $routes = collect(Route::getRoutes());

        $hide_matching = [
            '#^_debugbar#',
            '#^_ignition#',
            '#^routes$#',
        ];

        foreach ($hide_matching as $regex) {
            $routes = $routes->filter(function ($value, $key) use ($regex) {
                return ! preg_match($regex, $value->uri());
            });
        }

        return view('routes', [
            'routes' => $routes,
            'middlewareClosure' => $middlewareClosure,
        ]);
    }
}
