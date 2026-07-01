<?php

namespace App\Support\Enums;

/**
 * Small helper for string-backed status enums: exposes the list of values and a
 * value => label map (used by validation rules and Filament selects).
 */
trait HasLabels
{
    /** @return array<int, string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /** @return array<string, string> */
    public static function options(): array
    {
        $options = [];
        foreach (self::cases() as $case) {
            $options[$case->value] = $case->label();
        }

        return $options;
    }
}
