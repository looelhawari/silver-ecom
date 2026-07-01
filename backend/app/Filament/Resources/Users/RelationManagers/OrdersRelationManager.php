<?php

namespace App\Filament\Resources\Users\RelationManagers;

use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class OrdersRelationManager extends RelationManager
{
    protected static string $relationship = 'orders';

    protected static ?string $title = 'Orders';

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('order_code')
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('order_code')->searchable(),
                TextColumn::make('total')->money('EGP'),
                TextColumn::make('status')->badge(),
                TextColumn::make('payment_status')->badge(),
                TextColumn::make('placed_at')->dateTime('d M Y'),
            ]);
    }
}
