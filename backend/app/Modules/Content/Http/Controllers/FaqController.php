<?php

namespace App\Modules\Content\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Content\Http\Resources\FaqResource;
use App\Modules\Content\Models\Faq;

class FaqController extends Controller
{
    public function index()
    {
        $faqs = Faq::query()->active()->orderBy('sort_order')->get();

        return FaqResource::collection($faqs);
    }
}
