<?php

namespace App\Modules\Auth\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Modules\Auth\Http\Requests\LoginRequest;
use App\Modules\Auth\Http\Requests\RegisterRequest;
use App\Modules\Users\Http\Resources\UserResource;
use App\Support\Mail\TransactionalMailer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(private readonly TransactionalMailer $mailer) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create($request->safe()->only(['name', 'email', 'phone', 'whatsapp', 'password']));

        return response()->json([
            'data' => [
                'token' => $user->createToken('storefront')->plainTextToken,
                'user' => UserResource::make($user),
            ],
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => 'These credentials do not match our records.',
            ]);
        }

        if ($user->is_blocked) {
            throw ValidationException::withMessages([
                'email' => 'This account has been blocked. Please contact support.',
            ]);
        }

        $requiresEmailOtp = $this->issueFirstLoginOtpIfNeeded($user);

        return response()->json([
            'data' => [
                'token' => $user->createToken('storefront')->plainTextToken,
                'user' => UserResource::make($user),
                'requires_email_otp' => $requiresEmailOtp,
                'otp_expires_at' => $requiresEmailOtp
                    ? $user->first_login_otp_expires_at?->toIso8601String()
                    : null,
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out.']);
    }

    public function me(Request $request): UserResource
    {
        return UserResource::make($request->user());
    }

    public function verifyFirstLoginOtp(Request $request): JsonResponse
    {
        $data = $request->validate([
            'otp' => ['required', 'digits:6'],
        ]);

        /** @var User $user */
        $user = $request->user();

        if (
            ! $user->first_login_otp_hash
            || ! $user->first_login_otp_expires_at
            || $user->first_login_otp_expires_at->isPast()
            || ! Hash::check($data['otp'], $user->first_login_otp_hash)
        ) {
            throw ValidationException::withMessages([
                'otp' => 'The verification code is invalid or expired.',
            ]);
        }

        $user->forceFill([
            'email_verified_at' => $user->email_verified_at ?? now(),
            'first_login_otp_hash' => null,
            'first_login_otp_expires_at' => null,
            'first_login_otp_verified_at' => now(),
        ])->save();

        return response()->json([
            'message' => 'Email verified.',
            'data' => [
                'user' => UserResource::make($user->fresh()),
            ],
        ]);
    }

    /**
     * Send a password-reset link. Always returns a generic message to avoid
     * disclosing whether an email is registered.
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['email' => ['required', 'email']]);

        Password::sendResetLink($request->only('email'));

        return response()->json([
            'message' => 'If that email is registered, a reset link has been sent.',
        ]);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', PasswordRule::defaults()],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, string $password): void {
                $user->forceFill(['password' => Hash::make($password)])->save();
            },
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json(['message' => 'Your password has been reset.']);
        }

        throw ValidationException::withMessages(['email' => [__($status)]]);
    }

    private function issueFirstLoginOtpIfNeeded(User $user): bool
    {
        if ($user->email_verified_at || $user->first_login_otp_verified_at) {
            return false;
        }

        if (
            $user->first_login_otp_hash
            && $user->first_login_otp_expires_at?->isFuture()
            && $user->first_login_otp_sent_at?->greaterThan(now()->subMinutes(5))
        ) {
            return true;
        }

        $otp = (string) random_int(100000, 999999);

        $user->forceFill([
            'first_login_otp_hash' => Hash::make($otp),
            'first_login_otp_expires_at' => now()->addMinutes(10),
            'first_login_otp_sent_at' => now(),
        ])->save();

        $this->mailer->sendFirstLoginOtp($user, $otp);

        return true;
    }
}
