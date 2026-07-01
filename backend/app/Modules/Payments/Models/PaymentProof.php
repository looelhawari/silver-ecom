<?php

namespace App\Modules\Payments\Models;

use App\Models\User;
use App\Modules\Orders\Models\Order;
use App\Modules\Payments\Observers\PaymentProofObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[ObservedBy(PaymentProofObserver::class)]
class PaymentProof extends Model
{
    protected $fillable = [
        'order_id', 'payment_method_id', 'file_path', 'status',
        'reviewed_by', 'reviewed_at', 'note',
    ];

    protected function casts(): array
    {
        return [
            'reviewed_at' => 'datetime',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function paymentMethod(): BelongsTo
    {
        return $this->belongsTo(PaymentMethod::class);
    }

    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
