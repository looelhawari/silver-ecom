<?php

namespace App\Modules\CustomOrders\Actions;

use App\Modules\CustomOrders\Enums\CustomOrderStatus;
use App\Modules\CustomOrders\Models\CustomOrderRequest;
use App\Modules\Orders\Enums\OrderStatus;
use App\Modules\Orders\Enums\PaymentStatus;
use App\Modules\Orders\Enums\ShippingStatus;
use App\Modules\Orders\Models\Order;
use App\Modules\Orders\Support\OrderCode;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use RuntimeException;

/**
 * Converts an approved custom request (with a quote) into a real order.
 */
class ConvertToOrder
{
    public function handle(CustomOrderRequest $request): Order
    {
        if ($request->order_id) {
            throw new RuntimeException('This request has already been converted to an order.');
        }

        $quote = $request->quote;
        if (! $quote || $quote->final_quote === null) {
            throw new RuntimeException('A final quote is required before converting to an order.');
        }

        return DB::transaction(function () use ($request, $quote): Order {
            $total = (float) $quote->final_quote;

            $order = Order::create([
                'order_code' => OrderCode::generate(),
                'user_id' => $request->user_id,
                'customer_name' => $request->name,
                'customer_phone' => $request->phone,
                'customer_whatsapp' => $request->whatsapp,
                'customer_email' => $request->email,
                'status' => OrderStatus::Confirmed,
                'payment_status' => PaymentStatus::Unpaid,
                'shipping_status' => ShippingStatus::NotStarted,
                'subtotal' => $total,
                'shipping_cost' => 0,
                'total' => $total,
                'currency' => config('white_label.store.currency', 'EGP'),
                'notes' => "Converted from custom request {$request->request_code}.",
                'placed_at' => now(),
            ]);

            $order->items()->create([
                'product_name' => 'Custom silver — '.Str::limit($request->description, 60),
                'silver_type_name' => $request->silverType?->name,
                'weight_in_grams' => $quote->estimated_weight_grams,
                'unit_price' => $total,
                'quantity' => 1,
                'line_total' => $total,
            ]);

            $order->statusHistory()->create([
                'type' => 'order',
                'status' => OrderStatus::Confirmed->value,
                'note' => 'Created from custom request.',
                'visible_to_customer' => true,
            ]);

            $request->update([
                'status' => CustomOrderStatus::ConvertedToOrder,
                'order_id' => $order->id,
            ]);

            return $order;
        });
    }
}
