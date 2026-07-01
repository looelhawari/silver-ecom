<?php

namespace App\Modules\Users\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Modules\Users\Models\UserAddress
 */
class UserAddressResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'label' => $this->label,
            'full_name' => $this->full_name,
            'phone' => $this->phone,
            'whatsapp' => $this->whatsapp,
            'city' => $this->city,
            'area' => $this->area,
            'address_line' => $this->address_line,
            'building' => $this->building,
            'floor' => $this->floor,
            'apartment' => $this->apartment,
            'notes' => $this->notes,
            'is_default' => $this->is_default,
        ];
    }
}
