<?php

namespace App\Filament\Resources\SilverTypes;

use App\Filament\Resources\SilverTypes\Pages\CreateSilverType;
use App\Filament\Resources\SilverTypes\Pages\EditSilverType;
use App\Filament\Resources\SilverTypes\Pages\ListSilverTypes;
use App\Filament\Resources\SilverTypes\Schemas\SilverTypeForm;
use App\Filament\Resources\SilverTypes\Tables\SilverTypesTable;
use App\Modules\Catalog\Models\SilverType;
use App\Support\Filament\AuthorizesWithPermission;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class SilverTypeResource extends Resource
{
    use AuthorizesWithPermission;

    protected static ?string $model = SilverType::class;

    protected static ?string $permission = 'silver-types.manage';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedSparkles;

    protected static string|UnitEnum|null $navigationGroup = 'Catalog';

    protected static ?int $navigationSort = 3;

    public static function form(Schema $schema): Schema
    {
        return SilverTypeForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return SilverTypesTable::configure($table);
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
            'index' => ListSilverTypes::route('/'),
            'create' => CreateSilverType::route('/create'),
            'edit' => EditSilverType::route('/{record}/edit'),
        ];
    }
}
