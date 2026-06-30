<?php

namespace App\Modules\Settings\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['key', 'type', 'enabled', 'public_config', 'private_config'])]
class IntegrationSetting extends Model
{
    protected function casts(): array
    {
        return [
            'enabled' => 'boolean',
            'public_config' => 'array',
            'private_config' => 'encrypted:array',
        ];
    }
}
