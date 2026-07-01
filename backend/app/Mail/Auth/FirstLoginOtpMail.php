<?php

namespace App\Mail\Auth;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class FirstLoginOtpMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $user,
        public string $otp,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your '.config('white_label.store.name', config('app.name')).' sign-in code',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.auth.otp',
            with: [
                'user' => $this->user,
                'otp' => $this->otp,
                'expiresAt' => $this->user->first_login_otp_expires_at,
                'preheader' => 'Use this one-time code to verify your first sign-in.',
            ],
        );
    }
}
