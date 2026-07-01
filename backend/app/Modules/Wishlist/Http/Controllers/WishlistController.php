<?php

namespace App\Modules\Wishlist\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Catalog\Http\Resources\ProductListResource;
use App\Modules\Catalog\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request)
    {
        $productIds = $request->user()->wishlistItems()->pluck('product_id');

        $products = Product::query()
            ->active()
            ->with(['category', 'silverType', 'mainImage'])
            ->whereIn('id', $productIds)
            ->get();

        return ProductListResource::collection($products);
    }

    public function store(Request $request, Product $product): JsonResponse
    {
        $request->user()->wishlistItems()->firstOrCreate(['product_id' => $product->id]);

        return response()->json(['message' => 'Added to wishlist.'], 201);
    }

    public function destroy(Request $request, Product $product): JsonResponse
    {
        $request->user()->wishlistItems()->where('product_id', $product->id)->delete();

        return response()->json(['message' => 'Removed from wishlist.']);
    }
}
