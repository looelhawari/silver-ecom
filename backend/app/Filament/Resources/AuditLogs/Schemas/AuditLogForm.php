<?php

namespace App\Filament\Resources\AuditLogs\Schemas;

use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class AuditLogForm
{
    public static function configure(Schema $schema): Schema
    {
        // Read-only: the audit trail is append-only.
        return $schema->components([
            Section::make('Audit entry')->columns(2)->schema([
                TextInput::make('action')->disabled(),
                TextInput::make('user.name')->label('Actor')->disabled(),
                TextInput::make('auditable_type')->disabled(),
                TextInput::make('auditable_id')->disabled(),
                TextInput::make('ip_address')->disabled(),
                TextInput::make('created_at')->disabled(),
                Textarea::make('description')->columnSpanFull()->disabled(),
            ]),
        ]);
    }
}
