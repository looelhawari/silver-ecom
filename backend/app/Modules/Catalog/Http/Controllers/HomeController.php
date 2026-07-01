<?php

namespace App\Modules\Catalog\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Catalog\Http\Resources\CategoryResource;
use App\Modules\Catalog\Http\Resources\ProductListResource;
use App\Modules\Catalog\Http\Resources\SilverTypeResource;
use App\Modules\Catalog\Models\Category;
use App\Modules\Catalog\Models\Product;
use App\Modules\Catalog\Models\SilverType;
use App\Modules\Content\Models\Banner;
use App\Support\Media\Media;
use Illuminate\Http\JsonResponse;

class HomeController extends Controller
{
    public function index(): JsonResponse
    {
        $with = ['category', 'silverType', 'mainImage'];

        return response()->json([
            'data' => [
                'hero_banners' => Banner::query()->active()
                    ->where('placement', 'home_hero')->orderBy('sort_order')->get()
                    ->map(fn ($b) => [
                        'title' => $b->title,
                        'subtitle' => $b->subtitle,
                        'image' => Media::url($b->image_path),
                        'link_url' => $b->link_url,
                    ]),
                'featured_categories' => CategoryResource::collection(
                    Category::active()->orderBy('sort_order')->take(8)->get()
                ),
                'silver_types' => SilverTypeResource::collection(
                    SilverType::active()->orderBy('sort_order')->get()
                ),
                'featured_products' => ProductListResource::collection(
                    Product::active()->featured()->with($with)->latest()->take(8)->get()
                ),
                'new_arrivals' => ProductListResource::collection(
                    Product::active()->with($with)->latest()->take(8)->get()
                ),
                'best_sellers' => ProductListResource::collection(
                    Product::active()->bestSeller()->with($with)->latest()->take(8)->get()
                ),
            ],
        ]);
    }
}
