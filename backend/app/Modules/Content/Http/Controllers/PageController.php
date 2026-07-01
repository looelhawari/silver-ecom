<?php

namespace App\Modules\Content\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Content\Http\Resources\PageResource;
use App\Modules\Content\Models\Page;

class PageController extends Controller
{
    public function show(string $slug)
    {
        $page = Page::query()->published()->where('slug', $slug)->firstOrFail();

        return PageResource::make($page);
    }
}
