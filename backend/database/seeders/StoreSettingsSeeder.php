<?php

namespace Database\Seeders;

use App\Modules\Settings\Models\Setting;
use Illuminate\Database\Seeder;

/**
 * Seeds editable store settings into the key-value `settings` table.
 * These complement the env-based white-label config and are admin-editable.
 */
class StoreSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // group, key, value, type, is_public
            ['store', 'website_name', 'Fidda Silver', 'string', true],
            ['store', 'support_email', 'care@fidda-silver.test', 'string', true],
            ['store', 'whatsapp_number', '+20 100 000 0000', 'string', true],
            ['shipping', 'base_cost', 60, 'integer', true],
            ['shipping', 'free_shipping_threshold', 3000, 'integer', true],
            ['orders', 'order_prefix', 'FS', 'string', false],
            ['orders', 'invoice_prefix', 'INV', 'string', false],
            ['tax', 'vat_percentage', 0, 'integer', true],
            ['display', 'show_weight', true, 'boolean', true],
            ['display', 'show_workmanship_fee', false, 'boolean', true],
            ['display', 'show_gram_price', false, 'boolean', true],
            ['system', 'maintenance_mode', false, 'boolean', true],
        ];

        foreach ($settings as [$group, $key, $value, $type, $isPublic]) {
            Setting::updateOrCreate(
                ['group' => $group, 'key' => $key],
                ['value' => $value, 'type' => $type, 'is_public' => $isPublic],
            );
        }
    }
}
