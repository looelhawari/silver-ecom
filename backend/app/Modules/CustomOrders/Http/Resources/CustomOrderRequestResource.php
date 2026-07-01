<?php

namespace App\Modules\CustomOrders\Http\Resources;

use App\Support\Media\Media;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Customer-facing custom request shape (submission + tracking).
 * Exposes the customer-visible quote/message, never internal admin notes.
 *
 * @mixin \App\Modules\CustomOrders\Models\CustomOrderRequest
 */
class CustomOrderRequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $quote = $this->whenLoaded('quote', fn () => $this->quote);

        return [
            'request_code' => $this->request_code,
            'name' => $this->name,
            'description' => $this->description,
            'status' => ['value' => $this->status->value, 'label' => $this->status->label()],
            'silver_type' => $this->whenLoaded('silverType', fn () => $this->silverType?->name),
            'expected_weight_grams' => $this->expected_weight_grams ? (float) $this->expected_weight_grams : null,
            'size' => $this->size,
            'customer_message' => $this->customer_message,
            'images' => $this->whenLoaded('images', fn () => $this->images
                ->map(fn ($img) => Media::url($img->path))->values()->all()),
            'quote' => $quote && in_array($quote->status, ['sent', 'accepted', 'rejected'], true) ? [
                'final_quote' => (float) $quote->final_quote,
                'message' => $quote->message,
                'status' => $quote->status,
            ] : null,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
