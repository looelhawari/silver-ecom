<?php

namespace App\Modules\Catalog\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Catalog\Http\Requests\ProductIndexRequest;
use App\Modules\Catalog\Http\Resources\ProductListResource;
use App\Modules\Catalog\Http\Resources\ProductResource;
use App\Modules\Catalog\Models\Product;

class ProductController extends Controller
{
    public function index(ProductIndexRequest $request)
    {
        $filters = $request->validated();

        $query = Product::query()
            ->active()
            ->with(['category', 'silverType', 'mainImage']);

        if (! empty($filters['q'])) {
            $term = '%'.$filters['q'].'%';
            $query->where(fn ($q) => $q
                ->where('name', 'like', $term)
                ->orWhere('name_ar', 'like', $term)
                ->orWhere('sku', 'like', $term));
        }

        if (! empty($filters['category'])) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $filters['category']));
        }

        if (! empty($filters['silver_type'])) {
            $query->whereHas('silverType', fn ($q) => $q->where('slug', $filters['silver_type']));
        }

        if (isset($filters['price_min'])) {
            $query->where('final_price', '>=', $filters['price_min']);
        }
        if (isset($filters['price_max'])) {
            $query->where('final_price', '<=', $filters['price_max']);
        }
        if (isset($filters['weight_min'])) {
            $query->where('weight_in_grams', '>=', $filters['weight_min']);
        }
        if (isset($filters['weight_max'])) {
            $query->where('weight_in_grams', '<=', $filters['weight_max']);
        }
        if (! empty($filters['featured'])) {
            $query->featured();
        }
        if (! empty($filters['best_sellers'])) {
            $query->bestSeller();
        }

        match ($filters['sort'] ?? 'newest') {
            'price_asc' => $query->orderBy('final_price'),
            'price_desc' => $query->orderByDesc('final_price'),
            'best_sellers' => $query->orderByDesc('is_best_seller')->latest(),
            default => $query->latest(),
        };

        $products = $query->paginate($filters['per_page'] ?? 12)->withQueryString();

        return ProductListResource::collection($products);
    }

    public function show(string $slug)
    {
        $product = Product::query()
            ->active()
            ->with(['category', 'silverType', 'images', 'variants'])
            ->where('slug', $slug)
            ->firstOrFail();

        $related = Product::query()
            ->active()
            ->with(['category', 'silverType', 'mainImage'])
            ->where('id', '!=', $product->id)
            ->where('category_id', $product->category_id)
            ->latest()
            ->take(4)
            ->get();

        return response()->json([
            'data' => ProductResource::make($product),
            'meta' => ['related' => ProductListResource::collection($related)],
        ]);
    }
}
