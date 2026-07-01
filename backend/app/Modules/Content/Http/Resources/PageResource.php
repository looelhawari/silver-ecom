<?php

namespace App\Modules\Content\Http\Resources;

use App\Modules\Content\Models\Page;
use App\Support\Localization\LocalizedFields;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Page
 */
class PageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $locale = LocalizedFields::locale($request);

        return [
            'slug' => $this->slug,
            'title' => LocalizedFields::value($this->resource, 'title', $locale),
            'title_en' => $this->title_en ?? $this->title,
            'title_ar' => $this->title_ar,
            'body' => LocalizedFields::value($this->resource, 'body', $locale)
                ?? LocalizedFields::value($this->resource, 'content', $locale),
            'body_en' => $this->body_en ?? $this->content_en ?? $this->body,
            'body_ar' => $this->body_ar,
            'content_en' => $this->content_en ?? $this->body_en ?? $this->body,
            'content_ar' => $this->content_ar ?? $this->body_ar,
            'seo_title' => $this->seo_title,
            'seo_title_en' => $this->seo_title_en ?? $this->seo_title,
            'seo_title_ar' => $this->seo_title_ar,
            'seo_description' => $this->seo_description,
            'seo_description_en' => $this->seo_description_en ?? $this->seo_description,
            'seo_description_ar' => $this->seo_description_ar,
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
