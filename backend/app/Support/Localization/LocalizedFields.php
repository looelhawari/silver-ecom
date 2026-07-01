<?php

namespace App\Support\Localization;

use Illuminate\Http\Request;

final class LocalizedFields
{
    public static function locale(Request $request): string
    {
        $locale = $request->attributes->get('locale', 'en');

        return $locale === 'ar-EG' ? 'ar-EG' : 'en';
    }

    public static function value(object|array|null $item, string $field, string $locale): ?string
    {
        if ($item === null) {
            return null;
        }

        $english = self::read($item, "{$field}_en")
            ?? self::read($item, $field);
        $arabic = self::read($item, "{$field}_ar");

        $preferred = $locale === 'ar-EG' ? $arabic : $english;
        $fallback = $locale === 'ar-EG' ? $english : $arabic;

        return $preferred ?: $fallback;
    }

    private static function read(object|array $item, string $key): ?string
    {
        $value = is_array($item) ? ($item[$key] ?? null) : ($item->{$key} ?? null);

        return is_string($value) && $value !== '' ? $value : null;
    }
}
