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
            $slug = str($category['name'])->slug()->value();
            Category::updateOrCreate(
                ['slug' => $slug],
                [
                    ...$category,
                    'description' => "Handcrafted silver {$category['name']}.",
                    'image_path' => "https://loremflickr.com/800/600/silver,{$slug}?lock=".($i + 1),
                    'is_active' => true,
                    'sort_order' => $i,
                ],
            );
        }
    }
}
