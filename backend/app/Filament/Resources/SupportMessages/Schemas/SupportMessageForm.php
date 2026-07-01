<?php

namespace App\Filament\Resources\SupportMessages\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class SupportMessageForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Message')->columns(2)->schema([
                TextInput::make('name')->disabled(),
                TextInput::make('email')->disabled(),
                TextInput::make('phone')->disabled(),
                TextInput::make('subject')->disabled(),
                Textarea::make('message')->columnSpanFull()->rows(4)->disabled(),
                Select::make('status')->options([
                    'new' => 'New',
                    'read' => 'Read',
                    'archived' => 'Archived',
                ])->required(),
                Textarea::make('admin_note')->label('Internal note')->columnSpanFull()->rows(2),
            ]),
        ]);
    }
}
