<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pages', function (Blueprint $table): void {
            $table->id();
            $table->string('slug')->unique(); // about | privacy-policy | terms | returns-policy | silver-care
            $table->string('title');
            $table->string('title_ar')->nullable();
            $table->longText('body')->nullable();
            $table->longText('body_ar')->nullable();
            $table->string('seo_title')->nullable();
            $table->string('seo_description', 500)->nullable();
            $table->boolean('is_published')->default(true)->index();
            $table->timestamps();
        });

        Schema::create('faqs', function (Blueprint $table): void {
            $table->id();
            $table->string('question');
            $table->string('question_ar')->nullable();
            $table->text('answer');
            $table->text('answer_ar')->nullable();
            $table->string('group')->nullable()->index(); // silver | delivery | payment | custom | returns | care
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });

        Schema::create('banners', function (Blueprint $table): void {
            $table->id();
            $table->string('title')->nullable();
            $table->string('title_ar')->nullable();
            $table->string('subtitle')->nullable();
            $table->string('subtitle_ar')->nullable();
            $table->string('image_path');
            $table->string('link_url')->nullable();
            $table->string('placement')->default('home_hero')->index();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true)->index();
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('banners');
        Schema::dropIfExists('faqs');
        Schema::dropIfExists('pages');
    }
};
