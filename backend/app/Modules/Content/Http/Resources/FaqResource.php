<?php

namespace App\Modules\Content\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Modules\Content\Models\Faq
 */
class FaqResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'question' => $this->question,
            'question_ar' => $this->question_ar,
            'answer' => $this->answer,
            'answer_ar' => $this->answer_ar,
            'group' => $this->group,
        ];
    }
}
