<?php

namespace App\Modules\Catalog\Http\Resources;

use App\Modules\Catalog\Models\Product;
use App\Support\Localization\LocalizedFields;
use App\Support\Media\Media;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Lightweight product shape for grids/listings.
 *
 * @mixin Product
 */
class ProductListResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $locale = LocalizedFields::locale($request);

        return [
            'id' => $this->id,
            'name' => LocalizedFields::value($this->resource, 'name', $locale),
            'name_en' => $this->name_en ?? $this->name,
            'name_ar' => $this->name_ar,
            'slug' => $this->slug,
            'price' => (float) $this->final_price,
            'currency' => config('white_label.store.currency', 'EGP'),
            'weight_in_grams' => $this->when((bool) $this->weight_in_grams, fn () => (float) $this->weight_in_grams),
            'in_stock' => $this->isInStock(),
            'is_featured' => $this->is_featured,
            'is_best_seller' => $this->is_best_seller,
            'category' => $this->whenLoaded('category', fn () => $this->category ? [
                'id' => $this->category->id,
                'name' => LocalizedFields::value($this->category, 'name', $locale),
                'name_en' => $this->category->name_en ?? $this->category->name,
                'name_ar' => $this->category->name_ar,
                'slug' => $this->category->slug,
            ] : null),
            'silver_type' => $this->whenLoaded('silverType', fn () => $this->silverType ? [
                'id' => $this->silverType->id,
                'name' => LocalizedFields::value($this->silverType, 'name', $locale),
                'name_en' => $this->silverType->name_en ?? $this->silverType->name,
                'name_ar' => $this->silverType->name_ar,
                'slug' => $this->silverType->slug,
                'purity' => $this->silverType->purity,
            ] : null),
            'image' => Media::url($this->main_image_path) ?? Media::url($this->mainImage?->path),
        ];
    }
}
