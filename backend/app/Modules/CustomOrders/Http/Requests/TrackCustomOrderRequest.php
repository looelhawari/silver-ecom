<?php

namespace App\Modules\CustomOrders\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TrackCustomOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'request_code' => ['required', 'string', 'max:40'],
            'phone' => ['required', 'string', 'max:30'],
        ];
    }
}
