<?php

namespace App\Filament\Resources\Users\RelationManagers;

use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class CustomRequestsRelationManager extends RelationManager
{
    protected static string $relationship = 'customOrderRequests';

    protected static ?string $title = 'Custom requests';

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('request_code')
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('request_code')->searchable(),
                TextColumn::make('status')->badge(),
                TextColumn::make('quote.final_quote')->label('Quote')->money('EGP')->placeholder('—'),
                TextColumn::make('created_at')->dateTime('d M Y'),
            ]);
    }
}
