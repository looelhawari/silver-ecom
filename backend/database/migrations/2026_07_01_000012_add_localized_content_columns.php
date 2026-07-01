<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $this->addColumn('silver_types', 'name_en', fn (Blueprint $table) => $table->string('name_en')->nullable()->after('name'));

        $this->addColumn('categories', 'name_en', fn (Blueprint $table) => $table->string('name_en')->nullable()->after('name'));
        $this->addColumn('categories', 'description_en', fn (Blueprint $table) => $table->text('description_en')->nullable()->after('description'));
        $this->addSeoColumns('categories');

        $this->addColumn('products', 'name_en', fn (Blueprint $table) => $table->string('name_en')->nullable()->after('name'));
        $this->addColumn('products', 'description_en', fn (Blueprint $table) => $table->text('description_en')->nullable()->after('description'));
        $this->addColumn('products', 'care_instructions_en', fn (Blueprint $table) => $table->text('care_instructions_en')->nullable()->after('care_instructions'));
        $this->addSeoColumns('products');

        $this->addColumn('payment_methods', 'name_en', fn (Blueprint $table) => $table->string('name_en')->nullable()->after('name'));
        $this->addColumn('payment_methods', 'instructions_en', fn (Blueprint $table) => $table->text('instructions_en')->nullable()->after('instructions'));

        $this->addColumn('pages', 'title_en', fn (Blueprint $table) => $table->string('title_en')->nullable()->after('title'));
        $this->addColumn('pages', 'body_en', fn (Blueprint $table) => $table->longText('body_en')->nullable()->after('body'));
        $this->addColumn('pages', 'content_en', fn (Blueprint $table) => $table->longText('content_en')->nullable()->after('body_ar'));
        $this->addColumn('pages', 'content_ar', fn (Blueprint $table) => $table->longText('content_ar')->nullable()->after('content_en'));
        $this->addSeoColumns('pages');

        $this->addColumn('faqs', 'question_en', fn (Blueprint $table) => $table->string('question_en')->nullable()->after('question'));
        $this->addColumn('faqs', 'answer_en', fn (Blueprint $table) => $table->text('answer_en')->nullable()->after('answer'));

        $this->addColumn('banners', 'title_en', fn (Blueprint $table) => $table->string('title_en')->nullable()->after('title'));
        $this->addColumn('banners', 'subtitle_en', fn (Blueprint $table) => $table->string('subtitle_en')->nullable()->after('subtitle'));
        $this->addColumn('banners', 'button_text_en', fn (Blueprint $table) => $table->string('button_text_en')->nullable()->after('subtitle_ar'));
        $this->addColumn('banners', 'button_text_ar', fn (Blueprint $table) => $table->string('button_text_ar')->nullable()->after('button_text_en'));

        $this->backfillEnglishColumns();
    }

    public function down(): void
    {
        $this->dropColumns('banners', ['button_text_ar', 'button_text_en', 'subtitle_en', 'title_en']);
        $this->dropColumns('faqs', ['answer_en', 'question_en']);
        $this->dropColumns('pages', [
            'seo_description_ar', 'seo_description_en', 'seo_title_ar', 'seo_title_en',
            'content_ar', 'content_en', 'body_en', 'title_en',
        ]);
        $this->dropColumns('payment_methods', ['instructions_en', 'name_en']);
        $this->dropColumns('products', [
            'seo_description_ar', 'seo_description_en', 'seo_title_ar', 'seo_title_en',
            'care_instructions_en', 'description_en', 'name_en',
        ]);
        $this->dropColumns('categories', [
            'seo_description_ar', 'seo_description_en', 'seo_title_ar', 'seo_title_en',
            'description_en', 'name_en',
        ]);
        $this->dropColumns('silver_types', ['name_en']);
    }

    private function addSeoColumns(string $table): void
    {
        $this->addColumn($table, 'seo_title_en', fn (Blueprint $blueprint) => $blueprint->string('seo_title_en')->nullable()->after('seo_title'));
        $this->addColumn($table, 'seo_title_ar', fn (Blueprint $blueprint) => $blueprint->string('seo_title_ar')->nullable()->after('seo_title_en'));
        $this->addColumn($table, 'seo_description_en', fn (Blueprint $blueprint) => $blueprint->string('seo_description_en', 500)->nullable()->after('seo_description'));
        $this->addColumn($table, 'seo_description_ar', fn (Blueprint $blueprint) => $blueprint->string('seo_description_ar', 500)->nullable()->after('seo_description_en'));
    }

    private function addColumn(string $table, string $column, Closure $definition): void
    {
        if (! Schema::hasTable($table) || Schema::hasColumn($table, $column)) {
            return;
        }

        Schema::table($table, function (Blueprint $blueprint) use ($definition): void {
            $definition($blueprint);
        });
    }

    /** @param array<int, string> $columns */
    private function dropColumns(string $table, array $columns): void
    {
        if (! Schema::hasTable($table)) {
            return;
        }

        $existing = array_values(array_filter(
            $columns,
            fn (string $column): bool => Schema::hasColumn($table, $column),
        ));

        if ($existing === []) {
            return;
        }

        Schema::table($table, fn (Blueprint $blueprint) => $blueprint->dropColumn($existing));
    }

    private function backfillEnglishColumns(): void
    {
        $this->copyColumn('silver_types', 'name', 'name_en');

        $this->copyColumn('categories', 'name', 'name_en');
        $this->copyColumn('categories', 'description', 'description_en');
        $this->copySeoColumns('categories');

        $this->copyColumn('products', 'name', 'name_en');
        $this->copyColumn('products', 'description', 'description_en');
        $this->copyColumn('products', 'care_instructions', 'care_instructions_en');
        $this->copySeoColumns('products');

        $this->copyColumn('payment_methods', 'name', 'name_en');
        $this->copyColumn('payment_methods', 'instructions', 'instructions_en');

        $this->copyColumn('pages', 'title', 'title_en');
        $this->copyColumn('pages', 'body', 'body_en');
        $this->copyColumn('pages', 'body', 'content_en');
        $this->copyColumn('pages', 'body_ar', 'content_ar');
        $this->copySeoColumns('pages');

        $this->copyColumn('faqs', 'question', 'question_en');
        $this->copyColumn('faqs', 'answer', 'answer_en');

        $this->copyColumn('banners', 'title', 'title_en');
        $this->copyColumn('banners', 'subtitle', 'subtitle_en');
    }

    private function copySeoColumns(string $table): void
    {
        $this->copyColumn($table, 'seo_title', 'seo_title_en');
        $this->copyColumn($table, 'seo_description', 'seo_description_en');
    }

    private function copyColumn(string $table, string $from, string $to): void
    {
        if (! Schema::hasTable($table) || ! Schema::hasColumn($table, $from) || ! Schema::hasColumn($table, $to)) {
            return;
        }

        DB::table($table)
            ->whereNull($to)
            ->update([$to => DB::raw($from)]);
    }
};
