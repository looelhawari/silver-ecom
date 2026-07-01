<?php

namespace App\Modules\Catalog\Http\Resources;

use App\Modules\Catalog\Models\SilverType;
use App\Modules\Settings\Services\StoreSettings;
use App\Support\Localization\LocalizedFields;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin SilverType
 */
class SilverTypeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $locale = LocalizedFields::locale($request);

        // gram_price is intentionally exposed only when the display setting allows it.
        return [
            'id' => $this->id,
            'name' => LocalizedFields::value($this->resource, 'name', $locale),
            'name_en' => $this->name_en ?? $this->name,
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
