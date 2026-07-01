<?php

namespace App\Support\Mail;

use App\Mail\Auth\FirstLoginOtpMail;
use App\Mail\Auth\PasswordResetMail;
use App\Mail\Orders\OrderReceivedInvoiceMail;
use App\Mail\Orders\PaymentConfirmedMail;
use App\Models\User;
use App\Modules\Orders\Enums\OrderStatus;
use App\Modules\Orders\Enums\PaymentStatus;
use App\Modules\Orders\Models\Order;
use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class TransactionalMailer
{
    public function sendOrderReceivedInvoice(Order $order): void
    {
        if (! $this->canEmail($order->customer_email) || $order->invoice_emailed_at) {
            return;
        }

        $order->loadMissing(['items', 'paymentMethod', 'shippingAddress']);

        if ($this->send($order->customer_email, $order->customer_name, new OrderReceivedInvoiceMail($order))) {
            $order->forceFill(['invoice_emailed_at' => now()])->saveQuietly();
        }
    }

    public function sendPaymentConfirmedIfReady(Order $order): void
    {
        if (
            ! $this->canEmail($order->customer_email)
            || $order->payment_confirmed_emailed_at
            || ! $this->isPaymentConfirmed($order)
        ) {
            return;
        }

        $order->loadMissing(['items', 'paymentMethod', 'shippingAddress']);

        if ($this->send($order->customer_email, $order->customer_name, new PaymentConfirmedMail($order))) {
            $order->forceFill(['payment_confirmed_emailed_at' => now()])->saveQuietly();
        }
    }

    public function sendFirstLoginOtp(User $user, string $otp): void
    {
        if (! $this->canEmail($user->email)) {
            return;
        }

        $this->send($user->email, $user->name, new FirstLoginOtpMail($user, $otp));
    }

    public function sendPasswordReset(User $user, string $resetUrl): void
    {
        if (! $this->canEmail($user->email)) {
            return;
        }

        $this->send($user->email, $user->name, new PasswordResetMail($user, $resetUrl));
    }

    private function isPaymentConfirmed(Order $order): bool
    {
        $confirmedPayments = [PaymentStatus::Approved, PaymentStatus::Paid];
        $confirmedOrders = [
            OrderStatus::Confirmed,
            OrderStatus::Preparing,
            OrderStatus::ReadyToShip,
            OrderStatus::Shipped,
            OrderStatus::Delivered,
        ];

        return in_array($order->payment_status, $confirmedPayments, true)
            && in_array($order->status, $confirmedOrders, true);
    }

    private function canEmail(?string $email): bool
    {
        return filled($email) && filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }

    private function send(string $email, ?string $name, Mailable $mailable): bool
    {
        try {
            Mail::to($email, $name)->send($mailable);

            return true;
        } catch (Throwable $exception) {
            Log::warning('Transactional email failed.', [
                'email' => $email,
                'mailable' => $mailable::class,
                'message' => $exception->getMessage(),
            ]);

            return false;
        }
    }
}
