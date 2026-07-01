<?php

namespace App\Modules\Catalog\Http\Resources;

use App\Support\Media\Media;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Lightweight product shape for grids/listings.
 *
 * @mixin \App\Modules\Catalog\Models\Product
 */
class ProductListResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'name_ar' => $this->name_ar,
            'slug' => $this->slug,
            'price' => (float) $this->final_price,
            'currency' => config('white_label.store.currency', 'EGP'),
            'weight_in_grams' => $this->when((bool) $this->weight_in_grams, fn () => (float) $this->weight_in_grams),
            'in_stock' => $this->isInStock(),
            'is_featured' => $this->is_featured,
            'is_best_seller' => $this->is_best_seller,
            'category' => $this->whenLoaded('category', fn () => $this->category?->name),
            'silver_type' => $this->whenLoaded('silverType', fn () => $this->silverType?->name),
            'image' => Media::url($this->main_image_path) ?? Media::url($this->mainImage?->path),
        ];
    }
}
