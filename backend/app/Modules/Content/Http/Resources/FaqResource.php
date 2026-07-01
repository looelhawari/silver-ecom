<?php

namespace App\Modules\Content\Http\Resources;

use App\Modules\Content\Models\Faq;
use App\Support\Localization\LocalizedFields;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Faq
 */
class FaqResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $locale = LocalizedFields::locale($request);

        return [
            'id' => $this->id,
            'question' => LocalizedFields::value($this->resource, 'question', $locale),
            'question_en' => $this->question_en ?? $this->question,
            'question_ar' => $this->question_ar,
            'answer' => LocalizedFields::value($this->resource, 'answer', $locale),
            'answer_en' => $this->answer_en ?? $this->answer,
            'answer_ar' => $this->answer_ar,
            'group' => $this->group,
        ];
    }
}
