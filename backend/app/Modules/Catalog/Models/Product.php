<?php

namespace App\Modules\Catalog\Models;

use App\Modules\Catalog\Observers\ProductObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[ObservedBy(ProductObserver::class)]
class Product extends Model
{
    protected $fillable = [
        'name', 'name_ar', 'slug', 'sku', 'category_id', 'silver_type_id',
        'description', 'description_ar', 'care_instructions', 'care_instructions_ar',
        'weight_in_grams', 'stock_quantity',
        'pricing_type', 'fixed_price', 'gram_price_snapshot', 'workmanship_fee',
        'extra_markup', 'discount_amount', 'discount_percentage', 'manual_price_override',
        'final_price', 'show_workmanship_fee_publicly',
        'is_active', 'is_featured', 'is_best_seller',
        'main_image_path', 'tags', 'seo_title', 'seo_description',
    ];

    protected function casts(): array
    {
        return [
            'weight_in_grams' => 'decimal:2',
            'fixed_price' => 'decimal:2',
            'gram_price_snapshot' => 'decimal:2',
            'workmanship_fee' => 'decimal:2',
            'extra_markup' => 'decimal:2',
            'discount_amount' => 'decimal:2',
            'discount_percentage' => 'decimal:2',
            'manual_price_override' => 'decimal:2',
            'final_price' => 'decimal:2',
            'show_workmanship_fee_publicly' => 'boolean',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'is_best_seller' => 'boolean',
            'tags' => 'array',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function silverType(): BelongsTo
    {
        return $this->belongsTo(SilverType::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function mainImage(): HasOne
    {
        return $this->hasOne(ProductImage::class)->where('is_main', true);
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class)->orderBy('sort_order');
    }

    public function isInStock(): bool
    {
        return $this->stock_quantity > 0;
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeBestSeller($query)
    {
        return $query->where('is_best_seller', true);
    }
}
