@extends('emails.layout')

@section('content')
<h1 style="margin:0;color:#1f2328;font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:1.2;">
    Verify your first sign-in
</h1>
<p style="margin:14px 0 0;color:#4d4740;font-size:15px;line-height:1.7;">
    Hello {{ $user->name }}, use this one-time code to verify your first sign-in to
    {{ config('white_label.store.name', config('app.name')) }}.
</p>

<div style="margin-top:26px;background:#171717;border-radius:18px;padding:26px;text-align:center;">
    <div style="color:#c9b889;font-size:12px;text-transform:uppercase;letter-spacing:.12em;">One-time code</div>
    <div style="margin-top:10px;color:#ffffff;font-size:36px;font-weight:800;letter-spacing:.22em;font-family:Arial,Helvetica,sans-serif;">
        {{ $otp }}
    </div>
</div>

<p style="margin:22px 0 0;color:#4d4740;font-size:14px;line-height:1.7;">
    This code expires
    @if ($expiresAt)
        at {{ $expiresAt->timezone(config('app.timezone'))->format('g:i A') }}
    @else
        soon
    @endif
    and should not be shared with anyone.
</p>

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:22px;background:#faf8f5;border-radius:14px;">
    <tr>
        <td style="padding:16px 18px;color:#736b61;font-size:13px;line-height:1.6;">
            If you did not try to sign in, you can ignore this email. Your password was not changed.
        </td>
    </tr>
</table>
@endsection
