<?php

namespace App\Modules\Checkout\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Checkout\Http\Requests\PlaceOrderRequest;
use App\Modules\Checkout\Services\CheckoutService;
use App\Modules\Orders\Http\Resources\OrderResource;
use App\Modules\Payments\Http\Resources\PaymentMethodResource;
use App\Modules\Payments\Models\PaymentMethod;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CheckoutController extends Controller
{
    public function __construct(private readonly CheckoutService $checkout) {}

    /** Active payment methods the customer can choose. */
    public function paymentMethods(): JsonResponse
    {
        return response()->json([
            'data' => PaymentMethodResource::collection(
                PaymentMethod::active()->orderBy('sort_order')->get()
            ),
        ]);
    }

    /** Server-side price preview for the cart/checkout summary. */
    public function validateCart(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer'],
            'items.*.variant_id' => ['nullable', 'integer'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:99'],
        ]);

        $quote = $this->checkout->quote($validated['items']);

        return response()->json([
            'data' => [
                'subtotal' => $quote['subtotal'],
                'shipping_cost' => $quote['shipping_cost'],
                'discount_total' => $quote['discount_total'],
                'total' => $quote['total'],
                'currency' => $quote['currency'],
            ],
        ]);
    }

    public function placeOrder(PlaceOrderRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['user_id'] = $request->user()?->id;

        $order = $this->checkout->placeOrder($data);
        $order->load(['items', 'paymentMethod', 'shippingAddress', 'statusHistory']);

        return response()->json([
            'message' => 'Order placed successfully.',
            'data' => OrderResource::make($order),
        ], 201);
    }
}
