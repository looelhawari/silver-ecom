<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table): void {
            $table->id();
            $table->string('group')->index();
            $table->string('key');
            $table->json('value')->nullable();
            $table->string('type')->default('string');
            $table->boolean('is_public')->default(false)->index();
            $table->timestamps();

            $table->unique(['group', 'key']);
        });

        Schema::create('theme_settings', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('preset_key')->unique();
            $table->json('tokens');
            $table->json('assets')->nullable();
            $table->boolean('is_active')->default(false)->index();
            $table->timestamps();
        });

        Schema::create('feature_flags', function (Blueprint $table): void {
            $table->id();
            $table->string('key')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->boolean('enabled')->default(false)->index();
            $table->string('audience')->default('all')->index();
            $table->json('rules')->nullable();
            $table->timestamps();
        });

        Schema::create('payment_settings', function (Blueprint $table): void {
            $table->id();
            $table->string('provider')->unique();
            $table->boolean('enabled')->default(false)->index();
            $table->string('credentials_key')->nullable();
            $table->json('public_config')->nullable();
            $table->json('private_config')->nullable();
            $table->timestamps();
        });

        Schema::create('shipping_settings', function (Blueprint $table): void {
            $table->id();
            $table->string('provider')->unique();
            $table->boolean('enabled')->default(false)->index();
            $table->json('public_config')->nullable();
            $table->json('private_config')->nullable();
            $table->timestamps();
        });

        Schema::create('integration_settings', function (Blueprint $table): void {
            $table->id();
            $table->string('key')->unique();
            $table->string('type')->index();
            $table->boolean('enabled')->default(false)->index();
            $table->json('public_config')->nullable();
            $table->json('private_config')->nullable();
            $table->timestamps();
        });

        Schema::create('seo_settings', function (Blueprint $table): void {
            $table->id();
            $table->string('scope')->index();
            $table->string('scope_identifier')->default('global');
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->json('keywords')->nullable();
            $table->string('canonical_url')->nullable();
            $table->string('robots')->default('index,follow');
            $table->string('image_path')->nullable();
            $table->json('structured_data')->nullable();
            $table->timestamps();

            $table->unique(['scope', 'scope_identifier']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seo_settings');
        Schema::dropIfExists('integration_settings');
        Schema::dropIfExists('shipping_settings');
        Schema::dropIfExists('payment_settings');
        Schema::dropIfExists('feature_flags');
        Schema::dropIfExists('theme_settings');
        Schema::dropIfExists('settings');
    }
};
