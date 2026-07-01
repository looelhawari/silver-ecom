<?php

namespace App\Modules\Payments\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Modules\Payments\Models\PaymentMethod
 */
class PaymentMethodResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'name_ar' => $this->name_ar,
            'instructions' => $this->instructions,
            'account_details' => $this->account_details,
            'requires_proof' => $this->requires_proof,
        ];
    }
}
