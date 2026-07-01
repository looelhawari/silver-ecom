@extends('emails.layout')

@section('content')
<h1 style="margin:0;color:#1f2328;font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:1.2;">
    Reset your password
</h1>
<p style="margin:14px 0 0;color:#4d4740;font-size:15px;line-height:1.7;">
    Hello {{ $user->name }}, we received a request to reset the password for your
    {{ config('white_label.store.name', config('app.name')) }} account.
</p>

<table role="presentation" cellspacing="0" cellpadding="0" style="margin-top:28px;">
    <tr>
        <td>
            <a href="{{ $resetUrl }}" style="display:inline-block;background:#171717;color:#ffffff;text-decoration:none;border-radius:999px;padding:13px 22px;font-size:14px;font-weight:700;">
                Reset password
            </a>
        </td>
    </tr>
</table>

<p style="margin:24px 0 0;color:#4d4740;font-size:14px;line-height:1.7;">
    This secure link expires automatically. If the button does not work, copy and paste this URL into your browser:
</p>
<p style="margin:10px 0 0;word-break:break-all;color:#7b5d20;font-size:13px;line-height:1.6;">
    <a href="{{ $resetUrl }}" style="color:#7b5d20;text-decoration:none;">{{ $resetUrl }}</a>
</p>

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:22px;background:#faf8f5;border-radius:14px;">
    <tr>
        <td style="padding:16px 18px;color:#736b61;font-size:13px;line-height:1.6;">
            If you did not request this reset, no action is needed. Your current password remains active.
        </td>
    </tr>
</table>
@endsection
