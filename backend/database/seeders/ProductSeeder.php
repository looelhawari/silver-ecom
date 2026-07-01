<?php

namespace Database\Seeders;

use App\Modules\Catalog\Models\Category;
use App\Modules\Catalog\Models\Product;
use App\Modules\Catalog\Models\ProductVariant;
use App\Modules\Catalog\Models\SilverType;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $cat = Category::pluck('id', 'slug');
        $silver = SilverType::pluck('id', 'slug');

        // Placeholder photos from LoremFlickr (real, keyword-relevant, free to hotlink).
        // `lock` keeps each image stable across runs. Replace with real uploads via admin.
        $keyword = [
            'rings' => 'silver,ring', 'bracelets' => 'silver,bracelet',
            'necklaces' => 'silver,necklace', 'chains' => 'silver,chain',
            'anklets' => 'silver,anklet', 'earrings' => 'silver,earrings',
            'pendants' => 'silver,pendant', 'sets' => 'silver,jewelry',
            'gifts' => 'silver,gift',
        ];
        $photo = fn (string $kw, int $lock): string => "https://loremflickr.com/800/800/{$kw}?lock={$lock}";

        // [name, category, silver, weight(g), workmanship, pricing_type, fixed_price,
        //  stock, featured, best_seller, ar_name]
        $products = [
            ['Eternity Band Ring', 'rings', 'italian-silver', 4.5, 120, 'calculated', null, 25, true, true, 'خاتم الخلود'],
            ['Twisted Knot Ring', 'rings', 'egyptian-silver', 3.8, 90, 'calculated', null, 30, false, true, 'خاتم العقدة'],
            ['Solitaire Zircon Ring', 'rings', 'turkish-silver', 3.2, 150, 'calculated', null, 18, true, false, 'خاتم سوليتير'],
            ['Cuban Link Bracelet', 'bracelets', 'italian-silver', 12.0, 200, 'calculated', null, 15, true, true, 'إسورة كوبان'],
            ['Beaded Charm Bracelet', 'bracelets', 'local-silver', 8.5, 130, 'calculated', null, 22, false, false, 'إسورة حبات'],
            ['Figaro Chain Necklace', 'necklaces', 'italian-silver', 16.0, 220, 'calculated', null, 12, true, true, 'عقد فيجارو'],
            ['Heart Pendant Necklace', 'necklaces', 'egyptian-silver', 9.0, 160, 'calculated', null, 20, true, false, 'عقد قلب'],
            ['Snake Chain', 'chains', 'turkish-silver', 7.5, 110, 'calculated', null, 28, false, true, 'سلسلة ثعبان'],
            ['Rope Chain', 'chains', 'egyptian-silver', 10.0, 140, 'calculated', null, 24, false, false, 'سلسلة حبل'],
            ['Star Anklet', 'anklets', 'local-silver', 6.0, 100, 'calculated', null, 26, false, false, 'خلخال نجمة'],
            ['Hoop Earrings', 'earrings', 'italian-silver', 3.0, 90, 'calculated', null, 35, true, false, 'حلق دائري'],
            ['Evil Eye Pendant', 'pendants', 'turkish-silver', 2.5, 80, 'calculated', null, 40, false, true, 'دلاية عين'],
            ['Bridal Silver Set', 'sets', 'italian-silver', 28.0, 600, 'calculated', null, 8, true, true, 'طقم عروس'],
            ['Gift Box — Mini Heart', 'gifts', 'egyptian-silver', null, null, 'fixed', 850.00, 50, true, false, 'علبة هدية'],
        ];

        foreach ($products as $i => $p) {
            [$name, $category, $silverSlug, $weight, $workmanship, $pricingType, $fixed, $stock, $featured, $best, $nameAr] = $p;

            $kw = $keyword[$category] ?? 'silver,jewelry';
            $baseLock = ($i + 1) * 10;

            $product = Product::updateOrCreate(
                ['slug' => str($name)->slug()->value()],
                [
                    'name' => $name,
                    'name_ar' => $nameAr,
                    'sku' => 'FS-'.str_pad((string) ($i + 1), 4, '0', STR_PAD_LEFT),
                    'category_id' => $cat[$category] ?? null,
                    'silver_type_id' => $silver[$silverSlug] ?? null,
                    'description' => "Premium handcrafted {$name} in 925 sterling silver. Polished finish, hallmarked, and ready to gift.",
                    'description_ar' => 'قطعة فضة عيار 925 مصنوعة يدويًا بلمسة نهائية لامعة.',
                    'care_instructions' => 'Keep dry, store in a sealed pouch, and polish with a soft silver cloth.',
                    'weight_in_grams' => $weight,
                    'stock_quantity' => $stock,
                    'pricing_type' => $pricingType,
                    'fixed_price' => $fixed,
                    'workmanship_fee' => $workmanship ?? 0,
                    'extra_markup' => 0,
                    'show_workmanship_fee_publicly' => false,
                    'is_active' => true,
                    'is_featured' => $featured,
                    'is_best_seller' => $best,
                    'main_image_path' => $photo($kw, $baseLock),
                    'tags' => [$category, '925'],
                ],
            );

            // Gallery images (idempotent).
            $product->images()->delete();
            foreach ([0, 1, 2] as $n) {
                $product->images()->create([
                    'path' => $photo($kw, $baseLock + $n),
                    'alt' => $name,
                    'is_main' => $n === 0,
                    'sort_order' => $n,
                ]);
            }

            // Add ring-size variants for rings.
            if ($category === 'rings') {
                foreach (['16', '17', '18', '19', '20'] as $s => $size) {
                    ProductVariant::updateOrCreate(
                        ['product_id' => $product->id, 'type' => 'ring_size', 'value' => $size],
                        ['label' => "Size {$size}", 'price_adjustment' => 0, 'sort_order' => $s],
                    );
                }
            }
        }
    }
}
