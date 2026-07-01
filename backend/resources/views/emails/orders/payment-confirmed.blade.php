@extends('emails.layout')

@section('content')
@php
    $money = fn ($amount) => number_format((float) $amount, 2).' '.$order->currency;
@endphp

<h1 style="margin:0;color:#1f2328;font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:1.2;">
    Payment confirmed
</h1>
<p style="margin:14px 0 0;color:#4d4740;font-size:15px;line-height:1.7;">
    Hello {{ $order->customer_name }}, your payment proof has been approved and order
    <strong>{{ $order->order_code }}</strong> is now confirmed. Our team will prepare your silver pieces with care.
</p>

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:24px;background:#f7fbf7;border:1px solid #dbead9;border-radius:14px;">
    <tr>
        <td style="padding:18px;">
            <div style="color:#2f6b3f;font-size:12px;text-transform:uppercase;letter-spacing:.08em;">Confirmed total</div>
            <div style="margin-top:6px;color:#1f2328;font-size:24px;font-weight:700;">{{ $money($order->total) }}</div>
        </td>
        <td align="right" style="padding:18px;color:#2f6b3f;font-size:14px;font-weight:700;">
            Approved
        </td>
    </tr>
</table>

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:24px;border-collapse:collapse;">
    <tr>
        <td style="padding:10px 0;color:#736b61;font-size:14px;border-bottom:1px solid #f0ece6;">Order status</td>
        <td align="right" style="padding:10px 0;color:#1f2328;font-size:14px;border-bottom:1px solid #f0ece6;">{{ $order->status->label() }}</td>
    </tr>
    <tr>
        <td style="padding:10px 0;color:#736b61;font-size:14px;border-bottom:1px solid #f0ece6;">Payment method</td>
        <td align="right" style="padding:10px 0;color:#1f2328;font-size:14px;border-bottom:1px solid #f0ece6;">{{ $order->paymentMethod?->name ?? 'Manual payment' }}</td>
    </tr>
    <tr>
        <td style="padding:10px 0;color:#736b61;font-size:14px;border-bottom:1px solid #f0ece6;">Items</td>
        <td align="right" style="padding:10px 0;color:#1f2328;font-size:14px;border-bottom:1px solid #f0ece6;">{{ $order->items->sum('quantity') }}</td>
    </tr>
</table>

<p style="margin:24px 0 0;color:#4d4740;font-size:14px;line-height:1.7;">
    You can follow the order timeline any time. If a courier tracking number is added later, it will appear on the tracking page.
</p>

<table role="presentation" cellspacing="0" cellpadding="0" style="margin-top:28px;">
    <tr>
        <td>
            <a href="{{ $trackingUrl }}" style="display:inline-block;background:#171717;color:#ffffff;text-decoration:none;border-radius:999px;padding:13px 22px;font-size:14px;font-weight:700;">
                Track confirmed order
            </a>
        </td>
    </tr>
</table>
@endsection
