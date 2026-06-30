<?php

namespace App\Modules\Settings\Services;

class StorefrontConfigService
{
    /**
     * @return array<string, mixed>
     */
    public function publicConfig(): array
    {
        return [
            'store' => config('white_label.store'),
            'contact' => config('white_label.contact'),
            'theme' => config('white_label.theme'),
            'seo' => config('white_label.seo'),
            'features' => config('features.public'),
            'integrations' => config('white_label.integrations.public'),
        ];
    }
}
