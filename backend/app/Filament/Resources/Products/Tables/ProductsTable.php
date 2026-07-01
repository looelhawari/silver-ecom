<?php

namespace App\Filament\Resources\Products\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class ProductsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('name')->searchable()->sortable()->limit(30),
                TextColumn::make('sku')->label('SKU')->toggleable()->color('gray'),
                TextColumn::make('category.name')->badge()->toggleable(),
                TextColumn::make('silverType.name')->label('Silver')->toggleable(),
                TextColumn::make('weight_in_grams')->label('Weight')->suffix(' g')->toggleable(),
                TextColumn::make('final_price')->label('Price')->money('EGP')->sortable(),
                TextColumn::make('stock_quantity')->label('Stock')->badge()
                    ->color(fn ($state) => $state > 5 ? 'success' : ($state > 0 ? 'warning' : 'danger'))
                    ->sortable(),
                IconColumn::make('is_active')->boolean()->label('Active'),
                IconColumn::make('is_featured')->boolean()->label('Featured')->toggleable(),
            ])
            ->filters([
                SelectFilter::make('category')->relationship('category', 'name'),
                SelectFilter::make('silver_type')->relationship('silverType', 'name'),
                TernaryFilter::make('is_active'),
                TernaryFilter::make('is_featured'),
                TernaryFilter::make('is_best_seller'),
            ])
            ->recordActions([EditAction::make()])
            ->toolbarActions([
                BulkActionGroup::make([DeleteBulkAction::make()]),
            ]);
    }
}
