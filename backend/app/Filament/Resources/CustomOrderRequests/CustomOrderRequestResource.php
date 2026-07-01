<?php

namespace App\Filament\Resources\CustomOrderRequests;

use App\Filament\Resources\CustomOrderRequests\Pages\CreateCustomOrderRequest;
use App\Filament\Resources\CustomOrderRequests\Pages\EditCustomOrderRequest;
use App\Filament\Resources\CustomOrderRequests\Pages\ListCustomOrderRequests;
use App\Filament\Resources\CustomOrderRequests\Schemas\CustomOrderRequestForm;
use App\Filament\Resources\CustomOrderRequests\Tables\CustomOrderRequestsTable;
use App\Modules\CustomOrders\Models\CustomOrderRequest;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use App\Support\Filament\AuthorizesWithPermission;
use UnitEnum;

class CustomOrderRequestResource extends Resource
{
    use AuthorizesWithPermission;

    protected static ?string $model = CustomOrderRequest::class;

    protected static ?string $permission = 'custom-orders.manage';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedSparkles;

    protected static string|UnitEnum|null $navigationGroup = 'Sales';

    protected static ?int $navigationSort = 2;

    protected static ?string $navigationLabel = 'Custom Requests';

    protected static ?string $modelLabel = 'Custom Request';

    public static function form(Schema $schema): Schema
    {
        return CustomOrderRequestForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return CustomOrderRequestsTable::configure($table);
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
            'index' => ListCustomOrderRequests::route('/'),
            'create' => CreateCustomOrderRequest::route('/create'),
            'edit' => EditCustomOrderRequest::route('/{record}/edit'),
        ];
    }
}
