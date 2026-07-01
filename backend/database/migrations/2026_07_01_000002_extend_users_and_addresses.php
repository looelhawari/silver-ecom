<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->string('phone')->nullable()->after('email');
            $table->string('whatsapp')->nullable()->after('phone');
            $table->boolean('is_blocked')->default(false)->index()->after('whatsapp');
            $table->timestamp('blocked_at')->nullable()->after('is_blocked');
        });

        Schema::create('user_addresses', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('label')->nullable();        // Home / Work
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
            $table->boolean('is_default')->default(false);
            $table->timestamps();
        });

        Schema::create('user_admin_notes', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('note');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_admin_notes');
        Schema::dropIfExists('user_addresses');
        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn(['phone', 'whatsapp', 'is_blocked', 'blocked_at']);
        });
    }
};
