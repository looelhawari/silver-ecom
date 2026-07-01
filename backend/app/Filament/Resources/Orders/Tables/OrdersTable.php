<?php

namespace App\Filament\Resources\Orders\Tables;

use App\Modules\Orders\Enums\OrderStatus;
use App\Modules\Orders\Enums\PaymentStatus;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class OrdersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('order_code')->searchable()->weight('bold'),
                TextColumn::make('customer_name')->searchable()->description(fn ($record) => $record->customer_phone),
                TextColumn::make('total')->money('EGP')->sortable(),
                TextColumn::make('status')->badge(),
                TextColumn::make('payment_status')->badge(),
                TextColumn::make('shipping_status')->badge()->toggleable(),
                TextColumn::make('placed_at')->dateTime('d M Y, H:i')->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')->options(OrderStatus::options()),
                SelectFilter::make('payment_status')->options(PaymentStatus::options()),
            ])
            ->recordActions([EditAction::make()]);
    }
}
