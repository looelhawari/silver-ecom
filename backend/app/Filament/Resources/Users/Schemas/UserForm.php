<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Customer')->columns(2)->schema([
                TextInput::make('name')->required()->maxLength(160),
                TextInput::make('email')->email()->disabled(),
                TextInput::make('phone')->maxLength(30),
                TextInput::make('whatsapp')->maxLength(30),
                Toggle::make('is_blocked')->label('Blocked')
                    ->helperText('Blocked customers cannot sign in.'),
            ]),
        ]);
    }
}
