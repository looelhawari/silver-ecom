<?php

namespace Database\Seeders;

use App\Modules\Catalog\Models\SilverType;
use Illuminate\Database\Seeder;

class SilverTypeSeeder extends Seeder
{
    public function run(): void
    {
        // Gram prices are placeholders (EGP/gram) — the admin updates them anytime.
        $types = [
            ['name' => 'Egyptian Silver', 'name_ar' => 'فضة مصري', 'purity' => '925', 'gram_price' => 42.00],
            ['name' => 'Italian Silver', 'name_ar' => 'فضة إيطالي', 'purity' => '925', 'gram_price' => 55.00],
            ['name' => 'Turkish Silver', 'name_ar' => 'فضة تركي', 'purity' => '925', 'gram_price' => 50.00],
            ['name' => 'Local Silver', 'name_ar' => 'فضة محلي', 'purity' => '925', 'gram_price' => 38.00],
            ['name' => 'Custom Silver', 'name_ar' => 'فضة حسب الطلب', 'purity' => '925', 'gram_price' => 60.00],
        ];

        foreach ($types as $i => $type) {
            SilverType::updateOrCreate(
                ['slug' => str($type['name'])->slug()->value()],
                [...$type, 'is_active' => true, 'sort_order' => $i, 'gram_price_updated_at' => now()],
            );
        }
    }
}
