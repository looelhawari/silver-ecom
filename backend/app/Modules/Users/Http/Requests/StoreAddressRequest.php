<?php

namespace App\Modules\Users\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'label' => ['nullable', 'string', 'max:60'],
            'full_name' => ['required', 'string', 'max:120'],
            'phone' => ['required', 'string', 'max:30'],
            'whatsapp' => ['nullable', 'string', 'max:30'],
            'city' => ['required', 'string', 'max:80'],
            'area' => ['nullable', 'string', 'max:80'],
            'address_line' => ['required', 'string', 'max:255'],
            'building' => ['nullable', 'string', 'max:60'],
            'floor' => ['nullable', 'string', 'max:60'],
            'apartment' => ['nullable', 'string', 'max:60'],
            'notes' => ['nullable', 'string', 'max:500'],
            'is_default' => ['boolean'],
        ];
    }
}
