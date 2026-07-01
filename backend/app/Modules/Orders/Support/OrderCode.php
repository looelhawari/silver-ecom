<?php

namespace App\Modules\Orders\Support;

use App\Modules\Orders\Models\Order;
use App\Modules\Settings\Services\StoreSettings;
use Illuminate\Support\Str;

class OrderCode
{
    /** Generate a unique order code, e.g. FS-260701-AB12C. */
    public static function generate(): string
    {
        $prefix = (string) StoreSettings::get('orders.order_prefix', 'FS');

        do {
            $code = sprintf('%s-%s-%s', $prefix, now()->format('ymd'), strtoupper(Str::random(5)));
        } while (Order::where('order_code', $code)->exists());

        return $code;
    }
}
