<?php

namespace App\Modules\Catalog\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Catalog\Http\Resources\CategoryResource;
use App\Modules\Catalog\Http\Resources\ProductListResource;
use App\Modules\Catalog\Models\Category;
use App\Modules\Catalog\Models\Product;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::query()
            ->active()
            ->withCount(['products' => fn ($q) => $q->where('is_active', true)])
            ->orderBy('sort_order')
            ->get();

        return CategoryResource::collection($categories);
    }

    public function show(string $slug)
    {
        $category = Category::query()->active()->where('slug', $slug)->firstOrFail();

        $products = Product::query()
            ->active()
            ->with(['category', 'silverType', 'mainImage'])
            ->where('category_id', $category->id)
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return response()->json([
            'data' => CategoryResource::make($category),
            'meta' => [
                'products' => ProductListResource::collection($products),
            ],
        ]);
    }
}
