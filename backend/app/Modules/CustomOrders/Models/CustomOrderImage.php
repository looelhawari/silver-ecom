<?php

namespace App\Modules\CustomOrders\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomOrderImage extends Model
{
    protected $fillable = ['custom_order_request_id', 'path'];

    public function request(): BelongsTo
    {
        return $this->belongsTo(CustomOrderRequest::class, 'custom_order_request_id');
    }
}
