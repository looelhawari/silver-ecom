<?php

namespace App\Modules\CustomOrders\Services;

use App\Modules\CustomOrders\Enums\CustomOrderStatus;
use App\Modules\CustomOrders\Models\CustomOrderRequest;
use App\Modules\Media\Services\MediaService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CustomOrderService
{
    public function __construct(private readonly MediaService $media) {}

    /**
     * Create a custom order request and store its reference images securely.
     *
     * @param  array<string, mixed>  $data
     * @param  array<int, UploadedFile>  $images
     */
    public function create(array $data, array $images = []): CustomOrderRequest
    {
        return DB::transaction(function () use ($data, $images): CustomOrderRequest {
            $request = CustomOrderRequest::create([
                'request_code' => $this->generateCode(),
                'user_id' => $data['user_id'] ?? null,
                'name' => $data['name'],
                'phone' => $data['phone'],
                'whatsapp' => $data['whatsapp'] ?? null,
                'email' => $data['email'] ?? null,
                'description' => $data['description'],
                'silver_type_id' => $data['silver_type_id'] ?? null,
                'expected_weight_grams' => $data['expected_weight_grams'] ?? null,
                'size' => $data['size'] ?? null,
                'budget_min' => $data['budget_min'] ?? null,
                'budget_max' => $data['budget_max'] ?? null,
                'notes' => $data['notes'] ?? null,
                'status' => CustomOrderStatus::Pending,
            ]);

            foreach ($images as $image) {
                $path = $this->media->storeImage($image, "custom-orders/{$request->request_code}");
                $request->images()->create(['path' => $path]);
            }

            return $request;
        });
    }

    private function generateCode(): string
    {
        do {
            $code = 'CR-'.now()->format('ymd').'-'.strtoupper(Str::random(5));
        } while (CustomOrderRequest::where('request_code', $code)->exists());

        return $code;
    }
}
