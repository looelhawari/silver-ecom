<?php

namespace App\Modules\Settings\Http\Controllers;

use App\Modules\Settings\Services\StorefrontConfigService;
use Illuminate\Http\JsonResponse;

class StorefrontConfigController
{
    public function __invoke(StorefrontConfigService $config): JsonResponse
    {
        return response()->json([
            'data' => $config->publicConfig(),
        ]);
    }
}
