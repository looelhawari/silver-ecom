<?php

namespace App\Filament\Resources\Users\Tables;

use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class UsersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('name')->searchable()->sortable(),
                TextColumn::make('email')->searchable()->toggleable(),
                TextColumn::make('phone')->placeholder('—'),
                TextColumn::make('orders_count')->counts('orders')->label('Orders'),
                IconColumn::make('is_blocked')->boolean()->label('Blocked')
                    ->trueColor('danger')->falseColor('success'),
                TextColumn::make('created_at')->date('d M Y')->sortable(),
            ])
            ->filters([
                TernaryFilter::make('is_blocked')->label('Blocked'),
            ])
            ->recordActions([EditAction::make()]);
    }
}
