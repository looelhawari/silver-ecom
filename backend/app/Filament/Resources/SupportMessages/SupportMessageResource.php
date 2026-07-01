<?php

namespace App\Filament\Resources\SupportMessages;

use App\Filament\Resources\SupportMessages\Pages\CreateSupportMessage;
use App\Filament\Resources\SupportMessages\Pages\EditSupportMessage;
use App\Filament\Resources\SupportMessages\Pages\ListSupportMessages;
use App\Filament\Resources\SupportMessages\Schemas\SupportMessageForm;
use App\Filament\Resources\SupportMessages\Tables\SupportMessagesTable;
use App\Modules\Support\Models\SupportMessage;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use App\Support\Filament\AuthorizesWithPermission;
use UnitEnum;

class SupportMessageResource extends Resource
{
    use AuthorizesWithPermission;

    protected static ?string $model = SupportMessage::class;

    protected static ?string $permission = 'support.manage';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedChatBubbleLeftRight;

    protected static string|UnitEnum|null $navigationGroup = 'Support';

    protected static ?int $navigationSort = 1;

    public static function canCreate(): bool
    {
        return false; // messages arrive from the public contact form
    }

    public static function form(Schema $schema): Schema
    {
        return SupportMessageForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return SupportMessagesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListSupportMessages::route('/'),
            'create' => CreateSupportMessage::route('/create'),
            'edit' => EditSupportMessage::route('/{record}/edit'),
        ];
    }
}
