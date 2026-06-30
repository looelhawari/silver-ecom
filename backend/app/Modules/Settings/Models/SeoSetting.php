<?php

namespace App\Modules\Settings\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['scope', 'scope_identifier', 'title', 'description', 'keywords', 'canonical_url', 'robots', 'image_path', 'structured_data'])]
class SeoSetting extends Model
{
    protected function casts(): array
    {
        return [
            'keywords' => 'array',
            'structured_data' => 'array',
        ];
    }
}
