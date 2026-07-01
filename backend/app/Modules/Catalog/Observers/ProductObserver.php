<?php

namespace App\Modules\Catalog\Observers;

use App\Modules\AuditLogs\Services\AuditLogger;
use App\Modules\Catalog\Models\Product;
use App\Modules\Catalog\Services\PricingService;

/**
 * Keeps a product's persisted final_price authoritative (recomputed server-side
 * on every save) and records product create/update/delete to the audit trail.
 */
class ProductObserver
{
    public function __construct(
        private readonly PricingService $pricing,
        private readonly AuditLogger $audit,
    ) {}

    public function saving(Product $product): void
    {
        // Ensure a calculated product carries a gram-price snapshot.
        $this->pricing->snapshotGramPrice($product);

        $product->final_price = $this->pricing->calculate($product);
    }

    public function created(Product $product): void
    {
        $this->audit->log('product.created', $product, ['name' => $product->name]);
    }

    public function updated(Product $product): void
    {
        $this->audit->log('product.updated', $product, ['changed' => array_keys($product->getChanges())]);
    }

    public function deleted(Product $product): void
    {
        $this->audit->log('product.deleted', $product, ['name' => $product->name]);
    }
}
