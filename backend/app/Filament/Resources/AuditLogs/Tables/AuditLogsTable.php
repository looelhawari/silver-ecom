<?php

namespace App\Filament\Resources\AuditLogs\Tables;

use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class AuditLogsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('created_at')->dateTime('d M Y, H:i')->sortable(),
                TextColumn::make('user.name')->label('Actor')->placeholder('system'),
                TextColumn::make('action')->badge()->searchable(),
                TextColumn::make('description')->limit(50)->placeholder('—'),
                TextColumn::make('auditable_type')->label('Subject')
                    ->formatStateUsing(fn ($state) => $state ? class_basename($state) : '—')->toggleable(),
            ]);
    }
}
