<?php

namespace App\Modules\Catalog\Http\Resources;

use App\Support\Media\Media;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Modules\Catalog\Models\Category
 */
class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'name_ar' => $this->name_ar,
            'slug' => $this->slug,
            'description' => $this->description,
            'image' => Media::url($this->image_path),
            'products_count' => $this->whenCounted('products'),
        ];
    }
}
