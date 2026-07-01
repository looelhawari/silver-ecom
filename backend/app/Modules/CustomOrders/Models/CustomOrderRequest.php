<?php

namespace App\Modules\CustomOrders\Models;

use App\Models\User;
use App\Modules\Catalog\Models\SilverType;
use App\Modules\CustomOrders\Enums\CustomOrderStatus;
use App\Modules\Orders\Models\Order;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class CustomOrderRequest extends Model
{
    protected $fillable = [
        'request_code', 'user_id', 'name', 'phone', 'whatsapp', 'email',
        'description', 'silver_type_id', 'expected_weight_grams', 'size',
        'budget_min', 'budget_max', 'notes', 'status', 'admin_notes',
        'customer_message', 'order_id',
    ];

    protected function casts(): array
    {
        return [
            'status' => CustomOrderStatus::class,
            'expected_weight_grams' => 'decimal:2',
            'budget_min' => 'decimal:2',
            'budget_max' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function silverType(): BelongsTo
    {
        return $this->belongsTo(SilverType::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(CustomOrderImage::class);
    }

    public function quote(): HasOne
    {
        return $this->hasOne(CustomOrderQuote::class)->latestOfMany();
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
