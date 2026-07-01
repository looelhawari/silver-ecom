<?php

namespace App\Modules\Catalog\Http\Resources;

use App\Modules\Catalog\Models\Category;
use App\Support\Localization\LocalizedFields;
use App\Support\Media\Media;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Category
 */
class CategoryResource extends JsonResource
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
            'description' => LocalizedFields::value($this->resource, 'description', $locale),
            'description_en' => $this->description_en ?? $this->description,
            'description_ar' => $this->description_ar,
            'image' => Media::url($this->image_path),
            'products_count' => $this->whenCounted('products'),
        ];
    }
}
