<?php

namespace App\Modules\Content\Models;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    protected $fillable = [
        'slug', 'title', 'title_en', 'title_ar',
        'body', 'body_en', 'body_ar', 'content_en', 'content_ar',
        'seo_title', 'seo_title_en', 'seo_title_ar',
        'seo_description', 'seo_description_en', 'seo_description_ar',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
        ];
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }
}
