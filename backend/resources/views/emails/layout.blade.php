@php
    $storeName = config('white_label.store.name', config('app.name'));
    $storeEmail = config('white_label.contact.email', config('mail.from.address'));
    $storePhone = config('white_label.contact.phone');
    $storeAddress = config('white_label.contact.address');
@endphp
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $storeName }}</title>
</head>
<body style="margin:0;background:#f4f2ee;color:#1f2328;font-family:Arial,Helvetica,sans-serif;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    {{ $preheader ?? '' }}
</div>

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f2ee;padding:28px 12px;">
    <tr>
        <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#ffffff;border:1px solid #ded9cf;border-radius:18px;overflow:hidden;">
                <tr>
                    <td style="background:#171717;padding:26px 30px;">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                            <tr>
                                <td>
                                    <div style="font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.1;color:#ffffff;font-weight:700;">
                                        {{ $storeName }}
                                    </div>
                                    <div style="margin-top:6px;color:#c9b889;font-size:13px;letter-spacing:.08em;text-transform:uppercase;">
                                        Premium silver jewelry
                                    </div>
                                </td>
                                <td align="right" style="color:#d7d1c8;font-size:12px;">
                                    {{ now()->timezone(config('app.timezone'))->format('M j, Y') }}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <tr>
                    <td style="padding:32px 30px 26px;">
                        @yield('content')
                    </td>
                </tr>

                <tr>
                    <td style="background:#faf8f5;border-top:1px solid #ece7df;padding:22px 30px;color:#69635b;font-size:13px;line-height:1.6;">
                        <strong style="color:#2d2a26;">Need help?</strong><br>
                        @if ($storeEmail)
                            Email: <a href="mailto:{{ $storeEmail }}" style="color:#7b5d20;text-decoration:none;">{{ $storeEmail }}</a>
                        @endif
                        @if ($storePhone)
                            <br>Phone / WhatsApp: {{ $storePhone }}
                        @endif
                        @if ($storeAddress)
                            <br>{{ $storeAddress }}
                        @endif
                    </td>
                </tr>
            </table>

            <div style="max-width:680px;margin:14px auto 0;color:#8b857c;font-size:11px;line-height:1.5;">
                You are receiving this email because you used {{ $storeName }}.
            </div>
        </td>
    </tr>
</table>
</body>
</html>
