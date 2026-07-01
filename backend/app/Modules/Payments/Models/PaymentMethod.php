<?php

namespace App\Modules\Payments\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PaymentMethod extends Model
{
    protected $fillable = [
        'code', 'name', 'name_ar', 'instructions', 'instructions_ar',
        'account_details', 'requires_proof', 'is_active', 'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'requires_proof' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function proofs(): HasMany
    {
        return $this->hasMany(PaymentProof::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
