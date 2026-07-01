<?php

namespace App\Modules\Catalog\Observers;

use App\Modules\Catalog\Models\Product;
use App\Modules\Catalog\Services\PricingService;

/**
 * Keeps a product's persisted final_price authoritative: every save recomputes it
 * server-side via the PricingService, so admin forms / API can never store a
 * tampered price.
 */
class ProductObserver
{
    public function __construct(private readonly PricingService $pricing) {}

    public function saving(Product $product): void
    {
        // Ensure a calculated product carries a gram-price snapshot.
        $this->pricing->snapshotGramPrice($product);

        $product->final_price = $this->pricing->calculate($product);
    }
}
