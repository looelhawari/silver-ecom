<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Seeds the initial super-admin account used to sign into the Filament panel.
 *
 * Credentials come from env (ADMIN_EMAIL / ADMIN_PASSWORD) so they are never
 * hardcoded for real deployments. The local default is documented in the README
 * and MUST be changed before going to production.
 */
class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $email = (string) env('ADMIN_EMAIL', 'admin@fidda-silver.test');
        $password = (string) env('ADMIN_PASSWORD', 'password');

        $admin = User::updateOrCreate(
            ['email' => $email],
            [
                'name' => (string) env('ADMIN_NAME', 'Store Owner'),
                'password' => Hash::make($password),
                'email_verified_at' => now(),
            ],
        );

        $admin->syncRoles(['super-admin']);
    }
}
