<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table): void {
            $table->id();
            $table->string('order_code')->unique();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();

            // Contact snapshot (guest checkout supported)
            $table->string('customer_name');
            $table->string('customer_phone');
            $table->string('customer_whatsapp')->nullable();
            $table->string('customer_email')->nullable();

            // Statuses (validated against PHP enums in the app layer)
            $table->string('status')->default('pending')->index();
            $table->string('payment_status')->default('unpaid')->index();
            $table->string('shipping_status')->default('not_started')->index();

            $table->foreignId('payment_method_id')->nullable()->constrained('payment_methods')->nullOnDelete();

            // Totals (computed server-side at checkout)
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->decimal('shipping_cost', 12, 2)->default(0);
            $table->decimal('discount_total', 12, 2)->default(0);
            $table->decimal('total', 12, 2)->default(0);
            $table->string('currency', 8)->default('EGP');

            // Shipping tracking
            $table->string('tracking_number')->nullable();
            $table->string('courier_name')->nullable();
            $table->text('shipping_note')->nullable(); // customer-visible

            $table->text('notes')->nullable();          // customer order notes
            $table->text('admin_notes')->nullable();    // internal
            $table->timestamp('placed_at')->nullable();
            $table->timestamps();
        });

        Schema::create('order_items', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();
            $table->string('product_name');
            $table->string('product_sku')->nullable();
            $table->string('variant_label')->nullable();
            $table->string('silver_type_name')->nullable();
            $table->decimal('weight_in_grams', 8, 2)->nullable();
            $table->decimal('unit_price', 12, 2);
            $table->unsignedInteger('quantity')->default(1);
            $table->decimal('line_total', 12, 2);
            $table->timestamps();
        });

        Schema::create('order_status_history', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->string('type')->default('order'); // order | payment | shipping
            $table->string('status');
            $table->text('note')->nullable();
            $table->foreignId('changed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->boolean('visible_to_customer')->default(true);
            $table->timestamps();
        });

        Schema::create('shipping_addresses', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->string('full_name');
            $table->string('phone');
            $table->string('whatsapp')->nullable();
            $table->string('city');
            $table->string('area')->nullable();
            $table->string('address_line');
            $table->string('building')->nullable();
            $table->string('floor')->nullable();
            $table->string('apartment')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shipping_addresses');
        Schema::dropIfExists('order_status_history');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};
