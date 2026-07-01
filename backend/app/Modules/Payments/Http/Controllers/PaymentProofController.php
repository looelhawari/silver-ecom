<?php

namespace App\Modules\Payments\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Media\Services\MediaService;
use App\Modules\Orders\Enums\PaymentStatus;
use App\Modules\Orders\Models\Order;
use App\Modules\Payments\Http\Requests\UploadPaymentProofRequest;
use Illuminate\Http\JsonResponse;

class PaymentProofController extends Controller
{
    public function __construct(private readonly MediaService $media) {}

    /**
     * Customer uploads a payment proof for an order. Verified by order code + the
     * phone used at checkout. Never marks the order paid — that requires admin review.
     */
    public function store(UploadPaymentProofRequest $request, string $code): JsonResponse
    {
        $order = Order::where('order_code', $code)
            ->where('customer_phone', $request->validated()['phone'])
            ->firstOrFail();

        $path = $this->media->storeProof($request->file('file'), "payment-proofs/{$order->order_code}");

        $order->paymentProof()->create([
            'payment_method_id' => $order->payment_method_id,
            'file_path' => $path,
            'status' => 'pending',
        ]);

        $order->update(['payment_status' => PaymentStatus::ProofUploaded]);

        return response()->json(['message' => 'Payment proof uploaded. We will review it shortly.'], 201);
    }
}
