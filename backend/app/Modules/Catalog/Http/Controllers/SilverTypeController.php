<?php

namespace App\Modules\Catalog\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Catalog\Http\Resources\SilverTypeResource;
use App\Modules\Catalog\Models\SilverType;

class SilverTypeController extends Controller
{
    public function index()
    {
        $types = SilverType::query()->active()->orderBy('sort_order')->get();

        return SilverTypeResource::collection($types);
    }
}
