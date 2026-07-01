<?php

namespace App\Modules\Shipping\Models;

use App\Modules\Orders\Models\Order;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShippingAddress extends Model
{
    protected $fillable = [
        'order_id', 'full_name', 'phone', 'whatsapp', 'city', 'area',
        'address_line', 'building', 'floor', 'apartment', 'notes',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
