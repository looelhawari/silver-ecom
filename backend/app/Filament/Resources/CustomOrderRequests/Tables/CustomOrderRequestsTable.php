<?php

namespace App\Filament\Resources\CustomOrderRequests\Tables;

use App\Modules\CustomOrders\Enums\CustomOrderStatus;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class CustomOrderRequestsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('request_code')->searchable()->weight('bold'),
                TextColumn::make('name')->searchable()->description(fn ($record) => $record->phone),
                TextColumn::make('silverType.name')->label('Silver')->toggleable(),
                TextColumn::make('status')->badge(),
                TextColumn::make('quote.final_quote')->label('Quote')->money('EGP')->placeholder('—'),
                TextColumn::make('created_at')->dateTime('d M Y, H:i')->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')->options(CustomOrderStatus::options()),
            ])
            ->recordActions([EditAction::make()]);
    }
}
