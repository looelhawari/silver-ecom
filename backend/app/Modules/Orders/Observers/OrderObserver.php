<?php

namespace App\Modules\Orders\Observers;

use App\Modules\AuditLogs\Services\AuditLogger;
use App\Modules\Orders\Models\Order;
use App\Support\Mail\TransactionalMailer;

/**
 * Records a status-history entry (and an audit log) whenever an order's order/
 * payment/shipping status changes — from the admin panel or the API.
 */
class OrderObserver
{
    public function __construct(
        private readonly AuditLogger $audit,
        private readonly TransactionalMailer $mailer,
    ) {}

    public function updated(Order $order): void
    {
        $tracked = [
            'status' => 'order',
            'payment_status' => 'payment',
            'shipping_status' => 'shipping',
        ];

        foreach ($tracked as $field => $type) {
            if (! $order->wasChanged($field)) {
                continue;
            }

            $new = $order->{$field};
            $value = $new instanceof \BackedEnum ? $new->value : $new;

            $order->statusHistory()->create([
                'type' => $type,
                'status' => $value,
                'changed_by' => auth()->id(),
                'visible_to_customer' => true,
            ]);

            $this->audit->log("order.{$field}_changed", $order, [
                'from' => $order->getOriginal($field) instanceof \BackedEnum
                    ? $order->getOriginal($field)->value
                    : $order->getOriginal($field),
                'to' => $value,
            ]);
        }

        if ($order->wasChanged(['status', 'payment_status'])) {
            $this->mailer->sendPaymentConfirmedIfReady($order);
        }
    }
}
