<?php

namespace App\Modules\Content\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Modules\Content\Models\Page
 */
class PageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'slug' => $this->slug,
            'title' => $this->title,
            'title_ar' => $this->title_ar,
            'body' => $this->body,
            'body_ar' => $this->body_ar,
            'seo_title' => $this->seo_title,
            'seo_description' => $this->seo_description,
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
