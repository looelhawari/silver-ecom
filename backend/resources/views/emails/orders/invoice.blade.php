@extends('emails.layout')

@section('content')
@php
    $money = fn ($amount) => number_format((float) $amount, 2).' '.$order->currency;
@endphp

<h1 style="margin:0;color:#1f2328;font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:1.2;">
    Order received
</h1>
<p style="margin:14px 0 0;color:#4d4740;font-size:15px;line-height:1.7;">
    Hello {{ $order->customer_name }}, thank you for choosing {{ config('white_label.store.name', config('app.name')) }}.
    Your order is safely in our system and this invoice confirms the items and totals we received.
</p>

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:24px;border:1px solid #ebe5dc;border-radius:14px;overflow:hidden;">
    <tr>
        <td style="background:#faf8f5;padding:16px 18px;">
            <div style="color:#736b61;font-size:12px;text-transform:uppercase;letter-spacing:.08em;">Order code</div>
            <div style="margin-top:4px;color:#1f2328;font-size:20px;font-weight:700;">{{ $order->order_code }}</div>
        </td>
        <td align="right" style="background:#faf8f5;padding:16px 18px;">
            <div style="color:#736b61;font-size:12px;text-transform:uppercase;letter-spacing:.08em;">Total</div>
            <div style="margin-top:4px;color:#1f2328;font-size:20px;font-weight:700;">{{ $money($order->total) }}</div>
        </td>
    </tr>
</table>

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:24px;border-collapse:collapse;">
    <tr>
        <th align="left" style="border-bottom:1px solid #e7e1d8;padding:0 0 10px;color:#736b61;font-size:12px;text-transform:uppercase;letter-spacing:.08em;">Item</th>
        <th align="center" style="border-bottom:1px solid #e7e1d8;padding:0 0 10px;color:#736b61;font-size:12px;text-transform:uppercase;letter-spacing:.08em;">Qty</th>
        <th align="right" style="border-bottom:1px solid #e7e1d8;padding:0 0 10px;color:#736b61;font-size:12px;text-transform:uppercase;letter-spacing:.08em;">Amount</th>
    </tr>
    @foreach ($order->items as $item)
        <tr>
            <td style="border-bottom:1px solid #f0ece6;padding:13px 0;color:#2d2a26;font-size:14px;line-height:1.5;">
                <strong>{{ $item->product_name }}</strong>
                @if ($item->variant_label)
                    <br><span style="color:#736b61;">{{ $item->variant_label }}</span>
                @endif
            </td>
            <td align="center" style="border-bottom:1px solid #f0ece6;padding:13px 0;color:#2d2a26;font-size:14px;">{{ $item->quantity }}</td>
            <td align="right" style="border-bottom:1px solid #f0ece6;padding:13px 0;color:#2d2a26;font-size:14px;">{{ $money($item->line_total) }}</td>
        </tr>
    @endforeach
</table>

<table role="presentation" align="right" width="290" cellspacing="0" cellpadding="0" style="margin-top:18px;border-collapse:collapse;">
    <tr>
        <td style="padding:6px 0;color:#736b61;font-size:14px;">Subtotal</td>
        <td align="right" style="padding:6px 0;color:#2d2a26;font-size:14px;">{{ $money($order->subtotal) }}</td>
    </tr>
    <tr>
        <td style="padding:6px 0;color:#736b61;font-size:14px;">Shipping</td>
        <td align="right" style="padding:6px 0;color:#2d2a26;font-size:14px;">{{ $money($order->shipping_cost) }}</td>
    </tr>
    @if ((float) $order->discount_total > 0)
        <tr>
            <td style="padding:6px 0;color:#736b61;font-size:14px;">Discount</td>
            <td align="right" style="padding:6px 0;color:#2d2a26;font-size:14px;">-{{ $money($order->discount_total) }}</td>
        </tr>
    @endif
    <tr>
        <td style="border-top:1px solid #ded9cf;padding:10px 0 0;color:#1f2328;font-size:16px;font-weight:700;">Total</td>
        <td align="right" style="border-top:1px solid #ded9cf;padding:10px 0 0;color:#1f2328;font-size:16px;font-weight:700;">{{ $money($order->total) }}</td>
    </tr>
</table>

<div style="clear:both;"></div>

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:28px;background:#faf8f5;border-radius:14px;">
    <tr>
        <td style="padding:18px;color:#4d4740;font-size:14px;line-height:1.7;">
            <strong style="color:#1f2328;">Payment method:</strong>
            {{ $order->paymentMethod?->name ?? 'Selected at checkout' }}<br>
            <strong style="color:#1f2328;">Delivery to:</strong>
            {{ $order->shippingAddress?->address_line }}
            @if ($order->shippingAddress?->area)
                , {{ $order->shippingAddress->area }}
            @endif
            @if ($order->shippingAddress?->city)
                , {{ $order->shippingAddress->city }}
            @endif
        </td>
    </tr>
</table>

<table role="presentation" cellspacing="0" cellpadding="0" style="margin-top:28px;">
    <tr>
        <td>
            <a href="{{ $invoiceUrl }}" style="display:inline-block;background:#171717;color:#ffffff;text-decoration:none;border-radius:999px;padding:13px 22px;font-size:14px;font-weight:700;">
                View invoice
            </a>
        </td>
        <td style="padding-left:12px;">
            <a href="{{ $trackingUrl }}" style="display:inline-block;color:#7b5d20;text-decoration:none;padding:13px 0;font-size:14px;font-weight:700;">
                Track order
            </a>
        </td>
    </tr>
</table>
@endsection
