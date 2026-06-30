<?php

namespace App\Providers;

use App\Support\Modules\ModuleRegistry;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class ModuleServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        foreach (ModuleRegistry::all() as $module) {
            if (! $module->hasApiRoutes()) {
                continue;
            }

            $prefix = trim('api/v1/'.$module->apiPrefix, '/');

            Route::middleware('api')
                ->prefix($prefix)
                ->name('api.v1.'.$module->slug.'.')
                ->group($module->apiRoutesPath());
        }
    }
}
