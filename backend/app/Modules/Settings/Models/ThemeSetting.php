<?php

namespace App\Modules\Settings\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'preset_key', 'tokens', 'assets', 'is_active'])]
class ThemeSetting extends Model
{
    protected function casts(): array
    {
        return [
            'tokens' => 'array',
            'assets' => 'array',
            'is_active' => 'boolean',
        ];
    }
}
