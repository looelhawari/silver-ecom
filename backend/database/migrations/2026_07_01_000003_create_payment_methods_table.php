<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Customer-selectable manual payment methods (COD, Vodafone Cash, InstaPay,
     * bank transfer). Distinct from the gateway-oriented `payment_settings` table.
     */
    public function up(): void
    {
        Schema::create('payment_methods', function (Blueprint $table): void {
            $table->id();
            $table->string('code')->unique(); // cod | vodafone_cash | instapay | bank_transfer
            $table->string('name');
            $table->string('name_ar')->nullable();
            $table->text('instructions')->nullable();
            $table->text('instructions_ar')->nullable();
            $table->string('account_details')->nullable(); // wallet/bank number shown to customer
            $table->boolean('requires_proof')->default(false);
            $table->boolean('is_active')->default(true)->index();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_methods');
    }
};
