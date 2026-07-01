<?php

namespace App\Filament\Resources\Pages\Schemas;

use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class PageForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Page')->columns(2)->schema([
                TextInput::make('title')->required()->maxLength(160)->live(onBlur: true)
                    ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug((string) $state))),
                TextInput::make('title_ar')->label('Title (Arabic)')->maxLength(160),
                TextInput::make('slug')->required()->maxLength(180)->unique(ignoreRecord: true),
                Toggle::make('is_published')->default(true),
                Textarea::make('body')->columnSpanFull()->rows(10),
                Textarea::make('body_ar')->label('Body (Arabic)')->columnSpanFull()->rows(10),
            ]),
            Section::make('SEO')->columns(2)->collapsed()->schema([
                TextInput::make('seo_title')->maxLength(160),
                TextInput::make('seo_description')->maxLength(300),
            ]),
        ]);
    }
}
