<?php

namespace App\Support\Media;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Resolves a stored media path to a public URL. Pass-through for absolute URLs.
 */
class Media
{
    public static function url(?string $path, string $disk = 'public'): ?string
    {
        if (blank($path)) {
            return null;
        }

        if (Str::startsWith($path, ['http://', 'https://', '/'])) {
            return $path;
        }

        return Storage::disk($disk)->url($path);
    }
}
