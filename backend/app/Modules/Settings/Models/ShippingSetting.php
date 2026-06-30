<?php

namespace App\Modules\Settings\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['provider', 'enabled', 'public_config', 'private_config'])]
class ShippingSetting extends Model
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
