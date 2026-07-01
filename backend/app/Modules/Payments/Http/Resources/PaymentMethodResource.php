<?php

namespace App\Modules\Payments\Http\Resources;

use App\Modules\Payments\Models\PaymentMethod;
use App\Support\Localization\LocalizedFields;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin PaymentMethod
 */
class PaymentMethodResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $locale = LocalizedFields::locale($request);

        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => LocalizedFields::value($this->resource, 'name', $locale),
            'name_en' => $this->name_en ?? $this->name,
            'name_ar' => $this->name_ar,
            'instructions' => LocalizedFields::value($this->resource, 'instructions', $locale),
            'instructions_en' => $this->instructions_en ?? $this->instructions,
            'instructions_ar' => $this->instructions_ar,
            'account_details' => $this->account_details,
            'requires_proof' => $this->requires_proof,
        ];
    }
}
