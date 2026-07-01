<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * Note: Product creation intentionally fires model events so the
     * Catalog ProductObserver computes each product's final_price.
     */
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
            AdminUserSeeder::class,
            SilverTypeSeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
            PaymentMethodSeeder::class,
            ContentSeeder::class,
            StoreSettingsSeeder::class,
        ]);
    }
}
