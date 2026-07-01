<?php

namespace App\Modules\Orders\Models;

use App\Models\User;
use App\Modules\Orders\Enums\OrderStatus;
use App\Modules\Orders\Enums\PaymentStatus;
use App\Modules\Orders\Enums\ShippingStatus;
use App\Modules\Payments\Models\PaymentMethod;
use App\Modules\Payments\Models\PaymentProof;
use App\Modules\Orders\Observers\OrderObserver;
use App\Modules\Shipping\Models\ShippingAddress;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[ObservedBy(OrderObserver::class)]
class Order extends Model
{
    protected $fillable = [
        'order_code', 'user_id',
        'customer_name', 'customer_phone', 'customer_whatsapp', 'customer_email',
        'status', 'payment_status', 'shipping_status', 'payment_method_id',
        'subtotal', 'shipping_cost', 'discount_total', 'total', 'currency',
        'tracking_number', 'courier_name', 'shipping_note',
        'notes', 'admin_notes', 'placed_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => OrderStatus::class,
            'payment_status' => PaymentStatus::class,
            'shipping_status' => ShippingStatus::class,
            'subtotal' => 'decimal:2',
            'shipping_cost' => 'decimal:2',
            'discount_total' => 'decimal:2',
            'total' => 'decimal:2',
            'placed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function statusHistory(): HasMany
    {
        return $this->hasMany(OrderStatusHistory::class)->latest();
    }

    public function paymentMethod(): BelongsTo
    {
        return $this->belongsTo(PaymentMethod::class);
    }

    public function paymentProof(): HasOne
    {
        return $this->hasOne(PaymentProof::class)->latestOfMany();
    }

    public function shippingAddress(): HasOne
    {
        return $this->hasOne(ShippingAddress::class);
    }
}
