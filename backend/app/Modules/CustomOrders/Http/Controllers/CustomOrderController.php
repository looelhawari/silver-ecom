<?php

namespace App\Modules\CustomOrders\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\CustomOrders\Http\Requests\StoreCustomOrderRequest;
use App\Modules\CustomOrders\Http\Requests\TrackCustomOrderRequest;
use App\Modules\CustomOrders\Http\Resources\CustomOrderRequestResource;
use App\Modules\CustomOrders\Models\CustomOrderRequest;
use App\Modules\CustomOrders\Services\CustomOrderService;
use Illuminate\Http\JsonResponse;

class CustomOrderController extends Controller
{
    public function __construct(private readonly CustomOrderService $service) {}

    public function store(StoreCustomOrderRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['user_id'] = $request->user()?->id;

        $custom = $this->service->create($data, $request->file('images', []));

        return response()->json([
            'message' => 'Your custom request has been received. Save your tracking code.',
            'data' => [
                'request_code' => $custom->request_code,
            ],
        ], 201);
    }

    /**
     * Guest tracking — requires request code + the phone used on submission.
     */
    public function track(TrackCustomOrderRequest $request): JsonResponse|CustomOrderRequestResource
    {
        $data = $request->validated();

        $custom = CustomOrderRequest::query()
            ->where('request_code', $data['request_code'])
            ->where('phone', $data['phone'])
            ->with(['silverType', 'images', 'quote'])
            ->first();

        if (! $custom) {
            return response()->json([
                'message' => 'No request found for that code and phone number.',
            ], 404);
        }

        return CustomOrderRequestResource::make($custom);
    }
}
