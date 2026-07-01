<?php

namespace App\Modules\Orders\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Customer-facing order shape (tracking + account). Never exposes admin_notes.
 *
 * @mixin \App\Modules\Orders\Models\Order
 */
class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'order_code' => $this->order_code,
            'status' => ['value' => $this->status->value, 'label' => $this->status->label()],
            'payment_status' => ['value' => $this->payment_status->value, 'label' => $this->payment_status->label()],
            'shipping_status' => ['value' => $this->shipping_status->value, 'label' => $this->shipping_status->label()],
            'subtotal' => (float) $this->subtotal,
            'shipping_cost' => (float) $this->shipping_cost,
            'discount_total' => (float) $this->discount_total,
            'total' => (float) $this->total,
            'currency' => $this->currency,
            'tracking_number' => $this->tracking_number,
            'courier_name' => $this->courier_name,
            'shipping_note' => $this->shipping_note,
            'customer_name' => $this->customer_name,
            'placed_at' => $this->placed_at?->toIso8601String(),
            'payment_method' => $this->whenLoaded('paymentMethod', fn () => $this->paymentMethod ? [
                'code' => $this->paymentMethod->code,
                'name' => $this->paymentMethod->name,
                'instructions' => $this->paymentMethod->instructions,
                'account_details' => $this->paymentMethod->account_details,
            ] : null),
            'items' => $this->whenLoaded('items', fn () => $this->items->map(fn ($item) => [
                'product_name' => $item->product_name,
                'variant_label' => $item->variant_label,
                'unit_price' => (float) $item->unit_price,
                'quantity' => $item->quantity,
                'line_total' => (float) $item->line_total,
            ])->all()),
            'shipping_address' => $this->whenLoaded('shippingAddress', fn () => $this->shippingAddress ? [
                'full_name' => $this->shippingAddress->full_name,
                'phone' => $this->shippingAddress->phone,
                'city' => $this->shippingAddress->city,
                'area' => $this->shippingAddress->area,
                'address_line' => $this->shippingAddress->address_line,
            ] : null),
            'timeline' => $this->whenLoaded('statusHistory', fn () => $this->statusHistory
                ->where('visible_to_customer', true)
                ->map(fn ($h) => [
                    'type' => $h->type,
                    'status' => $h->status,
                    'note' => $h->note,
                    'at' => $h->created_at?->toIso8601String(),
                ])->values()->all()),
        ];
    }
}
