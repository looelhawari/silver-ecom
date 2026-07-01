<?php

namespace App\Modules\Checkout\Services;

use App\Modules\Catalog\Models\Product;
use App\Modules\Catalog\Models\ProductVariant;
use App\Modules\Orders\Enums\OrderStatus;
use App\Modules\Orders\Enums\PaymentStatus;
use App\Modules\Orders\Enums\ShippingStatus;
use App\Modules\Orders\Models\Order;
use App\Modules\Orders\Support\OrderCode;
use App\Modules\Payments\Models\PaymentMethod;
use App\Modules\Settings\Services\StoreSettings;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Computes order pricing and creates orders. ALL money is derived server-side
 * from the database — the client only sends product/variant ids and quantities,
 * never prices. This is the single trusted source for cart/checkout totals.
 */
class CheckoutService
{
    /**
     * Build a priced summary from raw line items (no persistence).
     *
     * @param  array<int, array{product_id:int, variant_id?:int|null, quantity:int}>  $items
     * @return array{lines: array<int, array<string,mixed>>, subtotal: float, shipping_cost: float, discount_total: float, total: float, currency: string}
     */
    public function quote(array $items): array
    {
        $lines = [];
        $subtotal = 0.0;

        foreach ($items as $row) {
            $product = Product::active()->with('silverType')->find($row['product_id']);
            if (! $product) {
                throw ValidationException::withMessages([
                    'items' => "A product in your cart is no longer available.",
                ]);
            }

            $quantity = max(1, (int) ($row['quantity'] ?? 1));

            if ($product->stock_quantity < $quantity) {
                throw ValidationException::withMessages([
                    'items' => "Not enough stock for {$product->name}.",
                ]);
            }

            $variant = null;
            $adjustment = 0.0;
            if (! empty($row['variant_id'])) {
                $variant = ProductVariant::where('product_id', $product->id)
                    ->find($row['variant_id']);
                $adjustment = $variant ? (float) $variant->price_adjustment : 0.0;
            }

            $unitPrice = round((float) $product->final_price + $adjustment, 2);
            $lineTotal = round($unitPrice * $quantity, 2);
            $subtotal += $lineTotal;

            $lines[] = [
                'product' => $product,
                'variant' => $variant,
                'unit_price' => $unitPrice,
                'quantity' => $quantity,
                'line_total' => $lineTotal,
            ];
        }

        $subtotal = round($subtotal, 2);
        $shipping = $this->shippingCost($subtotal);

        return [
            'lines' => $lines,
            'subtotal' => $subtotal,
            'shipping_cost' => $shipping,
            'discount_total' => 0.0,
            'total' => round($subtotal + $shipping, 2),
            'currency' => config('white_label.store.currency', 'EGP'),
        ];
    }

    /**
     * Create an order from validated checkout input inside a transaction.
     *
     * @param  array<string, mixed>  $data
     */
    public function placeOrder(array $data): Order
    {
        $quote = $this->quote($data['items']);
        $method = PaymentMethod::active()->findOrFail($data['payment_method_id']);

        return DB::transaction(function () use ($data, $quote, $method): Order {
            $order = Order::create([
                'order_code' => OrderCode::generate(),
                'user_id' => $data['user_id'] ?? null,
                'customer_name' => $data['customer_name'],
                'customer_phone' => $data['customer_phone'],
                'customer_whatsapp' => $data['customer_whatsapp'] ?? null,
                'customer_email' => $data['customer_email'] ?? null,
                'status' => OrderStatus::Pending,
                'payment_status' => $method->requires_proof
                    ? PaymentStatus::AwaitingProof
                    : PaymentStatus::Unpaid,
                'shipping_status' => ShippingStatus::NotStarted,
                'payment_method_id' => $method->id,
                'subtotal' => $quote['subtotal'],
                'shipping_cost' => $quote['shipping_cost'],
                'discount_total' => $quote['discount_total'],
                'total' => $quote['total'],
                'currency' => $quote['currency'],
                'notes' => $data['notes'] ?? null,
                'placed_at' => now(),
            ]);

            foreach ($quote['lines'] as $line) {
                /** @var Product $product */
                $product = $line['product'];

                $order->items()->create([
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_sku' => $product->sku,
                    'variant_label' => $line['variant']?->label,
                    'silver_type_name' => $product->silverType?->name,
                    'weight_in_grams' => $product->weight_in_grams,
                    'unit_price' => $line['unit_price'],
                    'quantity' => $line['quantity'],
                    'line_total' => $line['line_total'],
                ]);

                $product->decrement('stock_quantity', $line['quantity']);
            }

            $address = $data['shipping_address'];
            $order->shippingAddress()->create([
                'full_name' => $address['full_name'],
                'phone' => $address['phone'],
                'whatsapp' => $address['whatsapp'] ?? null,
                'city' => $address['city'],
                'area' => $address['area'] ?? null,
                'address_line' => $address['address_line'],
                'building' => $address['building'] ?? null,
                'floor' => $address['floor'] ?? null,
                'apartment' => $address['apartment'] ?? null,
                'notes' => $address['notes'] ?? null,
            ]);

            $order->statusHistory()->create([
                'type' => 'order',
                'status' => OrderStatus::Pending->value,
                'note' => 'Order placed.',
                'visible_to_customer' => true,
            ]);

            return $order;
        });
    }

    private function shippingCost(float $subtotal): float
    {
        $base = (float) (StoreSettings::get('shipping.base_cost', 60));
        $threshold = (float) (StoreSettings::get('shipping.free_shipping_threshold', 0));

        if ($threshold > 0 && $subtotal >= $threshold) {
            return 0.0;
        }

        return $base;
    }
}
