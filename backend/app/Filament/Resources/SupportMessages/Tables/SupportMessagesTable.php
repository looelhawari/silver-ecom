<?php

namespace App\Filament\Resources\SupportMessages\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class SupportMessagesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('name')->searchable(),
                TextColumn::make('subject')->limit(40)->placeholder('—'),
                TextColumn::make('status')->badge()->colors([
                    'warning' => 'new',
                    'success' => 'read',
                    'gray' => 'archived',
                ]),
                TextColumn::make('created_at')->dateTime('d M Y, H:i')->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')->options([
                    'new' => 'New', 'read' => 'Read', 'archived' => 'Archived',
                ]),
            ])
            ->recordActions([EditAction::make()])
            ->toolbarActions([
                BulkActionGroup::make([DeleteBulkAction::make()]),
            ]);
    }
}
