<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table): void {
            $table->timestamp('invoice_emailed_at')->nullable()->after('placed_at');
            $table->timestamp('payment_confirmed_emailed_at')->nullable()->after('invoice_emailed_at');
        });

        Schema::table('users', function (Blueprint $table): void {
            $table->string('first_login_otp_hash')->nullable()->after('remember_token');
            $table->timestamp('first_login_otp_expires_at')->nullable()->after('first_login_otp_hash');
            $table->timestamp('first_login_otp_sent_at')->nullable()->after('first_login_otp_expires_at');
            $table->timestamp('first_login_otp_verified_at')->nullable()->after('first_login_otp_sent_at');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn([
                'first_login_otp_hash',
                'first_login_otp_expires_at',
                'first_login_otp_sent_at',
                'first_login_otp_verified_at',
            ]);
        });

        Schema::table('orders', function (Blueprint $table): void {
            $table->dropColumn([
                'invoice_emailed_at',
                'payment_confirmed_emailed_at',
            ]);
        });
    }
};
