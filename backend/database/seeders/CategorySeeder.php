<?php

namespace Database\Seeders;

use App\Modules\Catalog\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Rings', 'name_ar' => 'خواتم'],
            ['name' => 'Bracelets', 'name_ar' => 'أساور'],
            ['name' => 'Necklaces', 'name_ar' => 'عقود'],
            ['name' => 'Chains', 'name_ar' => 'سلاسل'],
            ['name' => 'Anklets', 'name_ar' => 'خلاخيل'],
            ['name' => 'Earrings', 'name_ar' => 'أقراط'],
            ['name' => 'Pendants', 'name_ar' => 'دلايات'],
            ['name' => 'Sets', 'name_ar' => 'أطقم'],
            ['name' => 'Gifts', 'name_ar' => 'هدايا'],
        ];

        foreach ($categories as $i => $category) {
            Category::updateOrCreate(
                ['slug' => str($category['name'])->slug()->value()],
                [
                    ...$category,
                    'description' => "Handcrafted silver {$category['name']}.",
                    'is_active' => true,
                    'sort_order' => $i,
                ],
            );
        }
    }
}
