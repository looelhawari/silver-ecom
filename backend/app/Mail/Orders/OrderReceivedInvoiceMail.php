<?php

namespace App\Mail\Orders;

use App\Modules\Orders\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderReceivedInvoiceMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Order $order) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'We received your '.config('white_label.store.name', config('app.name')).' order '.$this->order->order_code,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.orders.invoice',
            with: [
                'order' => $this->order,
                'invoiceUrl' => $this->invoiceUrl(),
                'trackingUrl' => $this->trackingUrl(),
                'preheader' => 'Your order is safely received. Review your invoice and payment details.',
            ],
        );
    }

    private function invoiceUrl(): string
    {
        return $this->frontendUrl('/order/invoice').'?'.http_build_query([
            'code' => $this->order->order_code,
            'phone' => $this->order->customer_phone,
        ], '', '&', PHP_QUERY_RFC3986);
    }

    private function trackingUrl(): string
    {
        return $this->frontendUrl('/track-order').'?'.http_build_query([
            'code' => $this->order->order_code,
            'phone' => $this->order->customer_phone,
        ], '', '&', PHP_QUERY_RFC3986);
    }

    private function frontendUrl(string $path): string
    {
        $locale = in_array(config('white_label.store.locale'), ['en', 'ar-EG'], true)
            ? config('white_label.store.locale')
            : 'en';

        return rtrim((string) config('app.frontend_url'), '/').'/'.$locale.$path;
    }
}
