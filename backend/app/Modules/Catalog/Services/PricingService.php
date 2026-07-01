<?php

namespace App\Modules\Catalog\Services;

use App\Modules\Catalog\Models\Product;

/**
 * Server-side pricing engine. The storefront and admin forms never set the
 * final price directly (except via an explicit manual override) — it is always
 * derived here so the client cannot tamper with prices.
 *
 *   final_price = (gram_price × weight) + workmanship_fee + extra_markup − discount
 *
 * with a manual override taking precedence over everything.
 */
class PricingService
{
    /**
     * Compute the final price for a product from its current attributes.
     */
    public function calculate(Product $product): float
    {
        if ($product->manual_price_override !== null) {
            return $this->round((float) $product->manual_price_override);
        }

        if ($product->pricing_type === 'fixed') {
            $base = (float) ($product->fixed_price ?? 0);
        } else {
            $gramPrice = (float) ($product->gram_price_snapshot
                ?? $product->silverType?->gram_price
                ?? 0);
            $weight = (float) ($product->weight_in_grams ?? 0);
            $base = ($gramPrice * $weight)
                + (float) $product->workmanship_fee
                + (float) $product->extra_markup;
        }

        $discount = (float) $product->discount_amount;
        if ($product->discount_percentage) {
            $discount += $base * ((float) $product->discount_percentage / 100);
        }

        return $this->round(max(0, $base - $discount));
    }

    /**
     * Snapshot the silver gram price onto a calculated product (so future gram
     * price changes don't silently alter historical/cart pricing unless re-saved).
     */
    public function snapshotGramPrice(Product $product): void
    {
        if ($product->pricing_type === 'calculated'
            && $product->gram_price_snapshot === null
            && $product->silver_type_id) {
            $product->gram_price_snapshot = $product->silverType?->gram_price;
        }
    }

    private function round(float $value): float
    {
        return round($value, 2);
    }
}
