<?php

namespace App\Modules\Orders\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Orders\Http\Requests\TrackOrderRequest;
use App\Modules\Orders\Http\Resources\OrderResource;
use App\Modules\Orders\Models\Order;
use Illuminate\Http\JsonResponse;

class OrderTrackController extends Controller
{
    /**
     * Guest order tracking — requires BOTH the order code and the phone used at
     * checkout, so an order code alone cannot reveal someone else's order.
     */
    public function track(TrackOrderRequest $request): JsonResponse|OrderResource
    {
        $data = $request->validated();

        $order = Order::query()
            ->where('order_code', $data['order_code'])
            ->where('customer_phone', $data['phone'])
            ->with(['items', 'paymentMethod', 'shippingAddress', 'statusHistory'])
            ->first();

        if (! $order) {
            return response()->json([
                'message' => 'No order found for that code and phone number.',
            ], 404);
        }

        return OrderResource::make($order);
    }
}
