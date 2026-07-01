<?php

namespace App\Modules\Content\Models;

use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    protected $fillable = [
        'title', 'title_en', 'title_ar', 'subtitle', 'subtitle_en', 'subtitle_ar',
        'button_text_en', 'button_text_ar', 'image_path',
        'link_url', 'placement', 'sort_order', 'is_active', 'starts_at', 'ends_at',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
        ];
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
