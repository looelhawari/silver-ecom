<?php

namespace App\Modules\CustomOrders\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCustomOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'phone' => ['required', 'string', 'max:30'],
            'whatsapp' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:160'],
            'description' => ['required', 'string', 'min:5', 'max:3000'],
            'silver_type_id' => ['nullable', 'integer', 'exists:silver_types,id'],
            'expected_weight_grams' => ['nullable', 'numeric', 'min:0', 'max:100000'],
            'size' => ['nullable', 'string', 'max:60'],
            'budget_min' => ['nullable', 'numeric', 'min:0'],
            'budget_max' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string', 'max:1000'],

            // Reference images: only images, capped count + size, validated server-side.
            'images' => ['nullable', 'array', 'max:5'],
            'images.*' => ['file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
        ];
    }
}
