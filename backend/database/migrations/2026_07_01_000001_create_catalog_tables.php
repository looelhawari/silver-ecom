<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('silver_types', function (Blueprint $table): void {
            $table->id();
            $table->string('name');               // e.g. Egyptian silver
            $table->string('name_ar')->nullable();
            $table->string('slug')->unique();
            $table->string('purity')->nullable(); // e.g. 925
            $table->decimal('gram_price', 10, 2)->default(0); // EGP per gram
            $table->timestamp('gram_price_updated_at')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('categories', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('name_ar')->nullable();
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->text('description_ar')->nullable();
            $table->string('image_path')->nullable();
            $table->string('seo_title')->nullable();
            $table->string('seo_description', 500)->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('products', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('name_ar')->nullable();
            $table->string('slug')->unique();
            $table->string('sku')->nullable()->unique();
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->foreignId('silver_type_id')->nullable()->constrained('silver_types')->nullOnDelete();
            $table->text('description')->nullable();
            $table->text('description_ar')->nullable();
            $table->text('care_instructions')->nullable();
            $table->text('care_instructions_ar')->nullable();
            $table->decimal('weight_in_grams', 8, 2)->nullable();
            $table->unsignedInteger('stock_quantity')->default(0);

            // Pricing (all money math is server-side; see Catalog PricingService).
            $table->enum('pricing_type', ['fixed', 'calculated'])->default('calculated');
            $table->decimal('fixed_price', 12, 2)->nullable();
            $table->decimal('gram_price_snapshot', 10, 2)->nullable();
            $table->decimal('workmanship_fee', 12, 2)->default(0);
            $table->decimal('extra_markup', 12, 2)->default(0);
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->decimal('discount_percentage', 5, 2)->nullable();
            $table->decimal('manual_price_override', 12, 2)->nullable();
            $table->decimal('final_price', 12, 2)->default(0);
            $table->boolean('show_workmanship_fee_publicly')->default(false);

            // Merchandising flags
            $table->boolean('is_active')->default(true)->index();
            $table->boolean('is_featured')->default(false)->index();
            $table->boolean('is_best_seller')->default(false)->index();

            $table->string('main_image_path')->nullable();
            $table->json('tags')->nullable();
            $table->string('seo_title')->nullable();
            $table->string('seo_description', 500)->nullable();

            $table->timestamps();

            $table->index(['is_active', 'is_featured']);
            $table->index(['is_active', 'is_best_seller']);
        });

        Schema::create('product_images', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->string('path');
            $table->string('alt')->nullable();
            $table->boolean('is_main')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('product_variants', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->string('type');   // ring_size | chain_length | bracelet_size | finish | color
            $table->string('label');  // human label, e.g. "Size 18"
            $table->string('value')->nullable();
            $table->decimal('price_adjustment', 12, 2)->default(0);
            $table->unsignedInteger('stock_quantity')->nullable();
            $table->string('sku')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_variants');
        Schema::dropIfExists('product_images');
        Schema::dropIfExists('products');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('silver_types');
    }
};
