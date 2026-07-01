<?php

namespace Database\Seeders;

use App\Modules\Payments\Models\PaymentMethod;
use Illuminate\Database\Seeder;

class PaymentMethodSeeder extends Seeder
{
    public function run(): void
    {
        $methods = [
            [
                'code' => 'cod',
                'name' => 'Cash on Delivery',
                'name_ar' => 'الدفع عند الاستلام',
                'instructions' => 'Pay in cash to the courier when your order arrives.',
                'requires_proof' => false,
            ],
            [
                'code' => 'vodafone_cash',
                'name' => 'Vodafone Cash',
                'name_ar' => 'فودافون كاش',
                'instructions' => 'Send the order total to the wallet number below, then upload the transfer screenshot.',
                'account_details' => '01000000000',
                'requires_proof' => true,
            ],
            [
                'code' => 'instapay',
                'name' => 'InstaPay',
                'name_ar' => 'انستا باي',
                'instructions' => 'Transfer the total via InstaPay to the handle below, then upload the receipt.',
                'account_details' => 'fidda@instapay',
                'requires_proof' => true,
            ],
            [
                'code' => 'bank_transfer',
                'name' => 'Bank Transfer',
                'name_ar' => 'تحويل بنكي',
                'instructions' => 'Transfer to the bank account below and upload the transfer confirmation.',
                'account_details' => 'Bank: —  |  Account: —  |  IBAN: —',
                'requires_proof' => true,
            ],
        ];

        foreach ($methods as $i => $method) {
            PaymentMethod::updateOrCreate(
                ['code' => $method['code']],
                [...$method, 'is_active' => true, 'sort_order' => $i],
            );
        }
    }
}
