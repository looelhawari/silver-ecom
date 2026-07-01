<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Super admins implicitly pass every authorization check.
        Gate::before(function ($user, string $ability): ?bool {
            return method_exists($user, 'hasRole') && $user->hasRole('super-admin') ? true : null;
        });

        // Password-reset links point to the Next.js frontend, not the API.
        ResetPassword::createUrlUsing(function ($notifiable, string $token): string {
            $frontend = rtrim((string) config('app.frontend_url'), '/');

            return $frontend.'/reset-password?token='.$token
                .'&email='.urlencode($notifiable->getEmailForPasswordReset());
        });
    }
}
