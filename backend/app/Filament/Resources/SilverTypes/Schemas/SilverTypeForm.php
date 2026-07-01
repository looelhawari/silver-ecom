<?php

namespace App\Filament\Resources\SilverTypes\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class SilverTypeForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Silver type')->columns(2)->schema([
                TextInput::make('name')
                    ->required()->maxLength(120)->live(onBlur: true)
                    ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug((string) $state))),
                TextInput::make('name_ar')->label('Name (Arabic)')->maxLength(120),
                TextInput::make('slug')->required()->maxLength(140)->unique(ignoreRecord: true),
                TextInput::make('purity')->maxLength(20)->placeholder('925'),
                TextInput::make('gram_price')
                    ->label('Gram price (EGP)')
                    ->numeric()->required()->minValue(0)->prefix('EGP')
                    ->helperText('Changing this updates the "last updated" timestamp automatically.'),
                TextInput::make('sort_order')->numeric()->default(0),
                Toggle::make('is_active')->default(true),
            ]),
        ]);
    }
}
