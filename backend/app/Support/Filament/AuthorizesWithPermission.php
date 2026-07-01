<?php

namespace App\Support\Filament;

use Illuminate\Support\Facades\Auth;

/**
 * Gates a Filament resource behind a single Spatie permission (e.g. 'products.manage').
 * super-admin passes via the Gate::before bypass. Set $permission on the resource;
 * a null permission means "any authenticated panel user".
 */
trait AuthorizesWithPermission
{
    public static function canViewAny(): bool
    {
        return static::userCan();
    }

    public static function canView($record): bool
    {
        return static::userCan();
    }

    public static function canCreate(): bool
    {
        return static::userCan();
    }

    public static function canEdit($record): bool
    {
        return static::userCan();
    }

    public static function canDelete($record): bool
    {
        return static::userCan();
    }

    public static function canDeleteAny(): bool
    {
        return static::userCan();
    }

    protected static function userCan(): bool
    {
        $permission = static::$permission ?? null;

        return $permission ? (bool) Auth::user()?->can($permission) : true;
    }
}
