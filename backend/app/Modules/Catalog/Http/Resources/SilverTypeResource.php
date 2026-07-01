<?php

namespace App\Modules\Catalog\Http\Resources;

use App\Modules\Settings\Services\StoreSettings;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Modules\Catalog\Models\SilverType
 */
class SilverTypeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // gram_price is intentionally exposed only when the display setting allows it.
        return [
            'id' => $this->id,
            'name' => $this->name,
            'name_ar' => $this->name_ar,
            'slug' => $this->slug,
            'purity' => $this->purity,
            'gram_price' => $this->when(
                (bool) StoreSettings::get('display.show_gram_price', false),
                fn () => (float) $this->gram_price,
            ),
        ];
    }
}
