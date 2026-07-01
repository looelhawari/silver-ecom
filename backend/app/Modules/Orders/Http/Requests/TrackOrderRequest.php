<?php

namespace App\Modules\Orders\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TrackOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'order_code' => ['required', 'string', 'max:40'],
            'phone' => ['required', 'string', 'max:30'],
        ];
    }
}
