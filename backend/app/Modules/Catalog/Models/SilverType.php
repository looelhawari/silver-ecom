<?php

namespace App\Modules\Catalog\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SilverType extends Model
{
    protected $fillable = [
        'name', 'name_ar', 'slug', 'purity', 'gram_price',
        'gram_price_updated_at', 'is_active', 'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'gram_price' => 'decimal:2',
            'gram_price_updated_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        // Track when the gram price last changed (for admin display + audit).
        static::saving(function (SilverType $type): void {
            if ($type->isDirty('gram_price')) {
                $type->gram_price_updated_at = now();
            }
        });

        // Audit gram-price changes (a sensitive pricing input).
        static::updated(function (SilverType $type): void {
            if ($type->wasChanged('gram_price')) {
                app(\App\Modules\AuditLogs\Services\AuditLogger::class)->log(
                    'silver-type.gram_price_changed',
                    $type,
                    ['from' => $type->getOriginal('gram_price'), 'to' => $type->gram_price],
                );
            }
        });
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
