<?php

namespace App\Modules\Payments\Observers;

use App\Modules\Orders\Enums\PaymentStatus;
use App\Modules\Payments\Models\PaymentProof;

class PaymentProofObserver
{
    public function updating(PaymentProof $paymentProof): void
    {
        if (! $paymentProof->isDirty('status') || ! in_array($paymentProof->status, ['approved', 'rejected'], true)) {
            return;
        }

        $paymentProof->reviewed_by ??= auth()->id();
        $paymentProof->reviewed_at ??= now();
    }

    public function updated(PaymentProof $paymentProof): void
    {
        if (! $paymentProof->wasChanged('status') || $paymentProof->status !== 'approved') {
            return;
        }

        $order = $paymentProof->order;

        if (! $order || in_array($order->payment_status, [PaymentStatus::Approved, PaymentStatus::Paid], true)) {
            return;
        }

        $order->update(['payment_status' => PaymentStatus::Approved]);
    }
}
