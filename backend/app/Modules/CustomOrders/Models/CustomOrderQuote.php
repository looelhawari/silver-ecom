<?php

namespace App\Modules\CustomOrders\Models;

use App\Models\User;
use App\Modules\Catalog\Models\SilverType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomOrderQuote extends Model
{
    protected $fillable = [
        'custom_order_request_id', 'estimated_weight_grams', 'silver_type_id',
        'gram_price', 'workmanship_fee', 'extra_cost', 'final_quote',
        'message', 'status', 'created_by',
    ];

    protected function casts(): array
    {
        return [
            'estimated_weight_grams' => 'decimal:2',
            'gram_price' => 'decimal:2',
            'workmanship_fee' => 'decimal:2',
            'extra_cost' => 'decimal:2',
            'final_quote' => 'decimal:2',
        ];
    }

    public function request(): BelongsTo
    {
        return $this->belongsTo(CustomOrderRequest::class, 'custom_order_request_id');
    }

    public function silverType(): BelongsTo
    {
        return $this->belongsTo(SilverType::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
