<?php

namespace App\Modules\Checkout\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PlaceOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.variant_id' => ['nullable', 'integer', 'exists:product_variants,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:99'],

            'customer_name' => ['required', 'string', 'max:120'],
            'customer_phone' => ['required', 'string', 'max:30'],
            'customer_whatsapp' => ['nullable', 'string', 'max:30'],
            'customer_email' => ['nullable', 'email', 'max:160'],

            'payment_method_id' => ['required', 'integer', 'exists:payment_methods,id'],
            'notes' => ['nullable', 'string', 'max:1000'],

            'shipping_address' => ['required', 'array'],
            'shipping_address.full_name' => ['required', 'string', 'max:120'],
            'shipping_address.phone' => ['required', 'string', 'max:30'],
            'shipping_address.whatsapp' => ['nullable', 'string', 'max:30'],
            'shipping_address.city' => ['required', 'string', 'max:80'],
            'shipping_address.area' => ['nullable', 'string', 'max:80'],
            'shipping_address.address_line' => ['required', 'string', 'max:255'],
            'shipping_address.building' => ['nullable', 'string', 'max:60'],
            'shipping_address.floor' => ['nullable', 'string', 'max:60'],
            'shipping_address.apartment' => ['nullable', 'string', 'max:60'],
            'shipping_address.notes' => ['nullable', 'string', 'max:500'],
        ];
    }
}
