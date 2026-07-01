<?php

namespace App\Filament\Resources\Banners\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class BannerForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Banner')->columns(2)->schema([
                TextInput::make('title')->maxLength(160),
                TextInput::make('title_ar')->label('Title (Arabic)')->maxLength(160),
                TextInput::make('subtitle')->maxLength(255),
                TextInput::make('subtitle_ar')->label('Subtitle (Arabic)')->maxLength(255),
                FileUpload::make('image_path')->label('Image')->image()->disk('public')
                    ->directory('banners')->imageEditor()->required()->columnSpanFull(),
                TextInput::make('link_url')->url()->maxLength(255),
                Select::make('placement')->options([
                    'home_hero' => 'Home hero',
                    'home_promo' => 'Home promo strip',
                ])->default('home_hero')->required(),
                TextInput::make('sort_order')->numeric()->default(0),
                Toggle::make('is_active')->default(true),
                DateTimePicker::make('starts_at'),
                DateTimePicker::make('ends_at'),
            ]),
        ]);
    }
}
