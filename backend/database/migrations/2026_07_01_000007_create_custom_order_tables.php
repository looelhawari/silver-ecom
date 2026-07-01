<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('custom_order_requests', function (Blueprint $table): void {
            $table->id();
            $table->string('request_code')->unique();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();

            $table->string('name');
            $table->string('phone');
            $table->string('whatsapp')->nullable();
            $table->string('email')->nullable();

            $table->text('description');
            $table->foreignId('silver_type_id')->nullable()->constrained('silver_types')->nullOnDelete();
            $table->decimal('expected_weight_grams', 8, 2)->nullable();
            $table->string('size')->nullable();
            $table->decimal('budget_min', 12, 2)->nullable();
            $table->decimal('budget_max', 12, 2)->nullable();
            $table->text('notes')->nullable();

            $table->string('status')->default('pending')->index();
            $table->text('admin_notes')->nullable();      // internal
            $table->text('customer_message')->nullable();  // customer-visible

            $table->foreignId('order_id')->nullable()->constrained('orders')->nullOnDelete(); // when converted
            $table->timestamps();
        });

        Schema::create('custom_order_images', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('custom_order_request_id')->constrained('custom_order_requests')->cascadeOnDelete();
            $table->string('path');
            $table->timestamps();
        });

        Schema::create('custom_order_quotes', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('custom_order_request_id')->constrained('custom_order_requests')->cascadeOnDelete();
            $table->decimal('estimated_weight_grams', 8, 2)->nullable();
            $table->foreignId('silver_type_id')->nullable()->constrained('silver_types')->nullOnDelete();
            $table->decimal('gram_price', 10, 2)->nullable();
            $table->decimal('workmanship_fee', 12, 2)->nullable();
            $table->decimal('extra_cost', 12, 2)->nullable();
            $table->decimal('final_quote', 12, 2)->nullable();
            $table->text('message')->nullable();
            $table->string('status')->default('draft')->index(); // draft | sent | accepted | rejected
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('custom_order_quotes');
        Schema::dropIfExists('custom_order_images');
        Schema::dropIfExists('custom_order_requests');
    }
};
