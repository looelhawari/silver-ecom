<?php

namespace App\Filament\Resources\Categories\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class CategoryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Category')->columns(2)->schema([
                TextInput::make('name')
                    ->required()->maxLength(120)->live(onBlur: true)
                    ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug((string) $state))),
                TextInput::make('name_ar')->label('Name (Arabic)')->maxLength(120),
                TextInput::make('slug')->required()->maxLength(140)->unique(ignoreRecord: true),
                TextInput::make('sort_order')->numeric()->default(0),
                Textarea::make('description')->columnSpanFull()->rows(2),
                Textarea::make('description_ar')->label('Description (Arabic)')->columnSpanFull()->rows(2),
                FileUpload::make('image_path')->label('Image')->image()
                    ->directory('categories')->disk('public')->imageEditor(),
                Toggle::make('is_active')->default(true),
            ]),
            Section::make('SEO')->columns(2)->collapsed()->schema([
                TextInput::make('seo_title')->maxLength(160),
                TextInput::make('seo_description')->maxLength(300),
            ]),
        ]);
    }
}
