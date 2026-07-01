<?php

namespace App\Filament\Resources\SilverTypes\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class SilverTypesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('sort_order')
            ->columns([
                TextColumn::make('name')->searchable()->sortable(),
                TextColumn::make('purity')->badge(),
                TextColumn::make('gram_price')->label('Gram price')->money('EGP')->sortable(),
                TextColumn::make('gram_price_updated_at')->label('Price updated')->since()->sortable(),
                TextColumn::make('products_count')->counts('products')->label('Products'),
                IconColumn::make('is_active')->boolean(),
            ])
            ->recordActions([EditAction::make()])
            ->toolbarActions([
                BulkActionGroup::make([DeleteBulkAction::make()]),
            ]);
    }
}
