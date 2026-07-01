<?php

namespace App\Modules\Catalog\Http\Resources;

use App\Modules\Catalog\Models\Product;
use App\Support\Localization\LocalizedFields;
use App\Support\Media\Media;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Full product shape for the detail page.
 *
 * @mixin Product
 */
class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $locale = LocalizedFields::locale($request);
        $images = $this->whenLoaded('images', fn () => $this->images
            ->map(fn ($img) => [
                'id' => $img->id,
                'url' => Media::url($img->path),
                'alt' => $img->alt,
                'is_main' => $img->is_main,
            ])->values()->all(), []);

        return [
            'id' => $this->id,
            'name' => LocalizedFields::value($this->resource, 'name', $locale),
            'name_en' => $this->name_en ?? $this->name,
            'name_ar' => $this->name_ar,
            'slug' => $this->slug,
            'sku' => $this->sku,
            'description' => LocalizedFields::value($this->resource, 'description', $locale),
            'description_en' => $this->description_en ?? $this->description,
            'description_ar' => $this->description_ar,
            'care_instructions' => LocalizedFields::value($this->resource, 'care_instructions', $locale),
            'care_instructions_en' => $this->care_instructions_en ?? $this->care_instructions,
            'care_instructions_ar' => $this->care_instructions_ar,
            'price' => (float) $this->final_price,
            'currency' => config('white_label.store.currency', 'EGP'),
            'weight_in_grams' => $this->weight_in_grams ? (float) $this->weight_in_grams : null,
            'workmanship_fee' => $this->when(
                $this->show_workmanship_fee_publicly,
                fn () => (float) $this->workmanship_fee,
            ),
            'stock_quantity' => $this->stock_quantity,
            'in_stock' => $this->isInStock(),
            'is_featured' => $this->is_featured,
            'is_best_seller' => $this->is_best_seller,
            'tags' => $this->tags ?? [],
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
                'purity' => $this->silverType->purity,
            ] : null),
            'images' => $images,
            'main_image' => Media::url($this->main_image_path) ?? ($images[0]['url'] ?? null),
            'variants' => $this->whenLoaded('variants', fn () => $this->variants
                ->map(fn ($v) => [
                    'id' => $v->id,
                    'type' => $v->type,
                    'label' => $v->label,
                    'value' => $v->value,
                    'price_adjustment' => (float) $v->price_adjustment,
                ])->values()->all(), []),
        ];
    }
}
