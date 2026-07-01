<?php

namespace App\Modules\Orders\Http\Resources;

use App\Modules\Orders\Models\Order;
use App\Support\Localization\LocalizedFields;
use App\Support\Localization\LocalizedStatusLabels;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Customer-facing order shape (tracking + account). Never exposes admin_notes.
 *
 * @mixin Order
 */
class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $locale = LocalizedFields::locale($request);

        return [
            'order_code' => $this->order_code,
            'status' => LocalizedStatusLabels::status('order', $this->status->value, $locale),
            'payment_status' => LocalizedStatusLabels::status('payment', $this->payment_status->value, $locale),
            'shipping_status' => LocalizedStatusLabels::status('shipping', $this->shipping_status->value, $locale),
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
                'name' => LocalizedFields::value($this->paymentMethod, 'name', $locale),
                'name_en' => $this->paymentMethod->name_en ?? $this->paymentMethod->name,
                'name_ar' => $this->paymentMethod->name_ar,
                'instructions' => LocalizedFields::value($this->paymentMethod, 'instructions', $locale),
                'instructions_en' => $this->paymentMethod->instructions_en ?? $this->paymentMethod->instructions,
                'instructions_ar' => $this->paymentMethod->instructions_ar,
                'account_details' => $this->paymentMethod->account_details,
                'requires_proof' => $this->paymentMethod->requires_proof,
            ] : null),
            'has_payment_proof' => $this->whenLoaded('paymentProof', fn () => $this->paymentProof !== null),
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
