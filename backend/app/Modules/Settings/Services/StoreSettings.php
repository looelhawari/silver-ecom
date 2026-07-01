<?php

namespace App\Modules\Settings\Services;

use App\Modules\Settings\Models\Setting;
use Illuminate\Support\Facades\Cache;

/**
 * Read-through accessor for the key-value `settings` table.
 * A plain array map (group.key => value) is cached — not Eloquent models — so it
 * survives any cache driver cleanly. Settings change rarely.
 *
 *   StoreSettings::get('shipping.base_cost', 0);
 */
class StoreSettings
{
    private const CACHE_KEY = 'store_settings.map';
    private const PUBLIC_CACHE_KEY = 'store_settings.public_map';

    /** @var array<string, mixed>|null */
    private static ?array $map = null;

    public static function get(string $dottedKey, mixed $default = null): mixed
    {
        $map = self::map();

        return array_key_exists($dottedKey, $map) ? $map[$dottedKey] : $default;
    }

    /** @return array<string, mixed> */
    public static function publicMap(): array
    {
        return Cache::remember(
            self::PUBLIC_CACHE_KEY,
            now()->addMinutes(5),
            fn () => Setting::query()->where('is_public', true)->get()
                ->mapWithKeys(fn (Setting $s) => ["{$s->group}.{$s->key}" => $s->value])
                ->all(),
        );
    }

    public static function flush(): void
    {
        self::$map = null;
        Cache::forget(self::CACHE_KEY);
        Cache::forget(self::PUBLIC_CACHE_KEY);
    }

    /** @return array<string, mixed> */
    private static function map(): array
    {
        return self::$map ??= Cache::remember(
            self::CACHE_KEY,
            now()->addMinutes(5),
            fn () => Setting::query()->get()
                ->mapWithKeys(fn (Setting $s) => ["{$s->group}.{$s->key}" => $s->value])
                ->all(),
        );
    }
}
